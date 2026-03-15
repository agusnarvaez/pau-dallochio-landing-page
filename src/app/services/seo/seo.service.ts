import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs'
import { SeoRouteData } from '../../app.routes'
import { Product } from '../../models/product'

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly siteUrl = 'https://www.pauladallochio.com.ar'
  private readonly organizationSchemaId = 'organization-schema'
  private readonly websiteSchemaId = 'website-schema'
  private readonly productSchemaId = 'product-schema'
  private readonly catalogSchemaId = 'catalog-schema'
  private readonly breadcrumbSchemaId = 'breadcrumb-schema'
  private readonly faqSchemaId = 'faq-schema'
  private readonly organizationId = `${this.siteUrl}/#organization`
  private readonly websiteId = `${this.siteUrl}/#website`
  private readonly logoUrl = `${this.siteUrl}/assets/logos/logo-header.png`

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  init(): void {
    this.updateFromCurrentRoute(this.router.url)

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateFromCurrentRoute((event as NavigationEnd).urlAfterRedirects)
      })
  }

  private updateFromCurrentRoute(path: string): void {
    this.updateUrlTags(path)
    this.updateSeoTags()
    this.setGlobalStructuredData()
    this.clearPageStructuredData()
  }

  private updateUrlTags(path: string): void {
    const absoluteUrl = new URL(path, this.siteUrl).toString()

    this.meta.updateTag({ property: 'og:url', content: absoluteUrl })
    this.meta.updateTag({ name: 'twitter:url', content: absoluteUrl })
    this.setCanonical(absoluteUrl)
  }

  private setCanonical(url: string): void {
    let canonical = this.document.querySelector(
      "link[rel='canonical']",
    ) as HTMLLinkElement | null

    if (!canonical) {
      canonical = this.document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      this.document.head.appendChild(canonical)
    }

    canonical.setAttribute('href', url)
  }

  private updateSeoTags(): void {
    const seo = this.getActiveSeoData()
    if (!seo) {
      return
    }

    this.title.setTitle(seo.title)
    this.meta.updateTag({ name: 'description', content: seo.description })
    this.meta.updateTag({ property: 'og:title', content: seo.title })
    this.meta.updateTag({
      property: 'og:description',
      content: seo.description,
    })
    this.meta.updateTag({ name: 'twitter:title', content: seo.title })
    this.meta.updateTag({
      name: 'twitter:description',
      content: seo.description,
    })

    if (seo.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seo.keywords })
    } else {
      this.meta.removeTag("name='keywords'")
    }
  }

  private getActiveSeoData(): SeoRouteData | null {
    let route: ActivatedRouteSnapshot | null =
      this.router.routerState.snapshot.root

    while (route?.firstChild) {
      route = route.firstChild
    }

    return (route?.data?.['seo'] as SeoRouteData | undefined) ?? null
  }

  setProductPageSeo(product: Product): void {
    const productUrl = `${this.siteUrl}/catalogo/${product.id}`
    const title = `${product.operation_type} ${product.type} en ${product.address.city} - Paula Dallochio Inmobiliaria`
    const description = `${product.title}, ${product.rooms} ambientes, ${product.area} m2 totales, ${product.coveredArea} m2 cubiertos, ${product.bathrooms} baños, ${product.garage} cocheras`
    const keywords = [
      'Propiedad',
      'inmueble',
      'bien raiz',
      'bienes raices',
      'inmobiliaria',
      'Paula Dallochio',
      product.address.city,
    ]
      .filter(Boolean)
      .join(', ')

    this.title.setTitle(title)
    this.meta.updateTag({ name: 'description', content: description })
    this.meta.updateTag({ name: 'keywords', content: keywords })
    this.meta.updateTag({ property: 'og:title', content: title })
    this.meta.updateTag({
      property: 'og:description',
      content: product.description || description,
    })
    this.meta.updateTag({ name: 'twitter:title', content: title })
    this.meta.updateTag({
      name: 'twitter:description',
      content: product.description || description,
    })
    this.updateUrlTags(productUrl)
    this.setProductStructuredData(product)
  }

  setProductStructuredData(product: Product): void {
    const productUrl = `${this.siteUrl}/catalogo/${product.id}`
    const productSchema = this.buildProductStructuredData(product, productUrl)

    this.upsertJsonLd(this.productSchemaId, productSchema)
    this.setBreadcrumbStructuredData([
      {
        name: 'Inicio',
        url: this.siteUrl,
      },
      {
        name: 'Catalogo',
        url: `${this.siteUrl}/catalogo`,
      },
      {
        name: product.title,
        url: productUrl,
      },
    ])
  }

  setCatalogStructuredData(products: Product[]): void {
    const catalogUrl = `${this.siteUrl}/catalogo`
    const catalogSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Catalogo de Propiedades',
      description:
        'Explora propiedades en venta y alquiler seleccionadas por Paula Dallochio para ayudarte a encontrar la opcion ideal.',
      url: catalogUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((product, index) => {
          const productUrl = `${catalogUrl}/${product.id}`

          return {
            '@type': 'ListItem',
            position: index + 1,
            url: productUrl,
            item: this.buildProductStructuredData(product, productUrl),
          }
        }),
      },
    }

    this.upsertJsonLd(this.catalogSchemaId, catalogSchema)
    this.setBreadcrumbStructuredData([
      {
        name: 'Inicio',
        url: this.siteUrl,
      },
      {
        name: 'Catalogo',
        url: catalogUrl,
      },
    ])
  }

  clearProductStructuredData(): void {
    this.removeJsonLd(this.productSchemaId)
  }

  clearCatalogStructuredData(): void {
    this.removeJsonLd(this.catalogSchemaId)
  }

  clearBreadcrumbStructuredData(): void {
    this.removeJsonLd(this.breadcrumbSchemaId)
  }

  setFaqStructuredData(
    items: Array<{ question: string; answer: string }>,
  ): void {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: this.normalizeStructuredText(item.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: this.normalizeStructuredText(item.answer),
        },
      })),
    }

    this.upsertJsonLd(this.faqSchemaId, faqSchema)
  }

  clearFaqStructuredData(): void {
    this.removeJsonLd(this.faqSchemaId)
  }

  private setGlobalStructuredData(): void {
    this.setOrganizationStructuredData()
    this.setWebsiteStructuredData()
  }

  private setOrganizationStructuredData(): void {
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': this.organizationId,
      name: 'Paula Dallochio Inmobiliaria',
      legalName: 'Paula Dallochio Estudio Inmobiliario',
      url: this.siteUrl,
      logo: this.logoUrl,
      image: this.logoUrl,
      telephone: '+54 9 11 4085-6083',
      email: 'estudioinmobiliario@pauladallochio.com.ar',
      hasMap: 'https://maps.app.goo.gl/nd41iHQazLP6VuV78',
      knowsLanguage: ['es-AR'],
      areaServed: 'Buenos Aires, Argentina',
      sameAs: [
        'https://www.instagram.com/pauladallochio/',
        'http://www.linkedin.com/in/pauladallochioestudioinmobiliario',
        'https://linktr.ee/pauladallochioestudioinmob',
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Avenida Alvarez Thomas 925, piso 6to. depto. C',
        addressLocality: 'Buenos Aires',
        addressRegion: 'CABA',
        addressCountry: 'AR',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          telephone: '+54 9 11 4085-6083',
          email: 'estudioinmobiliario@pauladallochio.com.ar',
          availableLanguage: ['es-AR'],
          areaServed: 'AR',
        },
      ],
    }

    this.upsertJsonLd(this.organizationSchemaId, organizationSchema)
  }

  private setWebsiteStructuredData(): void {
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': this.websiteId,
      url: this.siteUrl,
      name: 'Paula Dallochio Inmobiliaria',
      description:
        'Sitio oficial de Paula Dallochio para compra, venta y alquiler de propiedades en Buenos Aires.',
      inLanguage: 'es-AR',
      publisher: {
        '@id': this.organizationId,
      },
    }

    this.upsertJsonLd(this.websiteSchemaId, websiteSchema)
  }

  private setBreadcrumbStructuredData(
    items: Array<{ name: string; url: string }>,
  ): void {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }

    this.upsertJsonLd(this.breadcrumbSchemaId, breadcrumbSchema)
  }

  private buildProductStructuredData(
    product: Product,
    productUrl: string,
  ): Record<string, unknown> {
    const productSchema: Record<string, unknown> = {
      '@type': 'Product',
      name: product.title,
      description: product.description || product.title,
      category: product.type,
      image: product.images.length
        ? product.images
        : product.cover
          ? [product.cover]
          : [],
      url: productUrl,
      brand: {
        '@type': 'RealEstateAgent',
        name: 'Paula Dallochio Inmobiliaria',
      },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        availability: 'https://schema.org/InStock',
        url: productUrl,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: product.address.street,
        addressLocality: product.address.city,
        addressCountry: 'AR',
      },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: product.area,
        unitCode: 'MTK',
      },
      numberOfRooms: product.rooms,
      numberOfBathroomsTotal: product.bathrooms,
    }

    if (product.geo_lat && product.geo_long) {
      productSchema['geo'] = {
        '@type': 'GeoCoordinates',
        latitude: product.geo_lat,
        longitude: product.geo_long,
      }
    }

    return productSchema
  }

  private normalizeStructuredText(value: string): string {
    return value
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&#64;/gi, '@')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private clearPageStructuredData(): void {
    this.clearProductStructuredData()
    this.clearCatalogStructuredData()
    this.clearBreadcrumbStructuredData()
    this.clearFaqStructuredData()
  }

  private upsertJsonLd(id: string, schema: Record<string, unknown>): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null
    if (!script) {
      script = this.document.createElement('script')
      script.type = 'application/ld+json'
      script.id = id
      this.document.head.appendChild(script)
    }

    script.text = JSON.stringify(schema)
  }

  private removeJsonLd(id: string): void {
    const script = this.document.getElementById(id)
    if (script) {
      script.remove()
    }
  }
}
