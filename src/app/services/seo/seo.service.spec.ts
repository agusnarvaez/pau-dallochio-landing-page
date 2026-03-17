import { DOCUMENT } from '@angular/common'
import { TestBed } from '@angular/core/testing'
import { Meta, Title } from '@angular/platform-browser'
import { NavigationEnd, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { Product } from '../../models/product'
import { SeoService } from './seo.service'

describe('SeoService', () => {
  let service: SeoService
  let meta: Meta
  let title: Title
  let document: Document
  let routerEvents$: Subject<unknown>

  const seoData = {
    title: 'Catalogo de propiedades',
    description: 'Listado de propiedades disponibles',
    keywords: 'catalogo, propiedades',
  }

  const buildRouterStub = (url = '/catalogo'): Router => {
    routerEvents$ = new Subject<unknown>()

    return {
      url,
      events: routerEvents$.asObservable(),
      routerState: {
        snapshot: {
          root: {
            data: {},
            firstChild: {
              data: { seo: seoData },
              firstChild: null,
            },
          },
        },
      },
    } as unknown as Router
  }

  const removeIfExists = (selector: string): void => {
    const node = document.querySelector(selector)
    if (node) {
      node.remove()
    }
  }

  const cleanupSeoNodes = (): void => {
    const ids = [
      'organization-schema',
      'website-schema',
      'product-schema',
      'catalog-schema',
      'breadcrumb-schema',
      'faq-schema',
    ]

    ids.forEach((id) => {
      const node = document.getElementById(id)
      if (node) {
        node.remove()
      }
    })

    removeIfExists("link[rel='canonical']")
    removeIfExists("meta[property='og:url']")
    removeIfExists("meta[name='twitter:url']")
    removeIfExists("meta[name='description']")
    removeIfExists("meta[name='keywords']")
    removeIfExists("meta[property='og:title']")
    removeIfExists("meta[property='og:description']")
    removeIfExists("meta[name='twitter:title']")
    removeIfExists("meta[name='twitter:description']")
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: buildRouterStub() }],
    })

    service = TestBed.inject(SeoService)
    meta = TestBed.inject(Meta)
    title = TestBed.inject(Title)
    document = TestBed.inject(DOCUMENT)

    cleanupSeoNodes()
  })

  afterEach(() => {
    cleanupSeoNodes()
  })

  it('should initialize canonical/meta tags and global structured data', () => {
    service.init()

    const canonical = document.querySelector(
      "link[rel='canonical']",
    ) as HTMLLinkElement | null

    expect(canonical).toBeTruthy()
    expect(canonical?.getAttribute('href')).toBe(
      'https://www.pauladallochio.com.ar/catalogo',
    )
    expect(title.getTitle()).toBe(seoData.title)
    expect(meta.getTag("name='description'")?.content).toBe(seoData.description)
    expect(document.getElementById('organization-schema')).toBeTruthy()
    expect(document.getElementById('website-schema')).toBeTruthy()
  })

  it('should update url tags after navigation events', () => {
    service.init()

    routerEvents$.next(new NavigationEnd(1, '/contacto', '/contacto'))

    expect(meta.getTag("property='og:url'")?.content).toBe(
      'https://www.pauladallochio.com.ar/contacto',
    )
    expect(meta.getTag("name='twitter:url'")?.content).toBe(
      'https://www.pauladallochio.com.ar/contacto',
    )
  })

  it('should set product seo and create product and breadcrumb schemas', () => {
    const product = new Product()
    product.id = '123'
    product.operation_type = 'Venta'
    product.type = 'Departamento'
    product.address.city = 'CABA'
    product.address.street = 'Av Test 123'
    product.title = 'Departamento con balcon'
    product.rooms = 3
    product.area = 80
    product.coveredArea = 70
    product.bathrooms = 2
    product.garage = 1
    product.price = 100000
    product.currency = 'USD'
    product.images = ['https://img.com/cover.jpg']
    product.description = 'Propiedad en excelente estado'

    service.setProductPageSeo(product)

    expect(title.getTitle()).toContain('Venta Departamento en CABA')
    expect(meta.getTag("property='og:url'")?.content).toBe(
      'https://www.pauladallochio.com.ar/catalogo/123',
    )

    const productSchema = document.getElementById(
      'product-schema',
    ) as HTMLScriptElement | null
    const breadcrumbSchema = document.getElementById('breadcrumb-schema')

    expect(productSchema).toBeTruthy()
    expect(productSchema?.text).toContain('"@type":"Product"')
    expect(breadcrumbSchema).toBeTruthy()
  })

  it('should create catalog schema with max 20 listed items', () => {
    const products = Array.from({ length: 25 }, (_, index) => {
      const product = new Product()
      product.id = `${index + 1}`
      product.title = `Propiedad ${index + 1}`
      product.type = 'Departamento'
      product.operation_type = 'Venta'
      product.address.city = 'CABA'
      product.address.street = `Calle ${index + 1}`
      product.price = 1000 + index
      return product
    })

    service.setCatalogStructuredData(products)

    const catalogScript = document.getElementById(
      'catalog-schema',
    ) as HTMLScriptElement
    const catalogSchema = JSON.parse(catalogScript.text) as {
      mainEntity: {
        numberOfItems: number
        itemListElement: Array<unknown>
      }
    }

    expect(catalogSchema.mainEntity.numberOfItems).toBe(25)
    expect(catalogSchema.mainEntity.itemListElement.length).toBe(20)

    service.clearCatalogStructuredData()
    expect(document.getElementById('catalog-schema')).toBeNull()
  })

  it('should sanitize and clear faq structured data', () => {
    service.setFaqStructuredData([
      {
        question: '<strong>Como</strong><br>publico?',
        answer: 'Escribinos&nbsp;por WhatsApp &#64; Paula',
      },
    ])

    const faqScript = document.getElementById('faq-schema') as HTMLScriptElement
    const faqSchema = JSON.parse(faqScript.text) as {
      mainEntity: Array<{
        name: string
        acceptedAnswer: {
          text: string
        }
      }>
    }

    expect(faqSchema.mainEntity[0].name).toBe('Como publico?')
    expect(faqSchema.mainEntity[0].acceptedAnswer.text).toBe(
      'Escribinos por WhatsApp @ Paula',
    )

    service.clearFaqStructuredData()
    expect(document.getElementById('faq-schema')).toBeNull()
  })

  it('should remove keywords tag when active route seo has no keywords', () => {
    const routerWithoutKeywords = {
      url: '/contacto',
      events: new Subject<unknown>().asObservable(),
      routerState: {
        snapshot: {
          root: {
            data: {},
            firstChild: {
              data: {
                seo: {
                  title: 'Contacto',
                  description: 'Canal de contacto',
                },
              },
              firstChild: null,
            },
          },
        },
      },
    } as unknown as Router

    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerWithoutKeywords }],
    })

    service = TestBed.inject(SeoService)
    meta = TestBed.inject(Meta)
    document = TestBed.inject(DOCUMENT)

    meta.addTag({ name: 'keywords', content: 'legacy' })

    service.init()

    expect(meta.getTag("name='keywords'")).toBeNull()
  })

  it('should clear page structured data scripts on init navigation sync', () => {
    const staleIds = [
      'product-schema',
      'catalog-schema',
      'breadcrumb-schema',
      'faq-schema',
    ]

    staleIds.forEach((id) => {
      const script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.text = '{"stale":true}'
      document.head.appendChild(script)
    })

    service.init()

    staleIds.forEach((id) => {
      expect(document.getElementById(id)).toBeNull()
    })
  })
})
