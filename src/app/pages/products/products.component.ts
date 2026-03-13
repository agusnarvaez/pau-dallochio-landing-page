import { ProductService } from './../../services/product/product.service'
import { Component, DestroyRef, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductsBannerComponent } from '../../sections/products/products-banner/products-banner.component'
import { ProductsFilterComponent } from '../../sections/products/products-filter/products-filter.component'
import { ProductsCardComponent } from '../../sections/products/products-card/products-card.component'
import { Product } from '../../models/product'
import { Meta, Title } from '@angular/platform-browser'
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

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductsBannerComponent,
    ProductsFilterComponent,
    ProductsCardComponent,
    ButtonComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  list: Product[] = []
  hasLoadError = false
  private destroyRef = inject(DestroyRef)

  constructor(
    private productService: ProductService,
    private metaTagService: Meta,
    private titleService: Title,
    private loaderService: LoaderService,
  ) {}

  selectedFilters = () => this.productService.filters()

  updateProductsList() {
    this.hasLoadError = false
    this.loaderService.showLoading()
    this.productService
      .getAll()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.hasLoadError = true
          this.list = []
          return EMPTY
        }),
        finalize(() => {
          this.loaderService.hideLoading()
        }),
      )
      .subscribe((products) => {
        this.list = products
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

    this.titleService.setTitle(
      'Catálogo de Propiedades - Paula Dallochio Inmobiliaria',
    )
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'Explora nuestro catálogo de propiedades cuidadosamente seleccionadas. Paula Dallochio te ofrece las mejores opciones inmobiliarias del mercado para tu elección ideal.',
    })
    this.metaTagService.updateTag({
      name: 'keywords',
      content:
        ' Catálogo de propiedades, propiedades en venta, propiedades en alquiler, propiedades en venta y alquiler, catálogo de propiedades inmobiliarias',
    })

    this.metaTagService.updateTag({
      property: 'og:title',
      content: 'Catálogo de Propiedades - Paula Dallochio Inmobiliaria',
    })
    this.metaTagService.updateTag({
      property: 'og:description',
      content:
        'Explora nuestro catálogo de propiedades cuidadosamente seleccionadas. Paula Dallochio te ofrece las mejores opciones inmobiliarias del mercado para tu elección ideal.',
    })
    this.metaTagService.updateTag({
      property: 'og:url',
      content: 'https://www.pauladallochio.com.ar/catalogo',
    })

    this.metaTagService.updateTag({
      name: 'twitter:title',
      content: 'Catálogo de Propiedades - Paula Dallochio Inmobiliaria',
    })
    this.metaTagService.updateTag({
      name: 'twitter:description',
      content:
        'Explora nuestro catálogo de propiedades cuidadosamente seleccionadas. Paula Dallochio te ofrece las mejores opciones inmobiliarias del mercado para tu elección ideal.',
    })
    this.metaTagService.updateTag({
      name: 'twitter:url',
      content: 'https://www.pauladallochio.com.ar/catalogo',
    })
  }
}
