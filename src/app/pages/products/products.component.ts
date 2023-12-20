import { ProductService } from './../../services/product/product.service'
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductsBannerComponent } from '../../sections/products/products-banner/products-banner.component'
import { ProductsFilterComponent } from '../../sections/products/products-filter/products-filter.component'
import { ProductsCardComponent } from '../../sections/products/products-card/products-card.component'
import { ProductList } from '../../models/product'

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductsBannerComponent,
    ProductsFilterComponent,
    ProductsCardComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  list: ProductList[] = []

  constructor(private productService: ProductService) { }

  onFilterChange(newFilters: string[]) {
    newFilters.forEach(f => this.productService.filtersService.add(f))
    this.updateProductsList()
  }

  selectedFilters = () => this.productService.filters()

  updateProductsList() {
    // Lógica para filtrar la lista basada en `this.selectedFilters`
    this.productService.getAll(this.selectedFilters()).subscribe(
      {
        next: (products) => {
          this.list = products
        },
        error: (err) => {
          console.error(err)
        }
      }
    )
  }

  propertiesAmount = () => this.list.length

  listIsEmpty = () => this.list.length === 0

  ngOnInit() {
    // Lógica para inicializar `this.list`
    this.updateProductsList()
  }
}
