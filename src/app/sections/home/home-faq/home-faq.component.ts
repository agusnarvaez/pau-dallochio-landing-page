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
        'PARA OPERACIONES DE VENTA: <br>• Título de propiedad, declaratoria de herederos o poder DNI de los titulares, o apoderados <br>• Reglamento de copropiedad (en caso de departamentos o PH) <br>• Plano <br> • Liquidación de expensas <br>• Impuesto municipal <br>• COTI'
    },
    {
      question: '¿Cuáles son los gastos estimados en una operación de compraventa?',
      answer:
        'PARA OPERACIONES DE VENTA: <br> • IMPUESTOS: (se abonan en pesos al equivalente del valor del dólar oficial) Retiene el escribano actuante. Se liquidan sobre el valor de escrituración . Sellos 1.75% (por parte), I.T.I. (en caso de corresponder) 1,5%, IVA. <br> • GASTOS DE ESCRIBANÍA: 1-2% (Se solicita presupuesto al escribano actuante) <br> • HONORARIOS INMOBILIARIA: 3%  <br> • IVA (cliente vendedor); 4% <br> • IVA (cliente comprador) <br> • HONORARIOS ESCRIBANÍA: Solo le corresponden al cliente comprador'
    },
    /* {
      question: '¿Cuál es la inversión inicial para un alquiler?',
      answer:
        'PARA OPERACIONES DE ALQUILER RESIDENCIAL PERMANENTE: <br><br> Honorarios inmobiliaria: 4.15% del total del alquiler (Se calcula con el valor del primer mes multiplicado por 36 meses de la duración mínima del contrato.  Los abona la parte LOCATARIA). <br><br> Certificación de firma por escribano'
    }, */
    {
      question: '¿Cómo calculo el índice de ajuste de mi alquiler?',
      answer: '<a href="https://cpicalq.portalcucicba.com.ar/calculo_add.php" target="_blank" rel="noreferer" >CALCULADORA DE AJUSTE</a>'
    },
    {
      question: '¿Cómo preparo mi casa para el relevamiento multimedia y las visitas?',
      answer:
        'El Home staging o puesta en escena, es la forma en que se prepara tu inmueble para que se luzca en la publicación y las visitas de los interesados.  Sugerimos: <br> •	Despejar muebles y ambientes <br>•	Despersonalizar muros, quitar fotos e imágenes religiosas <br>•	Mejorar el atractivo exterior <br>•	Darle estilo a la mesa del comedor <br>•	Generar un espacio de relax al aire libre <br>•	Prestar atención a la estación del año <br>•	Limpiar y ventilar <br>•	Guardar cualquier juguete u objeto que pueda estar sobre el piso <br>•	Aromatizar sutilmente'
    }
  ]

}
