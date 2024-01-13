import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Product } from '../../../models/product'
import { GoogleMapsModule } from '@angular/google-maps'

@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [CommonModule,GoogleMapsModule],
  templateUrl: './main-info.component.html',
  styleUrl: './main-info.component.css'
})
export class MainInfoComponent {
  @Input() product: Product | undefined
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 } // Default to Buenos Aires city center, for example
  marker: google.maps.MarkerOptions = {
    draggable: false,
    position: this.center,
    title: 'Property Location'
  }

  ngOnChanges(): void {
    if (this.product) {
      const lat = parseFloat(this.product.geo_lat.toString())
      const lng = parseFloat(this.product.geo_long.toString())

      this.center = { lat: lat, lng: lng }
      this.marker.position = this.center
    }
  }

}