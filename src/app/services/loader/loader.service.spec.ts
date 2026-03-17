import { TestBed } from '@angular/core/testing'

import { LoaderService } from './loader.service'

describe('LoaderService', () => {
  let service: LoaderService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LoaderService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should start with loading false', () => {
    expect(service.loading).toBeFalse()
  })

  it('should set loading true with showLoading and false with hideLoading', () => {
    service.showLoading()
    expect(service.loading).toBeTrue()

    service.hideLoading()
    expect(service.loading).toBeFalse()
  })

  it('should emit loading state changes through loading$', () => {
    const values: boolean[] = []
    const subscription = service.loading$.subscribe((value) => {
      values.push(value)
    })

    service.showLoading()
    service.hideLoading()

    expect(values).toEqual([false, true, false])
    subscription.unsubscribe()
  })
})
