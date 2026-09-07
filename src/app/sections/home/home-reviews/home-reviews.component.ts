import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReviewsService } from '../../../services/reviews/reviews.service'

interface DisplayReview {
  author: string
  stars: number
  content: string
  avatar?: string
  url?: string
}

@Component({
  selector: 'app-home-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-reviews.component.html',
  styleUrl: './home-reviews.component.css'
})
export class HomeReviewsComponent implements OnInit {
  fallback: DisplayReview[] = [
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

  reviews: DisplayReview[] = this.fallback

  constructor(private reviewsSvc: ReviewsService) {}

  ngOnInit() {
    this.reviewsSvc.getReviews().subscribe((response) => {
      if (response?.reviews?.length) {
        this.reviews = response.reviews.map((review) => ({
          author: review.author,
          stars: review.rating,
          content: review.content,
          avatar: review.avatar,
          url: review.url,
        }))
      }
    })
  }

  makeArray = (num:number) => new Array(Math.round(num))

  isOdd = (num:number) => num % 2 === 1
}
