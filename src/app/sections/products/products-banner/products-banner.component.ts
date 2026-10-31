import { Component } from '@angular/core'

import { ButtonComponent } from '../../../components/button/button.component'

@Component({
  selector: 'app-products-banner',
  imports: [ButtonComponent],
  templateUrl: './products-banner.component.html',
  styleUrl: './products-banner.component.css',
})
export class ProductsBannerComponent {}
