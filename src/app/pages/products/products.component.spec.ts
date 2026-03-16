import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Subject, of, throwError } from 'rxjs'
import { ProductService } from '../../services/product/product.service'
import { LoaderService } from '../../services/loader/loader.service'
import { SeoService } from '../../services/seo/seo.service'

import { ProductsComponent } from './products.component'

describe('ProductsComponent', () => {
  let component: ProductsComponent
  let fixture: ComponentFixture<ProductsComponent>
  let productServiceSpy: jasmine.SpyObj<ProductService>
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>
  let seoServiceSpy: jasmine.SpyObj<SeoService>
  let filtersChanges$: Subject<Record<string, unknown>>
  let activeFilters: Record<string, string>

  beforeEach(async () => {
    activeFilters = {}
    filtersChanges$ = new Subject<Record<string, unknown>>()

    productServiceSpy = jasmine.createSpyObj<ProductService>('ProductService', [
      'getAll',
      'filters',
    ])
    productServiceSpy.filters.and.callFake(() => activeFilters)
    ;(
      productServiceSpy as unknown as { filtersService: unknown }
    ).filtersService = {
      filters$: filtersChanges$.asObservable(),
      clear: jasmine.createSpy('clear'),
    }

    loaderServiceSpy = jasmine.createSpyObj<LoaderService>('LoaderService', [
      'showLoading',
      'hideLoading',
    ])
    seoServiceSpy = jasmine.createSpyObj<SeoService>('SeoService', [
      'setCatalogStructuredData',
      'clearCatalogStructuredData',
      'clearBreadcrumbStructuredData',
    ])

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: SeoService, useValue: seoServiceSpy },
      ],
    }).compileComponents()

    TestBed.overrideComponent(ProductsComponent, {
      set: { template: '' },
    })

    fixture = TestBed.createComponent(ProductsComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load products on filters changes and update SEO', (done) => {
    const product = {
      id: '1',
      operation_type: 'Venta',
      type: 'Departamento',
      address: { street: 'Av Siempreviva 123', city: 'CABA' },
      price: 100000,
      area: 50,
      coveredArea: 45,
      rooms: 2,
      bathrooms: 1,
      garage: 0,
      title: 'Depto luminoso',
      description: '',
      images: [],
      cover: '',
      currency: 'USD',
      geo_lat: 0,
      geo_long: 0,
      videos: [],
      pdfDescription: '',
      expenses: 0,
      lotArea: 0,
      semiCoveredArea: 0,
      uncoveredArea: 0,
    }
    productServiceSpy.getAll.and.returnValue(of([product] as never[]))

    fixture.detectChanges()
    filtersChanges$.next({ operation_type: 'Venta' })

    setTimeout(() => {
      expect(component.list.length).toBe(1)
      expect(component.hasLoadError).toBeFalse()
      expect(loaderServiceSpy.showLoading).toHaveBeenCalled()
      expect(loaderServiceSpy.hideLoading).toHaveBeenCalled()
      expect(seoServiceSpy.setCatalogStructuredData).toHaveBeenCalledWith(
        component.list,
      )
      done()
    }, 300)
  })

  it('should handle list load errors and clear SEO scripts', (done) => {
    productServiceSpy.getAll.and.returnValue(
      throwError(() => new Error('network')),
    )

    fixture.detectChanges()
    filtersChanges$.next({ operation_type: 'Alquiler' })

    setTimeout(() => {
      expect(component.hasLoadError).toBeTrue()
      expect(component.list).toEqual([])
      expect(component.isLoading).toBeFalse()
      expect(loaderServiceSpy.hideLoading).toHaveBeenCalled()
      expect(seoServiceSpy.clearCatalogStructuredData).toHaveBeenCalled()
      expect(seoServiceSpy.clearBreadcrumbStructuredData).toHaveBeenCalled()
      done()
    }, 300)
  })

  it('should clear all filters', () => {
    const clearSpy = (
      productServiceSpy as unknown as { filtersService: { clear: jasmine.Spy } }
    ).filtersService.clear

    component.clearAllFilters()

    expect(clearSpy).toHaveBeenCalled()
  })

  it('should clear catalog and breadcrumb structured data on destroy', () => {
    component.ngOnDestroy()

    expect(seoServiceSpy.clearCatalogStructuredData).toHaveBeenCalled()
    expect(seoServiceSpy.clearBreadcrumbStructuredData).toHaveBeenCalled()
  })

  it('should expose active filters helpers and summary labels', () => {
    activeFilters = {
      operation_type: 'Alquiler',
      rooms: '3',
      custom_key: 'valor',
    }

    expect(component.hasActiveFilters()).toBeTrue()
    expect(component.activeFiltersCount()).toBe(3)
    expect(component.activeFilterSummary()).toEqual([
      'Operación: Alquiler',
      'Ambientes: 3',
      'custom_key: valor',
    ])
  })

  it('should map operation type label according to selected filters', () => {
    activeFilters = { operation_type: 'Venta' }
    expect(component.typeOfOperation()).toBe('compra')

    activeFilters = { operation_type: 'Alquiler' }
    expect(component.typeOfOperation()).toBe('alquiler')

    activeFilters = {}
    expect(component.typeOfOperation()).toBe('compra o alquiler')
  })

  it('should expose list helper state', () => {
    expect(component.listIsEmpty()).toBeTrue()
    expect(component.propertiesAmount()).toBe(0)

    component.list = [
      {
        id: 'p1',
      } as never,
      {
        id: 'p2',
      } as never,
    ]

    expect(component.listIsEmpty()).toBeFalse()
    expect(component.propertiesAmount()).toBe(2)
  })
})
