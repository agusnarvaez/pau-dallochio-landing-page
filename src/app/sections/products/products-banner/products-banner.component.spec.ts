import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ProductsBannerComponent } from './products-banner.component'

describe('ProductsBannerComponent', () => {
  let component: ProductsBannerComponent
  let fixture: ComponentFixture<ProductsBannerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsBannerComponent, RouterTestingModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductsBannerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
