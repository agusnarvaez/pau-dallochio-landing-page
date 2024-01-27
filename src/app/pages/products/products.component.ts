import { ProductService } from './../../services/product/product.service'
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductsBannerComponent } from '../../sections/products/products-banner/products-banner.component'
import { ProductsFilterComponent } from '../../sections/products/products-filter/products-filter.component'
import { ProductsCardComponent } from '../../sections/products/products-card/products-card.component'
import { Product } from '../../models/product'
import { Meta,Title  } from '@angular/platform-browser'

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
  list: Product[] = []

  constructor(
    private productService: ProductService,
    private metaTagService: Meta,
    private titleService: Title
    ) { }

  onFilterChange() {
    this.updateProductsList()
  }

  selectedFilters = () => this.productService.filters()

  updateProductsList() {
    // Lógica para filtrar la lista basada en `this.selectedFilters`
    this.productService.getAll().subscribe(
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

  typeOfOperation = () => {
    if(this.productService.filters()["operation_type"]=="Venta") return "compra"

    if(this.productService.filters()["operation_type"]=="Alquiler") return "alquiler"

    return "compra o alquiler"
  }

  ngOnInit() {
    // Lógica para inicializar `this.list`
    this.updateProductsList()

    this.titleService.setTitle('Catálogo de Propiedades - Paula Dallochio Inmobiliaria')
    this.metaTagService.updateTag({ name: 'description', content: 'Explora nuestro catálogo de propiedades cuidadosamente seleccionadas. Paula Dallochio te ofrece las mejores opciones inmobiliarias del mercado para tu elección ideal.' })
    this.metaTagService.updateTag({ name: 'keywords', content: ' Catálogo de propiedades, propiedades en venta, propiedades en alquiler, propiedades en venta y alquiler, catálogo de propiedades inmobiliarias' })

    this.metaTagService.updateTag({ property: 'og:title', content: 'Catálogo de Propiedades - Paula Dallochio Inmobiliaria' })
    this.metaTagService.updateTag({ property: 'og:description', content: 'Explora nuestro catálogo de propiedades cuidadosamente seleccionadas. Paula Dallochio te ofrece las mejores opciones inmobiliarias del mercado para tu elección ideal.' })
    this.metaTagService.updateTag({ property: 'og:url', content: 'https://www.pauladallochio.com.ar/catalogo' })

    this.metaTagService.updateTag({ name: 'twitter:title', content: 'Catálogo de Propiedades - Paula Dallochio Inmobiliaria' })
    this.metaTagService.updateTag({ name: 'twitter:description', content: 'Explora nuestro catálogo de propiedades cuidadosamente seleccionadas. Paula Dallochio te ofrece las mejores opciones inmobiliarias del mercado para tu elección ideal.' })
    this.metaTagService.updateTag({ name: 'twitter:url', content: 'https://www.pauladallochio.com.ar/catalogo' })

  }

}
