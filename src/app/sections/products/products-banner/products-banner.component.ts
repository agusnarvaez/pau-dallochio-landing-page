import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'

@Component({
  selector: 'app-products-banner',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './products-banner.component.html',
  styleUrl: './products-banner.component.css'
})
export class ProductsBannerComponent {

}
