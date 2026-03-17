import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MapsLoaderService } from '../../../services/maps-loader/maps-loader.service'
import { Product } from '../../../models/product'

import { MainInfoComponent } from './main-info.component'

describe('MainInfoComponent', () => {
  let component: MainInfoComponent
  let fixture: ComponentFixture<MainInfoComponent>
  let mapsLoaderSpy: jasmine.SpyObj<MapsLoaderService>

  beforeEach(async () => {
    mapsLoaderSpy = jasmine.createSpyObj<MapsLoaderService>(
      'MapsLoaderService',
      ['load'],
    )

    await TestBed.configureTestingModule({
      imports: [MainInfoComponent],
      providers: [{ provide: MapsLoaderService, useValue: mapsLoaderSpy }],
    }).compileComponents()

    TestBed.overrideComponent(MainInfoComponent, {
      set: { template: '' },
    })

    fixture = TestBed.createComponent(MainInfoComponent)
    component = fixture.componentInstance
  })

  afterEach(() => {
    delete (window as Window & { google?: unknown }).google
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should update center and marker position when product changes', () => {
    const product = new Product()
    product.geo_lat = -34.55
    product.geo_long = -58.44
    component.product = product

    component.ngOnChanges()

    expect(component.center).toEqual({ lat: -34.55, lng: -58.44 })
    expect(component.marker.position).toEqual({ lat: -34.55, lng: -58.44 })
  })

  it('should return expense labels according to product data', () => {
    expect(component.expenses()).toBe('Sin expensas')

    const product = new Product()
    product.expenses = 250000
    component.product = product

    expect(component.expenses()).toBe('Expensas: $250000')
  })

  it('should build embed url from coordinates and fallback to address', () => {
    const productWithCoords = new Product()
    productWithCoords.geo_lat = -34.6
    productWithCoords.geo_long = -58.4
    component.product = productWithCoords

    expect(component.mapEmbedUrl()).toContain(
      'https://www.google.com/maps?q=-34.6,-58.4',
    )

    const productWithAddress = new Product()
    productWithAddress.address.street = 'Av Cabildo 1234'
    productWithAddress.address.city = 'CABA'
    component.product = productWithAddress

    expect(component.mapEmbedUrl()).toContain(
      'https://www.google.com/maps?q=Av%20Cabildo%201234%2C%20CABA',
    )

    component.product = new Product()
    expect(component.mapEmbedUrl()).toBe('')
  })

  it('should initialize maps api using importLibrary when available', async () => {
    mapsLoaderSpy.load.and.resolveTo()
    const importLibrarySpy = jasmine
      .createSpy('importLibrary')
      .and.callFake(async () => undefined)
    ;(window as Window & { google?: unknown }).google = {
      maps: {
        importLibrary: importLibrarySpy,
      },
    }

    await (
      component as unknown as { initializeMapsApi: () => Promise<void> }
    ).initializeMapsApi()

    expect(importLibrarySpy).toHaveBeenCalledWith('maps')
    expect(importLibrarySpy).toHaveBeenCalledWith('marker')
    expect(component.mapsApiLoaded).toBeTrue()
    expect(component.markerApiLoaded).toBeFalse()
  })

  it('should recover in catch branch when legacy map and marker are ready', async () => {
    mapsLoaderSpy.load.and.rejectWith(new Error('load failed'))
    ;(window as Window & { google?: unknown }).google = {
      maps: {
        Map: () => ({}) as never,
        Marker: () => ({}) as never,
      },
    }

    await (
      component as unknown as { initializeMapsApi: () => Promise<void> }
    ).initializeMapsApi()

    expect(component.mapsApiLoaded).toBeTrue()
    expect(component.markerApiLoaded).toBeTrue()
  })
})
