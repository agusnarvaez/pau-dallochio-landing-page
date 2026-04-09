import { ProductService } from './../../services/product/product.service'
import { Component, DestroyRef, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductsBannerComponent } from '../../sections/products/products-banner/products-banner.component'
import { ProductsFilterComponent } from '../../sections/products/products-filter/products-filter.component'
import { ProductsCardComponent } from '../../sections/products/products-card/products-card.component'
import { ProductsMapComponent } from './components/products-map/products-map.component'
import { Product } from '../../models/product'
import { ButtonComponent } from '../../components/button/button.component'
import { LoaderService } from '../../services/loader/loader.service'
import {
  EMPTY,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
} from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { SeoService } from '../../services/seo/seo.service'

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductsBannerComponent,
    ProductsFilterComponent,
    ProductsCardComponent,
    ProductsMapComponent,
    ButtonComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  list: Product[] = []
  viewMode: 'list' | 'map' = 'list'
  hasLoadError = false
  isLoading = false
  private destroyRef = inject(DestroyRef)

  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
    private seoService: SeoService,
  ) {}

  selectedFilters = () => this.productService.filters()

  toggleView(): void {
    this.viewMode = this.viewMode === 'list' ? 'map' : 'list'
  }

  private readonly filterLabelMap: Record<string, string> = {
    operation_type: 'Operación',
    type: 'Tipo',
    rooms: 'Ambientes',
    minPrice: 'Precio desde',
    maxPrice: 'Precio hasta',
    order_by: 'Ordenar por',
    order: 'Dirección',
  }

  hasActiveFilters = () => Object.keys(this.selectedFilters()).length > 0

  activeFiltersCount = () => Object.keys(this.selectedFilters()).length

  clearAllFilters() {
    this.productService.filtersService.clear()
  }

  activeFilterSummary = () => {
    return Object.entries(this.selectedFilters()).map(([key, value]) => {
      const label = this.filterLabelMap[key] ?? key
      return `${label}: ${value}`
    })
  }

  updateProductsList() {
    this.hasLoadError = false
    this.isLoading = true
    this.loaderService.showLoading()
    this.productService
      .getAll()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.hasLoadError = true
          this.list = []
          this.seoService.clearCatalogStructuredData()
          this.seoService.clearBreadcrumbStructuredData()
          return EMPTY
        }),
        finalize(() => {
          this.isLoading = false
          this.loaderService.hideLoading()
        }),
      )
      .subscribe((products) => {
        this.list = products
        this.seoService.setCatalogStructuredData(products)
      })
  }

  propertiesAmount = () => this.list.length

  listIsEmpty = () => this.list.length === 0

  typeOfOperation = () => {
    if (this.productService.filters()['operation_type'] == 'Venta')
      return 'compra'

    if (this.productService.filters()['operation_type'] == 'Alquiler')
      return 'alquiler'

    return 'compra o alquiler'
  }

  ngOnInit() {
    this.productService.filtersService.filters$
      .pipe(
        debounceTime(250),
        map((filters) => JSON.stringify(filters)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateProductsList()
      })
  }

  ngOnDestroy(): void {
    this.seoService.clearCatalogStructuredData()
    this.seoService.clearBreadcrumbStructuredData()
  }
}
