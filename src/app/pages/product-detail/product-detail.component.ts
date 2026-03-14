import { ButtonComponent } from './../../components/button/button.component'
import { Component, DestroyRef, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CarrouselComponent } from '../../sections/product-detail/carrousel/carrousel.component'
import { MainInfoComponent } from '../../sections/product-detail/main-info/main-info.component'
import { ContactCardComponent } from '../../sections/product-detail/contact-card/contact-card.component'
import { SuggestionsComponent } from '../../sections/product-detail/suggestions/suggestions.component'
import { ProductService } from '../../services/product/product.service'
import { Product } from '../../models/product'
import { ActivatedRoute, Params } from '@angular/router'
import { ContactFormComponent } from '../../sections/contact/contact-form/contact-form.component'
import { Meta, Title } from '@angular/platform-browser'
import { PdfService } from '../../services/pdf/pdf.service'
import { LoaderService } from '../../services/loader/loader.service'
import { switchMap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CarrouselComponent,
    MainInfoComponent,
    ContactCardComponent,
    SuggestionsComponent,
    ContactFormComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  product: Product | undefined
  showNotification = false
  notificationMessage = 'URL copiada con exito.'
  private notificationTimeoutId: ReturnType<typeof setTimeout> | null = null
  private destroyRef = inject(DestroyRef)

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private metaTagService: Meta,
    private titleService: Title,
    private pdfService: PdfService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.loaderService.showLoading()
          return this.productService.getById(params['id'])
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (product: Product) => {
          this.product = product
          this.updateSeoTags(product)
          this.loaderService.hideLoading()
        },
        error: () => {
          this.product = undefined
          this.loaderService.hideLoading()
        },
      })
  }

  private updateSeoTags(product: Product): void {
    this.titleService.setTitle(
      `${product.operation_type} ${product.type} en ${product.address.city} - Paula Dallochio Inmobiliaria`,
    )
    this.metaTagService.updateTag({
      name: 'description',
      content: `${product.title}, ${product.rooms} ambientes, ${product.area} m2 totales, ${product.coveredArea} m2 cubiertos, ${product.bathrooms} baños, ${product.garage} cocheras`,
    })
    this.metaTagService.updateTag({
      name: 'keywords',
      content:
        ' Propiedad, inmueble, bien raíz, bienes raíces, inmobiliaria, Paula Dallochio, ' +
        (product.address ? `, ${product.address.city}` : ''),
    })

    this.metaTagService.updateTag({
      property: 'og:title',
      content: `${product.operation_type} ${product.type} en ${product.address.city} - Paula Dallochio Inmobiliaria`,
    })
    this.metaTagService.updateTag({
      property: 'og:description',
      content: product.description ?? '',
    })
    this.metaTagService.updateTag({
      property: 'og:url',
      content: `https://www.pauladallochio.com.ar/catalogo/${product.id}`,
    })

    this.metaTagService.updateTag({
      name: 'twitter:title',
      content: `${product.operation_type} ${product.type} en ${product.address.city} - Paula Dallochio Inmobiliaria`,
    })
    this.metaTagService.updateTag({
      name: 'twitter:description',
      content: product.description ?? '',
    })
    this.metaTagService.updateTag({
      name: 'twitter:url',
      content: `https://www.pauladallochio.com.ar/catalogo/${product.id}`,
    })
  }

  async copyActualRoute() {
    const propertyId = this.product?.id
    if (!propertyId) {
      this.showNotificationMessage('No se pudo copiar la URL de la propiedad.')
      return
    }

    const url = `https://www.pauladallochio.com.ar/catalogo/${propertyId}`

    try {
      await navigator.clipboard.writeText(url)
      this.showNotificationMessage('URL copiada con exito.')
    } catch {
      this.showNotificationMessage(
        'No se pudo copiar automaticamente. Copia la URL manualmente.',
      )
    }
  }

  private showNotificationMessage(message: string): void {
    this.notificationMessage = message
    this.showNotification = true

    if (this.notificationTimeoutId) {
      clearTimeout(this.notificationTimeoutId)
    }

    this.notificationTimeoutId = setTimeout(() => {
      this.showNotification = false
      this.notificationTimeoutId = null
    }, 2200)
  }

  downLoadPdf() {
    if (!this.product) {
      return
    }
    this.pdfService.generatePropertyPdf(this.product)
  }

  ngOnDestroy(): void {
    if (this.notificationTimeoutId) {
      clearTimeout(this.notificationTimeoutId)
    }
  }
}
