import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeIntroductionComponent } from './home-introduction.component'

describe('HomeIntroductionComponent', () => {
  let component: HomeIntroductionComponent
  let fixture: ComponentFixture<HomeIntroductionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeIntroductionComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(HomeIntroductionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
