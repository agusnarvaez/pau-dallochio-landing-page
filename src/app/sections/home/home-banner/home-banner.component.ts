import { ProductService } from './../../../services/product/product.service'
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.css'
})
export class HomeBannerComponent {
  constructor(private router: Router, private productService: ProductService) {}

  isFilterActive = (filterText: string): boolean => this.productService.filters().includes(filterText)

  toggleFilter = (filterText: string): void => this.productService.filtersService.toggle(filterText)

  searchProducts = () => this.router.navigate(['/catalogo'])
}
