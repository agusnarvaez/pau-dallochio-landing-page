import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../components/button/button.component'
import { FaqItemComponent } from '../../components/faq-item/faq-item.component'
import { SeoService } from '../../services/seo/seo.service'

export const SELL_FAQ_ITEMS = [
  {
    question: '¿Qué documentación necesito para publicar mi propiedad?',
    answer:
      'Título de propiedad, declaratoria de herederos o poder y DNI de los titulares o apoderados, reglamento de copropiedad (en caso de departamentos o PH), plano, liquidación de expensas, impuesto municipal y COTI.',
  },
  {
    question: '¿Cuáles son los honorarios y gastos estimados en una venta?',
    answer:
      'Los honorarios de la inmobiliaria para el cliente vendedor son del 3% (más IVA) sobre el valor de la operación. A eso se suman impuestos y gastos de escribanía, que el escribano actuante liquida sobre el valor de escrituración. Te los detallamos con precisión apenas avanzamos con tu tasación.',
  },
  {
    question: '¿Cómo preparo mi propiedad para las visitas?',
    answer:
      'Con un buen home staging alcanza para que se luzca: despejar muebles y ambientes, despersonalizar paredes, cuidar el atractivo exterior, limpiar y ventilar bien, y aromatizar sutilmente. Te damos una guía completa cuando arrancamos el proceso.',
  },
]

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FaqItemComponent],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css',
})
export class SellComponent implements OnInit, OnDestroy {
  faqList = SELL_FAQ_ITEMS

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setFaqStructuredData(SELL_FAQ_ITEMS)
  }

  ngOnDestroy(): void {
    this.seoService.clearFaqStructuredData()
  }
}
