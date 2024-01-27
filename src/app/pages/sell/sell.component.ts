import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../components/button/button.component'
import { Meta,Title  } from '@angular/platform-browser'

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent {
  constructor(private metaTagService: Meta,private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Vendé tu propiedad - Paula Dallochio Inmobiliaria')
    this.metaTagService.updateTag({ name: 'description', content: '¿Querés vender tu propiedad? Paula Dallochio te ofrece asesoramiento experto y personalizado para que puedas vender tu propiedad al mejor precio.' })
    this.metaTagService.updateTag({ name: 'keywords', content: ' Venta de propiedades, vender mi casa, vender mi departamento, vender mi terreno, vender mi local comercial, vender mi propiedad, asesoramiento inmobiliario, asesoramiento para vender mi propiedad' })

    this.metaTagService.updateTag({ property: 'og:title', content: 'Vendé tu propiedad - Paula Dallochio Inmobiliaria' })
    this.metaTagService.updateTag({ property: 'og:description', content: '¿Querés vender tu propiedad? Paula Dallochio te ofrece asesoramiento experto y personalizado para que puedas vender tu propiedad al mejor precio.' })
    this.metaTagService.updateTag({ property: 'og:url', content: 'https://www.pauladallochio.com.ar/vender' })

    this.metaTagService.updateTag({ name: 'twitter:title', content: 'Vendé tu propiedad - Paula Dallochio Inmobiliaria' })
    this.metaTagService.updateTag({ name: 'twitter:description', content: '¿Querés vender tu propiedad? Paula Dallochio te ofrece asesoramiento experto y personalizado para que puedas vender tu propiedad al mejor precio.' })
    this.metaTagService.updateTag({ name: 'twitter:url', content: 'https://www.pauladallochio.com.ar/vender' })
  }
}
