import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Product } from '../../../models/product'
import { RouterLink } from '@angular/router'

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
  @Input() product?: Product

  iconButton = '../../../../assets/icons/arrow-up-right.svg'

  expenses = () => (this.product?.expenses ? `Expensas: $${this.product?.expenses}` : 'Sin expensas')
}
