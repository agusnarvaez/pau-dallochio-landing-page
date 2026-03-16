import { ProductService } from './../../../services/product/product.service'
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import { Router } from '@angular/router'
import { FilterObject } from '../../../services/filters/filters.service'
import { ScrollService } from '../../../services/scroll/scroll.service'

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.css',
})
export class HomeBannerComponent {
  constructor(
    private router: Router,
    private productService: ProductService,
    private scrollService: ScrollService,
  ) {}
  isRentFilterActive = false
  isSellFilterActive = false

  isFilterActive = (filterText: string): boolean => {
    return this.productService.filtersService.isActive(
      'operation_type',
      filterText,
    )
  }

  toggleFilter = (filterText: FilterObject): void =>
    this.productService.filtersService.toggle(filterText)

  searchProducts = () => {
    this.scrollService.scrollToTopAfterNextNavigation(this.router)
    this.router.navigate(['/catalogo'])
  }
  ngInInit() {
    this.isRentFilterActive = this.isFilterActive('Alquiler')
    this.isSellFilterActive = this.isFilterActive('Venta')
  }
}
