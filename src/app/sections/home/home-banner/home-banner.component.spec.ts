import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { ProductService } from '../../../services/product/product.service'
import { ScrollService } from '../../../services/scroll/scroll.service'

import { HomeBannerComponent } from './home-banner.component'

describe('HomeBannerComponent', () => {
  let component: HomeBannerComponent
  let fixture: ComponentFixture<HomeBannerComponent>
  let routerStub: jasmine.SpyObj<Router>
  let productServiceStub: ProductService
  let scrollServiceSpy: jasmine.SpyObj<ScrollService>
  let filtersServiceStub: {
    isActive: jasmine.Spy
    toggle: jasmine.Spy
  }

  beforeEach(async () => {
    routerStub = jasmine.createSpyObj<Router>('Router', ['navigate'])
    scrollServiceSpy = jasmine.createSpyObj<ScrollService>('ScrollService', [
      'scrollToTopAfterNextNavigation',
    ])
    filtersServiceStub = {
      isActive: jasmine.createSpy('isActive').and.returnValue(false),
      toggle: jasmine.createSpy('toggle'),
    }
    productServiceStub = {
      filtersService: filtersServiceStub,
    } as unknown as ProductService

    await TestBed.configureTestingModule({
      imports: [HomeBannerComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ProductService, useValue: productServiceStub },
        { provide: ScrollService, useValue: scrollServiceSpy },
      ],
    }).compileComponents()

    TestBed.overrideComponent(HomeBannerComponent, {
      set: { template: '' },
    })

    fixture = TestBed.createComponent(HomeBannerComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should check if operation filter is active', () => {
    filtersServiceStub.isActive.and.returnValue(true)

    const isActive = component.isFilterActive('Alquiler')

    expect(isActive).toBeTrue()
    expect(filtersServiceStub.isActive).toHaveBeenCalledWith(
      'operation_type',
      'Alquiler',
    )
  })

  it('should toggle selected filter', () => {
    component.toggleFilter({
      name: 'operation_type',
      value: 'Venta',
    })

    expect(filtersServiceStub.toggle).toHaveBeenCalledWith({
      name: 'operation_type',
      value: 'Venta',
    })
  })

  it('should navigate to catalog and request scroll reset', () => {
    component.searchProducts()

    expect(
      scrollServiceSpy.scrollToTopAfterNextNavigation,
    ).toHaveBeenCalledWith(routerStub)
    expect(routerStub.navigate).toHaveBeenCalledWith(['/catalogo'])
  })

  it('should update local active flags in ngInInit method', () => {
    spyOn(component, 'isFilterActive').and.callFake(
      (filterName: string) => filterName === 'Alquiler',
    )

    component.ngInInit()

    expect(component.isRentFilterActive).toBeTrue()
    expect(component.isSellFilterActive).toBeFalse()
  })
})
