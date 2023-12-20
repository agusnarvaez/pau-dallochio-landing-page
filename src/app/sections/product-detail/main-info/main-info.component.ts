import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductDetail } from '../../../models/product'

@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-info.component.html',
  styleUrl: './main-info.component.css'
})
export class MainInfoComponent {
  @Input() product: ProductDetail | undefined
}
