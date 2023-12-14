import { Injectable } from '@angular/core'
import { productsMock } from '../../models/common.mock'
import {FiltersService} from '../filters/filters.service'
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  filtersService: FiltersService

  constructor(filters:FiltersService) {
    this.filtersService = filters
  }

  filters=( ) => this.filtersService.get()

  getAll = ( ) => productsMock

  getById = (id: string) => productsMock.find(p => p.id === id)
}