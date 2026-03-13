import { TestBed } from '@angular/core/testing'

import { FiltersService } from './filters.service'

describe('FiltersService', () => {
  let service: FiltersService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(FiltersService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should sanitize invalid numeric and empty values on patch', () => {
    service.patch({
      operation_type: 'Venta',
      minPrice: 0,
      maxPrice: -10,
      order_by: '',
      rooms: 2,
    })

    expect(service.get()).toEqual({
      operation_type: 'Venta',
      rooms: 2,
    })
  })

  it('should add and remove filters', () => {
    service.add({ name: 'type', value: 'Casa' })
    expect(service.get().type).toBe('Casa')

    service.remove({ name: 'type', value: 'Casa' })
    expect(service.get().type).toBeUndefined()
  })

  it('should toggle filter active state', () => {
    service.toggle({ name: 'operation_type', value: 'Alquiler' })
    expect(service.isActive('operation_type', 'Alquiler')).toBeTrue()

    service.toggle({ name: 'operation_type', value: 'Alquiler' })
    expect(service.isActive('operation_type', 'Alquiler')).toBeFalse()
  })

  it('should clear all filters', () => {
    service.patch({ operation_type: 'Venta', type: 'PH', rooms: 3 })
    expect(Object.keys(service.get()).length).toBeGreaterThan(0)

    service.clear()
    expect(service.get()).toEqual({})
  })
})
