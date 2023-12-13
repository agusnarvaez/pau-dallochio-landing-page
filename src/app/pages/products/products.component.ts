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
  selectedFilters: string[] = []
  list = [
    {
      type:"Departamento",
      address:
        {
          street: 'Malabia',
          number: '1000',
          locality: 'Palermo',
          city: 'CABA',
          province: 'Buenos Aires',
        },
      price: 350000,
      area: 100,
      coveredArea: 80,
      rooms: 3,
      bathrooms: 3
    },
    {
      type:"Departamento",
      address:
        {
          street: 'Malabia',
          number: '1000',
          locality: 'Palermo',
          city: 'CABA',
          province: 'Buenos Aires',
        },
      price: 350000,
      area: 100,
      coveredArea: 80,
      rooms: 3,
      bathrooms: 3
    },
    {
      type:"Departamento",
      address:
        {
          street: 'Malabia',
          number: '1000',
          locality: 'Palermo',
          city: 'CABA',
          province: 'Buenos Aires',
        },
      price: 350000,
      area: 100,
      coveredArea: 80,
      rooms: 3,
      bathrooms: 3
    }
  ]

  onFilterChange(newFilters: string[]) {
    this.selectedFilters = newFilters
    this.updateProductListBasedOnFilter()
  }

  updateProductListBasedOnFilter() {
    console.log("Filtros seleccionados:", this.selectedFilters)
    // Lógica para filtrar la lista basada en `this.selectedFilters`
  }

  propertiesAmount = this.list.length
}
