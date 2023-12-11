import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-home-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-reviews.component.html',
  styleUrl: './home-reviews.component.css'
})
export class HomeReviewsComponent {
  reviews = [
    {
      author: "C.R.D.",
      stars: 5,
      content: "Paula Dallochio, excelentísima gestión, expeditiva, ordenada, super atenta y siempre bien dispuesta. Muchísimas gracias por ayudar a que todo sea más fácil!!"
    },
    {
      author: "N.H.",
      stars: 4,
      content: "Trabajar con Paula ha sido un placer, altamente recomendable."
    },
    {
      author: "Y.C.",
      stars: 5,
      content: "Sin dudas excelentes profesionales! Venden cuando nadie vende en el mercado! Pau Dallochio, mi especial agradecimiento por la atención constante, y el gran esfuerzo que hiciste, sos la 1!!!"
    },
    {
      author: "C.T.",
      stars: 4.3,
      content: "Excelentes profesionales! Muy atentos a todos los detalles!"
    }
  ]

  makeArray = (num:number) => new Array(Math.round(num))

  isOdd = (num:number) => num % 2 === 1
}
