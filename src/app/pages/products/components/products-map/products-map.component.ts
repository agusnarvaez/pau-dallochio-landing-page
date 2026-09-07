import { CommonModule } from '@angular/common'
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { RouterModule } from '@angular/router'
import {
  GoogleMap,
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps'
import { Product } from '../../../../models/product'
import { MapsLoaderService } from '../../../../services/maps-loader/maps-loader.service'

interface ProductMapMarker {
  product: Product
  position: google.maps.LatLngLiteral
}

@Component({
  selector: 'app-products-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, RouterModule],
  templateUrl: './products-map.component.html',
  styleUrl: './products-map.component.css',
})
export class ProductsMapComponent implements OnInit, OnChanges {
  @Input() products: Product[] = []

  @ViewChild(GoogleMap) googleMap!: GoogleMap
  @ViewChildren(MapMarker) markerRefs!: QueryList<MapMarker>
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow

  mapsLoaded = false
  selectedProduct: Product | null = null

  mapCenter: google.maps.LatLngLiteral = { lat: -34.6037, lng: -58.3816 }
  mapZoom = 12
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
  }

  private readonly markerFill = '#b80e3b'

  constructor(private mapsLoader: MapsLoaderService) {}

  ngOnInit(): void {
    void this.initializeMap()
  }

  ngOnChanges(): void {
    if (this.mapsLoaded) {
      setTimeout(() => this.fitBounds())
    }
  }

  get productsWithCoords(): ProductMapMarker[] {
    return this.products
      .map((product) => {
        const lat = Number(product.geo_lat)
        const lng = Number(product.geo_long)
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) {
          return null
        }

        return {
          product,
          position: { lat, lng },
        } satisfies ProductMapMarker
      })
      .filter((marker): marker is ProductMapMarker => marker !== null)
  }

  formatPriceForMap(price: number, currency: string): string {
    if (!price) {
      return 'Consultar'
    }

    const normalizedCurrency = (currency ?? '').toUpperCase()
    const isUSD = normalizedCurrency.includes('USD') || normalizedCurrency === 'U$S'

    if (isUSD) {
      if (price >= 1_000_000) return `USD ${(price / 1_000_000).toFixed(1)}M`
      if (price >= 1_000) return `USD ${Math.round(price / 1_000)}K`
      return `USD ${price.toLocaleString('es-AR')}`
    }

    if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`
    if (price >= 1_000) return `$${Math.round(price / 1_000)}K`
    return `$${price.toLocaleString('es-AR')}`
  }

  getPriceIcon(product: Product): google.maps.Icon {
    const label = this.formatPriceForMap(product.price, product.currency)
    const width = Math.max(74, label.length * 8 + 24)
    const height = 34

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" rx="17" fill="${this.markerFill}" />
      <text x="${width / 2}" y="22" text-anchor="middle" fill="#ffffff"
        font-family="Arial, sans-serif" font-size="13" font-weight="700">${label}</text>
    </svg>`

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(width, height),
      anchor: new google.maps.Point(width / 2, height),
    }
  }

  openInfo(index: number, product: Product): void {
    this.selectedProduct = product
    const marker = this.markerRefs.toArray()[index]
    if (marker) {
      this.infoWindow.open(marker)
    }
  }

  fitBounds(): void {
    if (!this.googleMap || this.productsWithCoords.length === 0) {
      return
    }

    if (this.productsWithCoords.length === 1) {
      const [singleMarker] = this.productsWithCoords
      this.mapCenter = singleMarker.position
      this.mapZoom = 14
      return
    }

    const bounds = new google.maps.LatLngBounds()
    this.productsWithCoords.forEach((marker) => {
      bounds.extend(marker.position)
    })
    this.googleMap.fitBounds(bounds)
  }

  private async initializeMap(): Promise<void> {
    try {
      await this.mapsLoader.load()
      this.mapsLoaded = true
      setTimeout(() => this.fitBounds())
    } catch (error) {
      console.error(error)
      this.mapsLoaded = false
    }
  }
}
