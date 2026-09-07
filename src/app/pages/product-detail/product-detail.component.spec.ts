import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
} from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { of, Subject, throwError } from 'rxjs'

import { ProductDetailComponent } from './product-detail.component'
import { ProductService } from '../../services/product/product.service'
import { PdfService } from '../../services/pdf/pdf.service'
import { LoaderService } from '../../services/loader/loader.service'
import { ToastService } from '../../services/toast/toast.service'
import { SeoService } from '../../services/seo/seo.service'
import { Product } from '../../models/product'

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent
  let fixture: ComponentFixture<ProductDetailComponent>
  let routeParams$: Subject<{ id: string }>
  let productServiceSpy: jasmine.SpyObj<ProductService>
  let pdfServiceSpy: jasmine.SpyObj<PdfService>
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>
  let toastServiceSpy: jasmine.SpyObj<ToastService>
  let seoServiceSpy: jasmine.SpyObj<SeoService>

  const buildProduct = (): Product => {
    const product = new Product()
    product.id = '7096460'
    product.title = 'Departamento en Tigre'
    product.operation_type = 'Venta'
    product.type = 'Departamento'
    product.address.city = 'Tigre'
    return product
  }

  beforeEach(async () => {
    routeParams$ = new Subject<{ id: string }>()
    productServiceSpy = jasmine.createSpyObj<ProductService>('ProductService', [
      'getById',
    ])
    pdfServiceSpy = jasmine.createSpyObj<PdfService>('PdfService', [
      'generatePropertyPdf',
    ])
    loaderServiceSpy = jasmine.createSpyObj<LoaderService>('LoaderService', [
      'showLoading',
      'hideLoading',
    ])
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', [
      'show',
    ])
    seoServiceSpy = jasmine.createSpyObj<SeoService>('SeoService', [
      'setProductPageSeo',
      'setProductNotFoundSeo',
      'clearProductStructuredData',
    ])

    TestBed.overrideComponent(ProductDetailComponent, {
      set: {
        template: '',
      },
    })

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: routeParams$.asObservable() },
        },
        { provide: PdfService, useValue: pdfServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: SeoService, useValue: seoServiceSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductDetailComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load product, update seo and hide loader on success', fakeAsync(() => {
    const product = buildProduct()
    productServiceSpy.getById.and.returnValue(of(product))

    component.ngOnInit()
    routeParams$.next({ id: product.id })
    flushMicrotasks()

    expect(productServiceSpy.getById).toHaveBeenCalledWith(product.id)
    expect(loaderServiceSpy.showLoading).toHaveBeenCalled()
    expect(component.product).toEqual(product)
    expect(seoServiceSpy.setProductPageSeo).toHaveBeenCalledWith(product)
    expect(loaderServiceSpy.hideLoading).toHaveBeenCalled()
  }))

  it('should clear product seo and hide loader on load error', fakeAsync(() => {
    productServiceSpy.getById.and.returnValue(
      throwError(() => new Error('network down')),
    )

    component.ngOnInit()
    routeParams$.next({ id: 'broken-id' })
    flushMicrotasks()

    expect(loaderServiceSpy.showLoading).toHaveBeenCalled()
    expect(component.product).toBeUndefined()
    expect(seoServiceSpy.setProductNotFoundSeo).toHaveBeenCalled()
    expect(loaderServiceSpy.hideLoading).toHaveBeenCalled()
  }))

  it('should clear seo structured data on destroy', () => {
    component.ngOnDestroy()

    expect(seoServiceSpy.clearProductStructuredData).toHaveBeenCalled()
  })

  it('should show error toast when trying to copy url without product id', async () => {
    component.product = undefined

    await component.copyActualRoute()

    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'No se pudo copiar la URL de la propiedad.',
      'error',
    )
  })

  it('should copy product url and show success toast', async () => {
    const product = buildProduct()
    component.product = product

    const clipboardMock = jasmine.createSpyObj('clipboard', ['writeText'])
    clipboardMock.writeText.and.resolveTo()
    Object.defineProperty(navigator, 'clipboard', {
      value: clipboardMock,
      configurable: true,
    })

    await component.copyActualRoute()

    expect(clipboardMock.writeText).toHaveBeenCalledWith(
      `https://www.pauladallochio.com.ar/catalogo/${product.id}`,
    )
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'URL copiada con exito.',
      'success',
      2200,
    )
  })

  it('should show fallback toast when clipboard write fails', async () => {
    const product = buildProduct()
    component.product = product

    const clipboardMock = jasmine.createSpyObj('clipboard', ['writeText'])
    clipboardMock.writeText.and.rejectWith(new Error('no permission'))
    Object.defineProperty(navigator, 'clipboard', {
      value: clipboardMock,
      configurable: true,
    })

    await component.copyActualRoute()

    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'No se pudo copiar automaticamente. Copia la URL manualmente.',
      'error',
    )
  })

  it('should generate pdf only when product exists', () => {
    component.product = undefined
    component.downLoadPdf()
    expect(pdfServiceSpy.generatePropertyPdf).not.toHaveBeenCalled()

    const product = buildProduct()
    component.product = product
    component.downLoadPdf()
    expect(pdfServiceSpy.generatePropertyPdf).toHaveBeenCalledWith(product)
  })
})
