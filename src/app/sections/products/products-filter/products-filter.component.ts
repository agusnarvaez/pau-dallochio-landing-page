import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.css'
})
export class ProductsFilterComponent {
  filter = 'Comprar'

  isFilterActive = (filterText:string) =>  this.filter != filterText

  setActiveFilter = (filterText:string) => this.filter = filterText
  
}
