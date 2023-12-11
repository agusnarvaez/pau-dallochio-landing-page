import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FaqItemComponent } from '../../../components/faq-item/faq-item.component'

@Component({
  selector: 'app-home-faq',
  standalone: true,
  imports: [CommonModule,FaqItemComponent],
  templateUrl: './home-faq.component.html',
  styleUrl: './home-faq.component.css'
})
export class HomeFaqComponent {
  constructor() {}
  faqList = [
    {
      question: '¿Qué documentación necesito para poder publicar mi propiedad?',
      answer:
        'Título de propiedad, declaratoria de herederos o poder DNI de los titulares, o apoderados Reglamento de copropiedad (en caso de departamentos o PH) Plano Liquidación de expensas Impuesto municipal COTI'
    },
    {
      question: '¿Cuáles son los gastos estimados en una operación de compraventa?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    },
    {
      question: '¿Cuál es la inversión inicial para un alquiler?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    },
    {
      question: '¿Cómo calculo el índice de ajuste de mi alquiler?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    },
    {
      question: '¿Cómo preparo mi casa para el relevamiento multimedia y las visitas?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    }
  ]

}
