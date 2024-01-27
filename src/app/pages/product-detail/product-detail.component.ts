import { ButtonComponent } from './../../components/button/button.component'
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CarrouselComponent } from '../../sections/product-detail/carrousel/carrousel.component'
import { MainInfoComponent } from '../../sections/product-detail/main-info/main-info.component'
import { ContactCardComponent } from '../../sections/product-detail/contact-card/contact-card.component'
import { SuggestionsComponent } from '../../sections/product-detail/suggestions/suggestions.component'
import { ProductService } from '../../services/product/product.service'
import { Product } from '../../models/product'
import { ActivatedRoute } from '@angular/router'
import { ContactFormComponent } from '../../sections/contact/contact-form/contact-form.component'
import { Meta,Title  } from '@angular/platform-browser'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,ButtonComponent,CarrouselComponent,MainInfoComponent,ContactCardComponent,SuggestionsComponent,ContactFormComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: Product | undefined
  showNotification = false
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private metaTagService: Meta,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productService.getById(params["id"]).subscribe(product => {
        this.product = product
        this.titleService.setTitle(`${this.product?.operation_type} ${this.product?.type} en ${this.product?.address.city} - Paula Dallochio Inmobiliaria`)
        this.metaTagService.updateTag({ name: 'description', content: `${this.product?.title}, ${this.product?.rooms} ambientes, ${this.product?.area} m2 totales, ${this.product?.coveredArea} m2 cubiertos, ${this.product?.bathrooms} baños, ${this.product?.garage} cocheras`})
        this.metaTagService.updateTag({ name: 'keywords', content: ' Propiedad, inmueble, bien raíz, bienes raíces, inmobiliaria, Paula Dallochio, ' + this.product?.address ?? '' })

        this.metaTagService.updateTag({ property: 'og:title', content: `${this.product?.operation_type} ${this.product?.type} en ${this.product?.address.city} - Paula Dallochio Inmobiliaria` })
        this.metaTagService.updateTag({ property: 'og:description', content: this.product?.description ?? '' })
        this.metaTagService.updateTag({ property: 'og:url', content: `https://www.pauladallochio.com.ar/catalogo/${this.product?.id}` })

        this.metaTagService.updateTag({ name: 'twitter:title', content: `${this.product?.operation_type} ${this.product?.type} en ${this.product?.address.city} - Paula Dallochio Inmobiliaria` })
        this.metaTagService.updateTag({ name: 'twitter:description', content: this.product?.description ?? '' })
        this.metaTagService.updateTag({ name: 'twitter:url', content: `https://www.pauladallochio.com.ar/catalogo/${this.product?.id}` })
      })
    })



  }
  copyActualRoute() {
    const url = "www.pauladallochio.com.ar/catalogo/" + this.product?.id
    navigator.clipboard.writeText(url)
    this.showNotification = true

    setTimeout(() => {
      this.showNotification = false
    }, 2000)
  }
}
