import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Product } from '../../../models/product'
import { GoogleMapsModule } from '@angular/google-maps'
import { MapsLoaderService } from '../../../services/maps-loader/maps-loader.service'

type WindowWithGoogle = Window & {
  google?: {
    maps?: {
      importLibrary?: (libraryName: string) => Promise<unknown>
      Map?: unknown
      Marker?: unknown
    }
  }
}

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
  markerApiLoaded = false

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 } // Default to Buenos Aires city center, for example
  marker: google.maps.MarkerOptions = {
    draggable: false,
    position: this.center,
    title: 'Property Location',
  }

  constructor(private mapsLoader: MapsLoaderService) {}

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
    void this.initializeMapsApi()
  }

  private async initializeMapsApi(): Promise<void> {
    const win = window as WindowWithGoogle

    try {
      await this.mapsLoader.load()

      if (typeof win.google?.maps?.importLibrary === 'function') {
        await win.google.maps.importLibrary('maps')

        try {
          await win.google.maps.importLibrary('marker')
        } catch {
          // Si marker no esta disponible, mostramos el mapa igual sin pin.
        }
      }

      this.mapsApiLoaded = true
      this.markerApiLoaded = this.isMarkerReady(win)
    } catch {
      this.mapsApiLoaded = this.isMapReady(win)
      this.markerApiLoaded = this.isMarkerReady(win)
    }
  }

  private isMapReady(win: WindowWithGoogle): boolean {
    return typeof win.google?.maps?.Map === 'function'
  }

  private isMarkerReady(win: WindowWithGoogle): boolean {
    return typeof win.google?.maps?.Marker === 'function'
  }

  mapEmbedUrl(): string {
    const lat = this.product?.geo_lat
    const lng = this.product?.geo_long

    if (!lat || !lng) {
      const address = [
        this.product?.address?.street,
        this.product?.address?.city,
      ]
        .filter(Boolean)
        .join(', ')

      if (!address) {
        return ''
      }

      return `https://www.google.com/maps?q=${encodeURIComponent(
        address,
      )}&z=15&output=embed`
    }

    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  }
}
