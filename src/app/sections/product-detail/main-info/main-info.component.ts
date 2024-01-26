import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Product } from '../../../models/product'
import { GoogleMapsModule } from '@angular/google-maps'
import { environment } from '../../../../../enviroment.prod'
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

  ngOnInit(): void {
    if (document.getElementById('googleMapsScript')) return

    const script = document.createElement('script')
    script.id = 'googleMapsScript' // Asegúrate de que el script no se añada más de una vez.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.maps_key}`
    script.async = true // Carga el script de forma asíncrona.
    script.defer = true // Diferir la ejecución del script hasta que la carga de la página haya terminado.
    
    document.head.appendChild(script)
  }
}