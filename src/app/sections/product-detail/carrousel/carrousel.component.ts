import { Component, HostListener, Input, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import { ChangeDetectorRef } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.css'
})
export class CarrouselComponent {
  @Input() images: string[] | undefined = []
  @Input() videos: string[] | undefined = []

  allMedia = () => [...(this.videos || []),...(this.images || [])]

  isVideo = (url: string) => url.includes('youtube') || url.includes('youtu.be')

  getYoutubeVideoId = (url: string) => {
    const splittedUrl = url.split('/')
    const youtubeId = splittedUrl[splittedUrl.length - 1]
    return youtubeId
  }

  //* Esta variable se usa para saber qué imagen se está mostrando actualmente
  imageIndex = 0
  //* Estas variables se usan para calcular el tamaño de los elementos del carrusel
  carouselContainerHeight = '0%'
  carouselContainerWidth = '0%'
  carouselItemHeight = '0%'
  carouselItemWidth = '0%'

  //* Esta función se llama cada vez que la ventana cambia de tamaño
  @HostListener('window:resize', ['$event'])


  //* Esta función se llama cada vez que la ventana cambia de tamaño
  onResize() {
    this.updateCarouselMetrics()
  }
  updateCarouselMetrics() {
    //* Actualiza las métricas del carrusel basadas en el tamaño de la ventana
    if (window.innerWidth >= 530) {
      this.carouselContainerHeight = `${50 * (this.allMedia()?.length || 0)}%` //* 50% * cantidad de imágenes
      this.carouselContainerWidth = '30%' //* 30% del ancho de la ventana
      this.carouselItemHeight = `${(100 / (this.allMedia()?.length || 1))}%` //* 100% / cantidad de imágenes
      this.carouselItemWidth = '100%' //* 100% del ancho de la ventana
    } else {
      this.carouselContainerWidth = `${100 * (this.allMedia()?.length || 0)}%` //* 100% * cantidad de imágenes
      this.carouselContainerHeight = '100%' //* 100% del alto de la ventana
      this.carouselItemWidth = `${100 / (this.allMedia()?.length || 1)}%` //* 100% / cantidad de imágenes
      this.carouselItemHeight = '100%' //* 100% del alto de la ventana
    }
  }

  noImages=() => this.allMedia()?.length === 0

  selectImage = (index: number) => this.imageIndex = index

  nextImage = () => {
    if (this.allMedia()) this.imageIndex = (this.imageIndex + 1) % this.allMedia().length
  }

  prevImage = () => {
    if (this.allMedia()) this.imageIndex = this.imageIndex === 0 ? this.allMedia().length - 1 : this.imageIndex - 1
  }

  //* Esta función se usa para saber si una imagen está seleccionada
  isImageSelected = (index: number) => this.imageIndex === index

  //* Esta función se usa para calcular el tamaño del carrusel
  imagesSize = () => this.allMedia()?.length || 1

  //* Esta función se usa para calcular la transformación del carrusel
  transformStyle = () => {
    if (window.innerWidth >= 530) {
      //* Cambia a transformación vertical
      const percentage = -((100/this.imagesSize()) * this.imageIndex)
      return `translateY(${percentage}%)`
    } else {
      //* Mantiene transformación horizontal
      const percentage = -((100/this.imagesSize()) * this.imageIndex)
      return `translateX(${percentage}%)`
    }
  }

  //* Esta función se usa para obtener la imagen actual
  actualImage = () => this.allMedia()?.[this.imageIndex]

  //* Esta función se usa para obtener el índice de la imagen actual
  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) {}

  getSafeYoutubeUrl(id: string) {
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + id)

    console.log(safeUrl)
    return safeUrl
  }


  //* Esta función se usa para actualizar el carrusel cuando cambian las imágenes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['images']) {
      this.onResize()
      this.cdr.detectChanges()
    }
  }

  //* Esta función se usa para actualizar el carrusel cuando se inicia el componente
  ngOnInit() {
    this.onResize()
  }
}
