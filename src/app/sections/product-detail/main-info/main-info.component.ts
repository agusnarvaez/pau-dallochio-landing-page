import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Product } from '../../../models/product'
import { GoogleMapsModule } from '@angular/google-maps'
import { environment } from '../../../../../enviroment.prod'
@Component({
  selector: 'app-main-info',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './main-info.component.html',
  styleUrl: './main-info.component.css',
})
export class MainInfoComponent {
  @Input() product: Product | undefined
  mapsApiLoaded = false

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 } // Default to Buenos Aires city center, for example
  marker: google.maps.MarkerOptions = {
    draggable: false,
    position: this.center,
    title: 'Property Location',
  }

  ngOnChanges(): void {
    if (this.product) {
      const lat = parseFloat(this.product.geo_lat.toString())
      const lng = parseFloat(this.product.geo_long.toString())

      this.center = { lat: lat, lng: lng }
      this.marker.position = this.center
    }
  }
  expenses = () =>
    this.product?.expenses
      ? `Expensas: $${this.product?.expenses}`
      : 'Sin expensas'

  ngOnInit(): void {
    if (this.isGoogleMapsReady()) {
      this.mapsApiLoaded = true
      return
    }

    const existingScript = document.getElementById(
      'googleMapsScript',
    ) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        this.mapsApiLoaded = this.isGoogleMapsReady()
      })
      return
    }

    const script = document.createElement('script')
    script.id = 'googleMapsScript' // Asegúrate de que el script no se añada más de una vez.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.maps_key}&loading=async`
    script.async = true // Carga el script de forma asíncrona.
    script.defer = true // Diferir la ejecución del script hasta que la carga de la página haya terminado.
    script.addEventListener('load', () => {
      this.mapsApiLoaded = this.isGoogleMapsReady()
    })

    document.head.appendChild(script)
  }

  private isGoogleMapsReady(): boolean {
    const windowWithGoogle = window as Window & {
      google?: { maps?: unknown }
    }

    return !!windowWithGoogle.google?.maps
  }
}
