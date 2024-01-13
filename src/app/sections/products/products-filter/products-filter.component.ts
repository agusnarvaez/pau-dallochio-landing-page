import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import { FilterObject, FiltersService } from '../../../services/filters/filters.service'

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.css'
})
export class ProductsFilterComponent {
  @Output() filterChange = new EventEmitter<void>()

  // Propiedades para almacenar el estado de los filtros
  isSellFilterActive: boolean = false
  isRentFilterActive: boolean = false

  constructor(private filtersService: FiltersService) {
    // Inicializar el estado de los filtros
  }
  ngOnInit(): void {
    this.isSellFilterActive = this.filtersService.isActive("operation_type",'Venta')
    this.isRentFilterActive = this.filtersService.isActive("operation_type",'Alquiler')
  }

  toggleFilter(filterObj: FilterObject): void {
    this.filtersService.toggle(filterObj)
    // Actualizar el estado de los filtros después de cambiarlos
    this.isSellFilterActive = this.filtersService.isActive("operation_type",'Venta')
    this.isRentFilterActive = this.filtersService.isActive("operation_type",'Alquiler')
    this.filterChange.emit()
  }
}
