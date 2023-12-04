import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-home-products',
  standalone: true,
  imports: [CommonModule,ButtonComponent,RouterModule],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css'
})
export class HomeProductsComponent {

}
