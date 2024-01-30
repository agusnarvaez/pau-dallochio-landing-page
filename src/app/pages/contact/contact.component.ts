import { FormsModule,  } from '@angular/forms'
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../components/button/button.component'
import { ContactFormComponent } from '../../sections/contact/contact-form/contact-form.component'
import { Meta,Title  } from '@angular/platform-browser'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,FormsModule,ButtonComponent,ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})


export class ContactComponent {
  constructor(private metaTagService: Meta,private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Contáctanos - Paula Dallochio Inmobiliaria')
    this.metaTagService.updateTag({ name: 'description', content: '¿Interesado en servicios inmobiliarios? Contacta a Paula Dallochio para consultas y asesoramiento experto. Encuentra aquí toda la información de contacto.' })
    this.metaTagService.updateTag({ name: 'keywords', content: ' Contacto inmobiliario, consulta inmobiliaria, asesoramiento en bienes raíces, información de contacto, servicios de Paula Dallochio' })

    this.metaTagService.updateTag({ property: 'og:title', content: 'Contáctanos - Paula Dallochio Inmobiliaria' })
    this.metaTagService.updateTag({ property: 'og:description', content: '¿Interesado en servicios inmobiliarios? Contacta a Paula Dallochio para consultas y asesoramiento experto. Encuentra aquí toda la información de contacto.' })
    this.metaTagService.updateTag({ property: 'og:url', content: 'https://www.pauladallochio.com.ar/contacto' })

    this.metaTagService.updateTag({ name: 'twitter:title', content: 'Contáctanos - Paula Dallochio Inmobiliaria' })
    this.metaTagService.updateTag({ name: 'twitter:description', content: '¿Interesado en servicios inmobiliarios? Contacta a Paula Dallochio para consultas y asesoramiento experto. Encuentra aquí toda la información de contacto.' })
    this.metaTagService.updateTag({ name: 'twitter:url', content: 'https://www.pauladallochio.com.ar/contacto' })
  }
}
