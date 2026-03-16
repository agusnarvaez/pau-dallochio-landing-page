import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Product } from '../../../models/product'
import { Router, RouterLink } from '@angular/router'
import { ScrollService } from '../../../services/scroll/scroll.service'

// Importa locales adicionales
import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common'

// Registra los datos locales
registerLocaleData(localeEs)
@Component({
  selector: 'app-products-card',
  standalone: true,
  providers: [],
  imports: [CommonModule, RouterLink],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css',
})
export class ProductsCardComponent {
  constructor(
    private router: Router,
    private scrollService: ScrollService,
  ) {}

  @Input() product?: Product

  iconButton = '../../../../assets/icons/arrow-up-right.svg'

  cardAriaLabel = () => {
    const type = this.product?.type ?? 'Propiedad'
    const street = this.product?.address?.street ?? ''
    const city = this.product?.address?.city ?? ''
    const price = this.product?.price
      ? `${this.product?.currency ?? ''} ${this.product.price}`
      : 'precio no disponible'

    return `Ver detalle de ${type} en ${street} ${city}. Precio ${price}`
  }

  expenses = () =>
    this.product?.expenses
      ? `Expensas: $${this.product?.expenses}`
      : 'Sin expensas'

  scrollToTopOnNavigate(): void {
    this.scrollService.scrollToTopAfterNextNavigation(this.router)
  }
}
