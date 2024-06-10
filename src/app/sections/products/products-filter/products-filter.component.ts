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
  search(): void {
    console.log('onSubmit')
    if (this.myForm.value.type != '')
      this.filtersService.add({ name: 'type', value: this.myForm.value.type })
    if (this.myForm.value.rooms > 0)
      this.filtersService.add({ name: 'rooms', value: this.myForm.value.rooms })
    if (this.myForm.value.minPrice > 0)
      this.filtersService.add({
        name: 'minPrice',
        value: this.myForm.value.minPrice,
      })
    if (this.myForm.value.maxPrice > 0)
      this.filtersService.add({
        name: 'maxPrice',
        value: this.myForm.value.maxPrice,
      })

    if (this.myForm.value.order_by != '') {
      this.filtersService.add({
        name: 'order_by',
        value: this.myForm.value.order_by,
      })
    }

    if (this.myForm.value.order != '') {
      this.filtersService.add({ name: 'order', value: this.myForm.value.order })
    }

    this.filterChange.emit()
  }
  clearFilters(): void {
    this.myForm.reset()
    this.filtersService.clear()
    this.filterChange.emit()
  }
}
