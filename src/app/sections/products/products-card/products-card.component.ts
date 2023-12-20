import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductList } from '../../../models/product'
import { RouterLink } from '@angular/router'
@Component({
  selector: 'app-products-card',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css'
})
export class ProductsCardComponent {
  @Input() product?: ProductList

  mainImage: string | undefined
  ngOnInit(){
    this.mainImage = this.product?.images[0]
  }
  iconButton = '../../../../assets/icons/arrow-up-right.svg'
}
