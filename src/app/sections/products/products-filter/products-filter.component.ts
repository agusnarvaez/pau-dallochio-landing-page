import { Component, DestroyRef, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import {
  Filters,
  FilterObject,
  FiltersService,
} from '../../../services/filters/filters.service'
import { FormsModule, NgForm } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  @ViewChild('myForm') myForm!: NgForm
  type: string = ''
  rooms: number = 0
  minPrice: number = 0
  maxPrice: number = 0
  order_by: string = ''
  order: string = ''
  isSellFilterActive: boolean = false
  isRentFilterActive: boolean = false
  private destroyRef = inject(DestroyRef)

  showFilters: boolean = false
  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }
  constructor(private filtersService: FiltersService) {
    // Inicializar el estado de los filtros
  }

  private syncLocalState(filters: Filters): void {
    this.type = String(filters['type'] ?? '')
    this.rooms = Number(filters['rooms'] ?? 0)
    this.minPrice = Number(filters['minPrice'] ?? 0)
    this.maxPrice = Number(filters['maxPrice'] ?? 0)
    this.order_by = String(filters['order_by'] ?? '')
    this.order = String(filters['order'] ?? '')

    this.isSellFilterActive = filters['operation_type'] === 'Venta'
    this.isRentFilterActive = filters['operation_type'] === 'Alquiler'
  }

  ngOnInit(): void {
    this.syncLocalState(this.filtersService.get())
    this.filtersService.filters$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filters) => {
        this.syncLocalState(filters)
      })
  }

  toggleFilter(filterObj: FilterObject): void {
    this.filtersService.toggle(filterObj)
  }

  search(): void {
    this.filtersService.patch({
      type: this.myForm.value.type,
      rooms: Number(this.myForm.value.rooms),
      minPrice: Number(this.myForm.value.minPrice),
      maxPrice: Number(this.myForm.value.maxPrice),
      order_by: this.myForm.value.order_by,
      order: this.myForm.value.order,
    })
  }

  clearFilters(): void {
    this.myForm.reset({
      type: '',
      rooms: 0,
      minPrice: 0,
      maxPrice: 0,
      order_by: '',
      order: '',
    })
    this.filtersService.clear()
  }
}
