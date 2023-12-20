import { Address } from './../../models/address'
import { Injectable } from '@angular/core'
import { productsMock } from '../../models/common.mock'
import { FiltersService } from '../filters/filters.service'
import { Observable, catchError, map,throwError } from 'rxjs'
import { ProductDetail, ProductList } from '../../models/product'
import { HttpClient } from '@angular/common/http'
import { enviroment } from '../../../../enviroment.prod'

interface ApiResponse {
  objects: ProductListResponse[];
}

interface ProductListResponse {
  id: string
  type: { name: string }
  address: string
  branch: { address: string }
  operations: [{ prices: [{ price: number,currency:string }] }]
  total_surface: number
  roofed_surface: number
  room_amount: number
  rich_description: string
  bathroom_amount: number
  photos: { image: string }[]
  geo_lat: number
  geo_long: number
  floors_amount: number
  location: { name: string }
  parking_lot_amount: number
  property_condition:string
  publication_title:string
  situation:string
  tags:[
    {
      id:number,
      name:string
      type:number
    }
  ]
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

  getAll(filters:string[]):Observable<ProductList[]> {
    console.log("filtros",filters)

    return this.http
            .get<ApiResponse>(`https://www.tokkobroker.com/api/v1/property/?lang=es_ar&key=${enviroment.tokkoBrokerKey}`)
            .pipe(
              catchError(error => {
                return throwError(() => new Error(error.message))
              }),
              map((response) => {
                // Aquí puedes hacer alguna transformación de los datos si es necesario.

                return response.objects.map((p) => {
                  return new ProductList(
                    p.id,
                    p.type.name,
                    new Address(
                      p.address,
                      p.location.name,
                      ),
                      p.operations[0].prices[0].price,
                      p.operations[0].prices[0].currency,
                    p.total_surface,
                    p.roofed_surface,
                    p.room_amount,
                    p.bathroom_amount,
                    p.photos.map((photo) => photo.image)
                  )
                })
              }))
  }
  /* => productsMock.find(p => p.id === id) */
  getById(id: string):Observable<ProductDetail> {
    return this.http
            .get<ProductListResponse>(`https://www.tokkobroker.com/api/v1/property/${id}/?lang=es_ar&key=${enviroment.tokkoBrokerKey}`)
            .pipe(
              catchError(error => {
                return throwError(() => new Error(error.message))
              }),
              map((response) => {
                // Aquí puedes hacer alguna transformación de los datos si es necesario.
                return new ProductDetail(
                  response.id,
                  response.publication_title,
                  response.type.name,
                  new Address(
                    response.address,
                    response.location.name,
                    ),
                    response.geo_lat,
                    response.geo_long,
                    response.operations[0].prices[0].price,
                    response.operations[0].prices[0].currency,
                  response.total_surface,
                  response.roofed_surface,
                  response.room_amount,
                  response.bathroom_amount,
                  response.parking_lot_amount,
                  response.photos.map((photo) => photo.image),
                  response.rich_description,
                  /* response.floors_amount,
                  response.tags.map((tag) => tag.name),
                  response.situation,
                  response.property_condition */
                )
              }))
  }

  getSuggested = (id:string) => {
    console.log(id)
    return productsMock.slice(0, 3)
  }
}