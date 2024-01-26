import { Injectable } from '@angular/core'

export interface Filters{
  [key:string]:string | boolean
}

export interface FilterObject {
  name: string
  value: string | boolean
}

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private _filters: Filters = {
  }

  get = (): Filters => this._filters


  getSanityQuery(): string {
    const baseQuery = '*[_type == "property"'
    const filterQuery = Object.keys(this._filters)
      .map(key => {
        const value = this._filters[key]
        if (typeof value === 'boolean' && value) {
          return ` && ${key} == true`
        } else if (typeof value === 'string') {
          if(value=='Venta' || value=='Alquiler'){
            return ` && operation_type->title == "${value}"`
          }
          return ` && ${key} == "${value}"`
        }
        return ''
      })
      .join('')

    return `${baseQuery}${filterQuery}]{
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
  }

  getTokkoQuery(): string {
    const base_query= {
      current_localization_id:0,
      current_localization_type:"country",
      price_from:0,
      price_to:999999999,
      operation_types:[1,2,3],
      property_types:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
      currency:"ANY",
      filters:[]
    }

    if(this._filters["operation_type"]=="Venta") base_query.operation_types=[1]

    if(this._filters["operation_type"]=="Alquiler") base_query.operation_types=[2,3]

    return JSON.stringify(base_query)

  }

  add(filterObj: FilterObject): void {
    this._filters[filterObj.name] = filterObj.value
  }

  remove(filterObj: FilterObject): void {
    delete this._filters[filterObj.name]
  }

  clear(): void {
    this._filters = {}
  }

  isActive(filterName: string, expectedValue?: string | boolean): boolean {
    const actualValue = this._filters[filterName]

    if (expectedValue === undefined) {
      // Si no se especifica un valor esperado, solo verifica si la clave existe y no es falsa.
      return !!actualValue
    } else {
      // Compara el valor actual con el valor esperado.
      return actualValue === expectedValue
    }
  }

  toggle(filterObj: FilterObject): void {
    if (this.isActive(filterObj.name,filterObj.value)) {
      this.remove(filterObj)
    } else {
      this.add(filterObj)
    }

  }
}