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
import { PdfService } from '../../services/pdf/pdf.service'
import { LoaderService } from '../../services/loader/loader.service'
import { switchMap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ToastService } from '../../services/toast/toast.service'
import { SeoService } from '../../services/seo/seo.service'

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
  private destroyRef = inject(DestroyRef)

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private pdfService: PdfService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private seoService: SeoService,
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
          this.seoService.setProductPageSeo(product)
          this.loaderService.hideLoading()
        },
        error: () => {
          this.product = undefined
          this.seoService.clearProductStructuredData()
          this.loaderService.hideLoading()
        },
      })
  }

  ngOnDestroy(): void {
    this.seoService.clearProductStructuredData()
  }

  async copyActualRoute() {
    const propertyId = this.product?.id
    if (!propertyId) {
      this.toastService.show(
        'No se pudo copiar la URL de la propiedad.',
        'error',
      )
      return
    }

    const url = `https://www.pauladallochio.com.ar/catalogo/${propertyId}`

    try {
      await navigator.clipboard.writeText(url)
      this.toastService.show('URL copiada con exito.', 'success', 2200)
    } catch {
      this.toastService.show(
        'No se pudo copiar automaticamente. Copia la URL manualmente.',
        'error',
      )
    }
  }

  downLoadPdf() {
    if (!this.product) {
      return
    }
    this.pdfService.generatePropertyPdf(this.product)
  }
}
