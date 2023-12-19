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

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,ButtonComponent,CarrouselComponent,MainInfoComponent,ContactCardComponent,SuggestionsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: Product | undefined
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.product = this.productService.getById(params['id'])
    })
  }
}
