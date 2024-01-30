import { Injectable } from '@angular/core'
import { FiltersService } from '../filters/filters.service'
import { Observable, catchError, forkJoin, map,throwError } from 'rxjs'
import { Product, SanityProduct, TokkoProduct } from '../../models/product'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../enviroment.prod'

interface TokkoResponse {
  objects: TokkoProduct[]
}
interface SanityResponse {
  result: SanityProduct[]
}



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  filtersService: FiltersService

  constructor(
    filters:FiltersService,
    private http: HttpClient
    ) {
    this.filtersService = filters
  }

  filters=( ) => this.filtersService.get()

  getAll():Observable<Product[]> {

    return forkJoin({
      tokko: this.getAllFromTokko(),
      // TODO: Agregar peticiones de Sanity cuando Pau agregue propiedades
      /* sanity: this.getAllFromSanity() */
    }).pipe(
        map(results => {
            // Combinar los resultados de Tokko y Sanity
            // TODO: Agregar peticiones de Sanity cuando Pau agregue propiedades
            return [...results.tokko/* , ...results.sanity */]
        }),
        catchError(error => {
            // Manejar el error
            return throwError(() => new Error(error.message))
        })
    )
  }

  private getAllFromTokko():Observable<Product[]> {

    return this.http
            .get<TokkoResponse>(`https://www.tokkobroker.com/api/v1/property/search?lang=es_ar&key=${environment.tokkoBrokerKey}&data=${this.filtersService.getTokkoQuery()}`)
            .pipe(
              catchError(error => {
                return throwError(() => new Error(error.message))
              }),
              map((response) => {
                // Aquí puedes hacer alguna transformación de los datos si es necesario.
                return response.objects.map((p) => {
                  return new Product().fromTokko(p)
                })
              }))
  }

  private getAllFromSanity():Observable<Product[]> {

    const encodedQuery = encodeURIComponent(this.filtersService.getSanityQuery())
    return this.http
            .get<SanityResponse>(`https://${environment.sanityKey}.api.sanity.io/v2022-03-07/data/query/production?query=${encodedQuery}`)
            .pipe(
              catchError(error => {
                return throwError(() => new Error(error.message))
              }),
              map((response) => {
                // Aquí puedes hacer alguna transformación de los datos si es necesario.
                return response.result.map((p) => {
                  return new Product().fromSanity(p)
                })
              }))
  }

  getById(id: string):Observable<Product> {
    if(id.length > 10){
      this.getSanityProductById(id)
    }
    return this.getTokkoProductById(id)
  }

  private getTokkoProductById(id: string): Observable<Product> {
    return this.http
      .get<TokkoProduct>(`https://www.tokkobroker.com/api/v1/property/${id}/?lang=es_ar&key=${environment.tokkoBrokerKey}`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.message))
        }),
        map((response) => {
          // Aquí puedes hacer alguna transformación de los datos si es necesario.
          return new Product().fromTokko(response)
        }))
  }

  private getSanityProductById(id: string):Observable<Product> {
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
          .get<SanityResponse>(`https://${environment.sanityKey}.api.sanity.io/v2022-03-07/data/query/production?query=${query}`)
          .pipe(
            catchError(error => {
              return throwError(() => new Error(error.message))
            }),
            map((response) => {
              // Aquí puedes hacer alguna transformación de los datos si es necesario.
              /* console.log(response.result[0]) */
              return new Product( ).fromSanity(response.result[0])
            }))
  }

  getSuggested = (id:string) => {
    return this.getAll().pipe(
      map((products) => {
        return products.filter((p) => p.id !== id)
      })/* ,
      map((products) => {
        return products.slice(0, 3)
      }) */
    )
  }
}