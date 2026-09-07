import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, catchError, of } from 'rxjs'
import { environment } from '../../../environments/environment'

export interface Review {
  author: string
  avatar: string
  content: string
  rating: number
  time: string
  url: string
}

export interface ReviewsResponse {
  source: string
  placeId: string
  rating: number
  totalCount: number
  mapsUri: string
  fetchedAt: string
  stale: boolean
  reviews: Review[]
}

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  constructor(private http: HttpClient) {}

  getReviews(): Observable<ReviewsResponse | null> {
    return this.http
      .get<ReviewsResponse>(`${environment.reviews_api_prod}/reviews`, {
        // minStars=4: no mostrar reseñas negativas en el home.
        params: { placeId: environment.place_id, minStars: '4' },
      })
      .pipe(catchError(() => of(null)))
  }
}
