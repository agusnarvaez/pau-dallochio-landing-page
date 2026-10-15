import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ContactComponent } from './contact.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('ContactComponent', () => {
  let component: ContactComponent
  let fixture: ComponentFixture<ContactComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContactComponent, RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()

    fixture = TestBed.createComponent(ContactComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
