import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PurposeComponent } from '../../sections/how-we-work/purpose/purpose.component'
import { SalesComponent } from '../../sections/how-we-work/sales/sales.component'
import { AdviceComponent } from '../../sections/how-we-work/advice/advice.component'
import { Meta,Title  } from '@angular/platform-browser'

@Component({
  selector: 'app-how-we-work',
  standalone: true,
  imports: [CommonModule,PurposeComponent,SalesComponent,AdviceComponent],
  templateUrl: './how-we-work.component.html',
  styleUrl: './how-we-work.component.css'
})
export class HowWeWorkComponent {
  constructor(private metaTagService: Meta,private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Nuestro Método de Trabajo en Bienes Raíces - Paula Dallochio')
    this.metaTagService.updateTag({ name: 'description', content: 'Descubre cómo con mi gran experiencia en bienes raíces, abordo cada proyecto inmobiliario con un método único y efectivo, asegurando resultados óptimos y satisfacción del cliente.' })
    this.metaTagService.updateTag({ name: 'keywords', content: 'Método inmobiliario, enfoque profesional, estrategia de bienes raíces, satisfacción del cliente, proceso inmobiliario' })

    this.metaTagService.updateTag({ property: 'og:title', content: 'Nuestro Método de Trabajo en Bienes Raíces - Paula Dallochio' })
    this.metaTagService.updateTag({ property: 'og:description', content: 'Descubre cómo con mi gran experiencia en bienes raíces, abordo cada proyecto inmobiliario con un método único y efectivo, asegurando resultados óptimos y satisfacción del cliente.' })
    this.metaTagService.updateTag({ property: 'og:url', content: 'https://www.pauladallochio.com.ar/como-trabajamos' })

    this.metaTagService.updateTag({ name: 'twitter:title', content: 'Nuestro Método de Trabajo en Bienes Raíces - Paula Dallochio' })
    this.metaTagService.updateTag({ name: 'twitter:description', content: 'Descubre cómo con mi gran experiencia en bienes raíces, abordo cada proyecto inmobiliario con un método único y efectivo, asegurando resultados óptimos y satisfacción del cliente.' })
    this.metaTagService.updateTag({ name: 'twitter:url', content: 'https://www.pauladallochio.com.ar/como-trabajamos' })
  }
}
