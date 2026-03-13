import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { buildSanityQuery, buildTokkoQuery } from './filter-query.builder'

export type OperationType = 'Venta' | 'Alquiler'
export type PropertyType = 'Departamento' | 'Casa' | 'PH'
export type SortDirection = 'ASC' | 'DESC'

export interface Filters {
  operation_type?: OperationType
  type?: PropertyType
  rooms?: number
  minPrice?: number
  maxPrice?: number
  order_by?: string
  order?: SortDirection
  [key: string]: string | boolean | number | undefined
}

export interface FilterObject {
  name: string
  value: string | boolean | number
}

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private readonly filtersSubject = new BehaviorSubject<Filters>({})
  readonly filters$ = this.filtersSubject.asObservable()

  get = (): Filters => this.filtersSubject.value

  private sanitizeFilters(filters: Filters): Filters {
    return Object.entries(filters).reduce((cleaned, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return cleaned
      }

      if (typeof value === 'number' && value <= 0) {
        return cleaned
      }

      cleaned[key] = value
      return cleaned
    }, {} as Filters)
  }

  private set(filters: Filters): void {
    this.filtersSubject.next(this.sanitizeFilters(filters))
  }

  patch(filters: Partial<Filters>): void {
    this.set({ ...this.get(), ...filters })
  }

  getSanityQuery(): string {
    return buildSanityQuery(this.get())
  }

  getTokkoQuery(): string {
    return buildTokkoQuery(this.get())
  }

  add(filterObj: FilterObject): void {
    this.patch({ [filterObj.name]: filterObj.value })
  }

  remove(filterObj: FilterObject): void {
    const nextFilters = { ...this.get() }
    delete nextFilters[filterObj.name]
    this.set(nextFilters)
  }

  clear(): void {
    this.filtersSubject.next({})
  }

  isActive(
    filterName: string,
    expectedValue?: string | boolean | number,
  ): boolean {
    const actualValue = this.get()[filterName]

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
