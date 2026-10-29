import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductDetail } from '../../../models/product'
import { GoogleMapsModule } from '@angular/google-maps'

@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [CommonModule,GoogleMapsModule],
  templateUrl: './main-info.component.html',
  styleUrl: './main-info.component.css'
})
export class MainInfoComponent implements OnChanges {
  @Input() product: ProductDetail | undefined
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']&& this.product) {
      this.center = {
        lat: this.product.geo_lat ?? 0,
        lng: this.product.geo_long ?? 0,
      }
      console.log(this.center)
    }
  }

  // ngOnInit no es necesario si usas ngOnChanges
}
