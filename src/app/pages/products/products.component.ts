import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductsBannerComponent } from '../../sections/products/products-banner/products-banner.component'
import { ProductsFilterComponent } from '../../sections/products/products-filter/products-filter.component'
import { ProductsCardComponent } from '../../sections/products/products-card/products-card.component'

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,ProductsBannerComponent,ProductsFilterComponent,ProductsCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

}
