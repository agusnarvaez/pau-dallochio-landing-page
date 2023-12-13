import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.css'
})
export class ProductsFilterComponent {
  @Input() selectedFilters: string[] = []
  @Output() filterChange = new EventEmitter<string[]>()

  isFilterActive = (filterText: string): boolean => this.selectedFilters.includes(filterText)

  toggleFilter(filterText: string): void {
    if (this.isFilterActive(filterText)) {
      this.selectedFilters = this.selectedFilters.filter(f => f !== filterText)
    } else {
      this.selectedFilters.push(filterText)
    }
    this.filterChange.emit(this.selectedFilters)
  }
}
