import { Injectable } from '@angular/core'

export interface Filters {
  [key: string]: string | boolean | number
}

export interface FilterObject {
  name: string
  value: string | boolean | number
}
type FilterCondition = [string, '=', string | number]

interface TokkoQuery {
  current_localization_id: number
  current_localization_type: string
  price_from: number
  price_to: number
  operation_types: number[]
  property_types: number[]
  currency: string
  filters: FilterCondition[]
}
@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private _filters: Filters = {}

  get = (): Filters => this._filters

  getSanityQuery(): string {
    const baseQuery = '*[_type == "property"'
    const filterQuery = Object.keys(this._filters)
      .map((key) => {
        const value = this._filters[key]
        if (typeof value === 'boolean' && value) {
          return ` && ${key} == true`
        } else if (typeof value === 'string') {
          if (value == 'Venta' || value == 'Alquiler') {
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
    const base_query: TokkoQuery = {
      current_localization_id: 0,
      current_localization_type: 'country',
      price_from: 0,
      price_to: 999999999,
      operation_types: [1, 2, 3],
      property_types: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25,
      ],
      currency: 'ANY',
      filters: [],
    }

    if (this._filters['operation_type'] == 'Venta')
      base_query.operation_types = [1]

    if (this._filters['operation_type'] == 'Alquiler')
      base_query.operation_types = [2, 3]

    /* if(this._filters['rooms'] > '0') base_query.filters.push(['room_amount', '=', this._filters['rooms']]) */

    if (
      typeof this._filters['rooms'] === 'number' &&
      this._filters['rooms'] > 0
    ) {
      base_query.filters.push(['room_amount', '=', this._filters['rooms']])
    }

    if (this._filters['type'] == 'Departamento') base_query.property_types = [2]
    else if (this._filters['type'] == 'Casa') base_query.property_types = [3]
    else if (this._filters['type'] == 'PH') base_query.property_types = [13]

    if (this._filters['minPrice'])
      base_query.price_from = Number(this._filters['minPrice'])
    if (this._filters['maxPrice'])
      base_query.price_to = Number(this._filters['maxPrice'])

    console.log(JSON.stringify(base_query))
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

  isActive(
    filterName: string,
    expectedValue?: string | boolean | number,
  ): boolean {
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
    if (this.isActive(filterObj.name, filterObj.value)) {
      this.remove(filterObj)
    } else {
      this.add(filterObj)
    }
  }
}
