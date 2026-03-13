import { TestBed } from '@angular/core/testing'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'

import { ProductService } from './product.service'
import { FiltersService } from '../filters/filters.service'
import { TokkoProduct, SanityProduct } from '../../models/product'

describe('ProductsService', () => {
  let service: ProductService
  let httpMock: HttpTestingController
  let filtersServiceSpy: jasmine.SpyObj<FiltersService>

  const tokkoProductMock: TokkoProduct = {
    id: '123',
    type: { name: 'Departamento' },
    address: 'Av Siempreviva 123',
    branch: { address: 'Sucursal 1' },
    operations: [
      {
        prices: [{ price: 100000, currency: 'USD' }],
        operation_type: 'Venta',
      },
    ],
    total_surface: 90,
    roofed_surface: 80,
    surface: 90,
    semiroofed_surface: 5,
    unroofed_surface: 5,
    room_amount: 3,
    rich_description: 'Descripcion enriquecida',
    bathroom_amount: 2,
    photos: [{ image: 'https://img.com/1.jpg' }],
    geo_lat: -34.6,
    geo_long: -58.4,
    floors_amount: 1,
    location: { name: 'CABA' },
    parking_lot_amount: 1,
    property_condition: 'Excelente',
    publication_title: 'Depto en venta',
    situation: 'Disponible',
    tags: [{ id: 1, name: 'Destacada', type: 1 }],
    description_only: 'Descripcion corta',
    description: 'Descripcion PDF',
    videos: [{ url: 'https://video.com/1' }],
    expenses: 20000,
  }

  const sanityProductMock: SanityProduct = {
    _id: 'abcdefghijklmnop',
    area: 70,
    bathRooms: 1,
    body: [{ children: [{ text: 'Descripcion sanity' }] }],
    city: 'CABA',
    cover: { asset: { path: '/cover.jpg', url: 'https://img.com/cover.jpg' } },
    coveredArea: 65,
    currency: { title: 'USD' },
    garage: 1,
    geo_lat: -34.6,
    geo_long: -58.4,
    images: [{ asset: { path: '/1.jpg', url: 'https://img.com/1.jpg' } }],
    operation_type: { title: 'Venta' },
    price: 120000,
    rooms: 2,
    street: 'Av Sanity 456',
    title: 'PH en venta',
    type: { title: 'PH' },
  }

  beforeEach(() => {
    filtersServiceSpy = jasmine.createSpyObj<FiltersService>('FiltersService', [
      'getTokkoQuery',
      'getSanityQuery',
      'get',
    ])
    filtersServiceSpy.getTokkoQuery.and.returnValue('data={}')
    filtersServiceSpy.getSanityQuery.and.returnValue('*[_type == "property"]')
    filtersServiceSpy.get.and.returnValue({})

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: FiltersService, useValue: filtersServiceSpy }],
    })

    service = TestBed.inject(ProductService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should cache getAll requests for the same filters', () => {
    const responses: number[] = []

    service.getAll().subscribe(() => responses.push(1))
    service.getAll().subscribe(() => responses.push(1))

    const requests = httpMock.match((req) =>
      req.url.includes('/property/search'),
    )
    expect(requests.length).toBe(1)

    requests[0].flush({ objects: [tokkoProductMock] })
    expect(responses.length).toBe(2)

    const stats = service.getCacheStats()
    expect(stats.listMisses).toBe(1)
    expect(stats.listHits).toBe(1)
  })

  it('should create a new getAll request when filters change', () => {
    filtersServiceSpy.getTokkoQuery.and.returnValues(
      'data={"q":1}',
      'data={"q":2}',
    )

    service.getAll().subscribe()
    const firstRequest = httpMock.expectOne(
      (req) =>
        req.url.includes('/property/search') &&
        req.urlWithParams.includes('data={"q":1}'),
    )
    expect(firstRequest.request.method).toBe('GET')
    firstRequest.flush({ objects: [tokkoProductMock] })

    service.getAll().subscribe()
    const secondRequest = httpMock.expectOne(
      (req) =>
        req.url.includes('/property/search') &&
        req.urlWithParams.includes('data={"q":2}'),
    )
    expect(secondRequest.request.method).toBe('GET')
    secondRequest.flush({ objects: [tokkoProductMock] })

    expect(filtersServiceSpy.getTokkoQuery).toHaveBeenCalledTimes(2)
  })

  it('should fetch short ids from Tokko and long ids from Sanity', () => {
    service.getById('123').subscribe((product) => {
      expect(product.id).toBe('123')
    })
    const tokkoRequest = httpMock.expectOne((req) =>
      req.url.includes('/property/123/'),
    )
    tokkoRequest.flush(tokkoProductMock)

    const sanityId = 'abcdefghijklmnop'
    service.getById(sanityId).subscribe((product) => {
      expect(product.id).toBe(sanityId)
    })
    const sanityRequest = httpMock.expectOne(
      (req) =>
        req.url.includes('.api.sanity.io') &&
        req.url.includes('data/query/production') &&
        req.url.includes(`_id=="${sanityId}"`),
    )
    sanityRequest.flush({ result: [sanityProductMock] })
  })

  it('should invalidate by id cache and force a new request', () => {
    service.getById('123').subscribe()
    const firstRequest = httpMock.expectOne((req) =>
      req.url.includes('/property/123/'),
    )
    expect(firstRequest.request.method).toBe('GET')
    firstRequest.flush(tokkoProductMock)

    service.getById('123').subscribe()
    httpMock.expectNone((req) => req.url.includes('/property/123/'))

    service.invalidateByIdCache('123')

    service.getById('123').subscribe()
    const secondRequest = httpMock.expectOne((req) =>
      req.url.includes('/property/123/'),
    )
    expect(secondRequest.request.method).toBe('GET')
    secondRequest.flush(tokkoProductMock)

    const stats = service.getCacheStats()
    expect(stats.byIdMisses).toBe(2)
    expect(stats.byIdHits).toBe(1)
  })

  it('should reset cache stats counters', () => {
    service.getAll().subscribe()
    const request = httpMock.expectOne((req) =>
      req.url.includes('/property/search'),
    )
    request.flush({ objects: [tokkoProductMock] })

    const statsBeforeReset = service.getCacheStats()
    expect(statsBeforeReset.listMisses).toBeGreaterThan(0)

    service.resetCacheStats()
    const statsAfterReset = service.getCacheStats()

    expect(statsAfterReset).toEqual({
      listHits: 0,
      listMisses: 0,
      byIdHits: 0,
      byIdMisses: 0,
    })
  })
})
