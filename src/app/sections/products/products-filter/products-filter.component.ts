import { Component, EventEmitter, Output, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import {
  FilterObject,
  FiltersService,
} from '../../../services/filters/filters.service'
import { FormsModule, NgForm } from '@angular/forms'

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  @ViewChild('myForm') myForm!: NgForm
  @Output() filterChange = new EventEmitter<void>()
  type: string = ''
  rooms: number = 0
  minPrice: number = 0
  maxPrice: number = Infinity
  order_by: string = ''
  order: string = ''
  isSellFilterActive: boolean = false
  isRentFilterActive: boolean = false

  showFilters: boolean = false
  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }
  constructor(private filtersService: FiltersService) {
    // Inicializar el estado de los filtros
  }
  ngOnInit(): void {
    this.isSellFilterActive = this.filtersService.isActive(
      'operation_type',
      'Venta',
    )
    this.isRentFilterActive = this.filtersService.isActive(
      'operation_type',
      'Alquiler',
    )
  }

  toggleFilter(filterObj: FilterObject): void {
    this.filtersService.toggle(filterObj)
    // Actualizar el estado de los filtros después de cambiarlos
    this.isSellFilterActive = this.filtersService.isActive(
      'operation_type',
      'Venta',
    )
    this.isRentFilterActive = this.filtersService.isActive(
      'operation_type',
      'Alquiler',
    )
    this.filterChange.emit()
  }

  private syncFilter(
    name: string,
    value: string | number,
    isActive: boolean,
  ): void {
    if (isActive) {
      this.filtersService.add({ name, value })
      return
    }

    this.filtersService.remove({ name, value })
  }

  search(): void {
    this.syncFilter('type', this.myForm.value.type, this.myForm.value.type !== '')
    this.syncFilter('rooms', this.myForm.value.rooms, this.myForm.value.rooms > 0)
    this.syncFilter(
      'minPrice',
      this.myForm.value.minPrice,
      this.myForm.value.minPrice > 0,
    )
    this.syncFilter(
      'maxPrice',
      this.myForm.value.maxPrice,
      this.myForm.value.maxPrice > 0,
    )
    this.syncFilter(
      'order_by',
      this.myForm.value.order_by,
      this.myForm.value.order_by !== '',
    )
    this.syncFilter('order', this.myForm.value.order, this.myForm.value.order !== '')

    this.filterChange.emit()
  }
  clearFilters(): void {
    this.myForm.reset()
    this.filtersService.clear()
    this.filterChange.emit()
  }
}
