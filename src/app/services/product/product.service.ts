import { Injectable } from '@angular/core'
import { FiltersService } from '../filters/filters.service'
import {
  Observable,
  catchError,
  forkJoin,
  map,
  shareReplay,
  throwError,
} from 'rxjs'
import { Product, SanityProduct, TokkoProduct } from '../../models/product'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../enviroment.prod'

interface TokkoResponse {
  objects: TokkoProduct[]
}
interface SanityResponse {
  result: SanityProduct[]
}

interface CacheStats {
  listHits: number
  listMisses: number
  byIdHits: number
  byIdMisses: number
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsListCache = new Map<string, Observable<Product[]>>()
  private readonly productByIdCache = new Map<string, Observable<Product>>()
  private readonly maxListCacheEntries = 20
  private readonly maxByIdCacheEntries = 50
  private cacheStats: CacheStats = {
    listHits: 0,
    listMisses: 0,
    byIdHits: 0,
    byIdMisses: 0,
  }

  filtersService: FiltersService

  constructor(
    filters: FiltersService,
    private http: HttpClient,
  ) {
    this.filtersService = filters
  }

  filters = () => this.filtersService.get()

  private toAppError(error: unknown, fallbackMessage: string): Error {
    const possibleError = error as { message?: string }
    return new Error(possibleError?.message ?? fallbackMessage)
  }

  private setCachedObservable<T>(
    cache: Map<string, Observable<T>>,
    cacheKey: string,
    value: Observable<T>,
    maxEntries: number,
  ): void {
    if (cache.size >= maxEntries) {
      const firstKey = cache.keys().next().value
      if (firstKey) {
        cache.delete(firstKey)
      }
    }

    cache.set(cacheKey, value)
  }

  clearCache(): void {
    this.productsListCache.clear()
    this.productByIdCache.clear()
  }

  clearListCache(): void {
    this.productsListCache.clear()
  }

  clearByIdCache(): void {
    this.productByIdCache.clear()
  }

  invalidateByIdCache(id: string): void {
    this.productByIdCache.delete(`tokko:${id}`)
    this.productByIdCache.delete(`sanity:${id}`)
  }

  getCacheStats(): CacheStats {
    return {
      ...this.cacheStats,
    }
  }

  resetCacheStats(): void {
    this.cacheStats = {
      listHits: 0,
      listMisses: 0,
      byIdHits: 0,
      byIdMisses: 0,
    }
  }

  getAll(): Observable<Product[]> {
    const tokkoQuery = this.filtersService.getTokkoQuery()
    const cacheKey = `tokko:${tokkoQuery}`
    const cachedRequest = this.productsListCache.get(cacheKey)

    if (cachedRequest) {
      this.cacheStats.listHits += 1
      return cachedRequest
    }

    this.cacheStats.listMisses += 1

    const request$ = forkJoin({
      tokko: this.getAllFromTokko(tokkoQuery),
      // TODO: Agregar peticiones de Sanity cuando Pau agregue propiedades
      /* sanity: this.getAllFromSanity() */
    }).pipe(
      map((results) => {
        // Combinar los resultados de Tokko y Sanity
        // TODO: Agregar peticiones de Sanity cuando Pau agregue propiedades
        return [...results.tokko /* , ...results.sanity */]
      }),
      catchError((error) => {
        this.productsListCache.delete(cacheKey)
        return throwError(() =>
          this.toAppError(error, 'No pudimos cargar el listado de propiedades'),
        )
      }),
      shareReplay(1),
    )

    this.setCachedObservable(
      this.productsListCache,
      cacheKey,
      request$,
      this.maxListCacheEntries,
    )

    return request$
  }

  private getAllFromTokko(tokkoQuery: string): Observable<Product[]> {
    return this.http
      .get<TokkoResponse>(
        `https://www.tokkobroker.com/api/v1/property/search?limit=50&lang=es_ar&key=${environment.tokkoBrokerKey}&${tokkoQuery}`,
      )
      .pipe(
        catchError((error) => {
          return throwError(() =>
            this.toAppError(error, 'No pudimos consultar Tokko Broker'),
          )
        }),
        map((response) => {
          // Aquí puedes hacer alguna transformación de los datos si es necesario.
          return response.objects.map((p) => new Product().fromTokko(p))
        }),
      )
  }

  private getAllFromSanity(): Observable<Product[]> {
    const encodedQuery = encodeURIComponent(
      this.filtersService.getSanityQuery(),
    )
    return this.http
      .get<SanityResponse>(
        `https://${environment.sanityKey}.api.sanity.io/v2022-03-07/data/query/production?query=${encodedQuery}`,
      )
      .pipe(
        catchError((error) => {
          return throwError(() =>
            this.toAppError(error, 'No pudimos consultar Sanity'),
          )
        }),
        map((response) => {
          // Aquí puedes hacer alguna transformación de los datos si es necesario.
          return response.result.map((p) => {
            return new Product().fromSanity(p)
          })
        }),
      )
  }

  getById(id: string): Observable<Product> {
    const source = id.length > 10 ? 'sanity' : 'tokko'
    const cacheKey = `${source}:${id}`
    const cachedRequest = this.productByIdCache.get(cacheKey)

    if (cachedRequest) {
      this.cacheStats.byIdHits += 1
      return cachedRequest
    }

    this.cacheStats.byIdMisses += 1

    const request$ =
      source === 'sanity'
        ? this.getSanityProductById(id)
        : this.getTokkoProductById(id)

    const cachedStream$ = request$.pipe(
      catchError((error) => {
        this.productByIdCache.delete(cacheKey)
        return throwError(() =>
          this.toAppError(
            error,
            'No pudimos cargar el detalle de la propiedad',
          ),
        )
      }),
      shareReplay(1),
    )

    this.setCachedObservable(
      this.productByIdCache,
      cacheKey,
      cachedStream$,
      this.maxByIdCacheEntries,
    )

    return cachedStream$
  }

  private getTokkoProductById(id: string): Observable<Product> {
    return this.http
      .get<TokkoProduct>(
        `https://www.tokkobroker.com/api/v1/property/${id}/?lang=es_ar&key=${environment.tokkoBrokerKey}`,
      )
      .pipe(
        catchError((error) => {
          return throwError(() =>
            this.toAppError(
              error,
              'No pudimos cargar el detalle desde Tokko Broker',
            ),
          )
        }),
        map((response) => {
          // Aquí puedes hacer alguna transformación de los datos si es necesario.
          return new Product().fromTokko(response)
        }),
      )
  }

  private getSanityProductById(id: string): Observable<Product> {
    const query = `*[_id=="${id}"]{
      ...,
      operation_type->{
          title
      },
      currency->{
          title
      },
      type->{
          title
      },
      images[]{
          asset->{
              path, url
          }
      },
      cover{
          asset->{
              path, url
          }
      }
    }`
    return this.http
      .get<SanityResponse>(
        `https://${environment.sanityKey}.api.sanity.io/v2022-03-07/data/query/production?query=${query}`,
      )
      .pipe(
        catchError((error) => {
          return throwError(() =>
            this.toAppError(error, 'No pudimos cargar el detalle desde Sanity'),
          )
        }),
        map((response) => {
          // Aquí puedes hacer alguna transformación de los datos si es necesario.
          /* console.log(response.result[0]) */
          return new Product().fromSanity(response.result[0])
        }),
      )
  }

  getSuggested = (id: string) => {
    return this.getAll().pipe(
      map((products) => {
        return products.filter((p) => p.id !== id)
      }) /* ,
      map((products) => {
        return products.slice(0, 3)
      }) */,
    )
  }
}
