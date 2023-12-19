import { ButtonComponent } from './../../components/button/button.component'
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CarrouselComponent } from '../../sections/product-detail/carrousel/carrousel.component'
import { MainInfoComponent } from '../../sections/product-detail/main-info/main-info.component'
import { ContactCardComponent } from '../../sections/product-detail/contact-card/contact-card.component'
import { SuggestionsComponent } from '../../sections/product-detail/suggestions/suggestions.component'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,ButtonComponent,CarrouselComponent,MainInfoComponent,ContactCardComponent,SuggestionsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

}
