import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'

import { HomeReviewsComponent } from './home-reviews.component'

describe('HomeReviewsComponent', () => {
  let component: HomeReviewsComponent
  let fixture: ComponentFixture<HomeReviewsComponent>
  let httpMock: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeReviewsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents()

    httpMock = TestBed.inject(HttpTestingController)
    fixture = TestBed.createComponent(HomeReviewsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should create', () => {
    httpMock.expectOne((req) => req.url.includes('/reviews')).flush(null)
    expect(component).toBeTruthy()
  })

  it('renderiza reseñas de la API cuando la respuesta trae items', () => {
    httpMock.expectOne((req) => req.url.includes('/reviews')).flush({
      source: 'places',
      placeId: 'ChIJtest',
      rating: 4.9,
      totalCount: 10,
      mapsUri: 'https://maps.google.com',
      fetchedAt: new Date().toISOString(),
      stale: false,
      reviews: [
        {
          author: 'Ana',
          avatar: 'https://example.com/a.png',
          content: 'Excelente',
          rating: 5,
          time: '2025-01-01T00:00:00Z',
          url: 'https://google.com/maps/contrib/1',
        },
      ],
    })

    expect(component.reviews[0].author).toBe('Ana')
    expect(component.reviews[0].stars).toBe(5)
    expect(component.reviews[0].avatar).toBe('https://example.com/a.png')
  })

  it('renderiza el fallback si la petición falla', () => {
    httpMock
      .expectOne((req) => req.url.includes('/reviews'))
      .flush('boom', { status: 500, statusText: 'Server Error' })

    expect(component.reviews).toEqual(component.fallback)
  })
})
