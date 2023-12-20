import { Component, HostListener, Input, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import { ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.css'
})
export class CarrouselComponent {
  @Input() images: string[] | undefined = []
  imageIndex = 0
  carouselContainerHeight = '0%'
  carouselContainerWidth = '0%'
  carouselItemHeight = '0%'
  carouselItemWidth = '0%'

  @HostListener('window:resize', ['$event'])

  onResize() {
    // Esta función se llama cada vez que la ventana cambia de tamaño
    this.updateCarouselMetrics()
  }
  updateCarouselMetrics() {
    // Actualiza las métricas del carrusel basadas en el tamaño de la ventana
    if (window.innerWidth >= 530) {
      this.carouselContainerHeight = `${50 * (this.images?.length || 0)}%`
      this.carouselContainerWidth = '30%'
      this.carouselItemHeight = `${(100 / (this.images?.length || 1))}%`
      this.carouselItemWidth = '100%'

    } else {
      this.carouselContainerWidth = `${100 * (this.images?.length || 0)}%`
      this.carouselContainerHeight = '100%'
      this.carouselItemWidth = `${100 / (this.images?.length || 1)}%`
      this.carouselItemHeight = '100%'
    }
  }

  noImages=() => this.images?.length === 0


  selectImage = (index: number) => {
    this.imageIndex = index
  }

  nextImage = () => {
    if (this.images) {
      this.imageIndex = (this.imageIndex + 1) % this.images.length
    }
  }

  prevImage = () => {
    if (this.images) {
      this.imageIndex = this.imageIndex === 0 ? this.images.length - 1 : this.imageIndex - 1
    }
  }
  isImageSelected = (index: number) => this.imageIndex === index
  imagesSize = () => this.images?.length || 1
  transformStyle = () => {
    if (window.innerWidth >= 530) {
      // Cambia a transformación vertical
      const percentage = -((100/this.imagesSize()) * this.imageIndex)
      return `translateY(${percentage}%)`
    } else {
      // Mantiene transformación horizontal
      const percentage = -((100/this.imagesSize()) * this.imageIndex)
      return `translateX(${percentage}%)`
    }
  }

  actualImage = () => this.images?.[this.imageIndex]

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['images']) {
      this.onResize()
      this.cdr.detectChanges()
    }
  }
  ngOnInit() {
    this.onResize()
  }
}
