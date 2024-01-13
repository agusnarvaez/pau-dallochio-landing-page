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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productService.getById(params["id"]).subscribe(product => {
        this.product = product
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
