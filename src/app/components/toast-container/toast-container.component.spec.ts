import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ToastService } from '../../services/toast/toast.service'
import { ToastContainerComponent } from './toast-container.component'

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent
  let fixture: ComponentFixture<ToastContainerComponent>
  let toastService: ToastService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
    }).compileComponents()

    TestBed.overrideComponent(ToastContainerComponent, {
      set: { template: '' },
    })

    fixture = TestBed.createComponent(ToastContainerComponent)
    component = fixture.componentInstance
    toastService = TestBed.inject(ToastService)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should expose toast state from service', () => {
    toastService.show('Toast visible', 'success', 5000)

    const exposedService = component as unknown as {
      toastService: { toast: () => { message: string } | null }
    }

    expect(exposedService.toastService.toast()?.message).toBe('Toast visible')
  })
})
