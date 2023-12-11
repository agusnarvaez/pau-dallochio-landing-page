import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeReviewsComponent } from './home-reviews.component'

describe('HomeReviewsComponent', () => {
  let component: HomeReviewsComponent
  let fixture: ComponentFixture<HomeReviewsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeReviewsComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(HomeReviewsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
