import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  info = [
    {
      title: 'Venta',
      items: [
        'Enfoque personalizado: Iniciamos con una reunión para entender tus necesidades y motivaciones.',
        'Estrategias de valor: Ofrecemos asesoría en mejoras, investigación del área y análisis de la competencia.',
        'Transparencia y seguimiento: Mantenemos una comunicación constante y proporcionamos estadísticas.',
        'Compromiso en exclusiva: Firmamos un acuerdo de trabajo detallado.',
        'Gestión integral: Coordinamos la venta de tu propiedad de principio a fin, asegurando eficiencia y seguridad.'
      ],
      img: '../../../../assets/backgrounds/how-we-work-sale.jpg'
    },
    {
      title: 'Compra',
      items: [
        'Entrevista personalizada: Comenzaremos con una entrevista en profundidad para comprender sus deseos y necesidades específicas en una vivienda.',
        'Representación exclusiva: Firmaremos un acuerdo exclusivo para optimizar tu búsqueda de manera eficiente.',
        'Selección cuidadosa de propiedades: Seleccionaremos un número limitado de propiedades que se ajusten a tus criterios para maximizar tus visitas. Buscaremos la mejor oportunidad de inversión para tu transacción.',
        'Acompañamiento profesional: Te acompañaremos en las visitas, brindando asesoramiento y asegurándonos de que las propiedades cumplan con tus expectativas.',
        'Gestión integral: Coordinamos la compra de tu propiedad de principio a fin, asegurando eficiencia y seguridad.'
      ],
      img: '../../../../assets/backgrounds/how-we-work-purchase.jpg'
    }
  ]
}
