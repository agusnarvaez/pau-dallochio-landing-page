import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ToastService } from './toast.service'

describe('ToastService', () => {
  let service: ToastService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ToastService)
  })

  it('should create', () => {
    expect(service).toBeTruthy()
  })

  it('should show toast with defaults and auto dismiss', fakeAsync(() => {
    service.show('Mensaje de prueba')

    expect(service.toast()).toEqual({
      message: 'Mensaje de prueba',
      type: 'info',
      duration: 2600,
    })

    tick(2600)
    expect(service.toast()).toBeNull()
  }))

  it('should clear previous timeout when showing a new toast', fakeAsync(() => {
    service.show('Primero', 'success', 1000)
    tick(500)

    service.show('Segundo', 'error', 2000)
    tick(600)

    expect(service.toast()?.message).toBe('Segundo')

    tick(1400)
    expect(service.toast()).toBeNull()
  }))

  it('should dismiss current toast immediately', () => {
    service.show('Visible', 'success', 5000)

    service.dismiss()

    expect(service.toast()).toBeNull()
  })
})
