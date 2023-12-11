import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeStudioComponent } from './home-studio.component'

describe('HomeStudioComponent', () => {
  let component: HomeStudioComponent
  let fixture: ComponentFixture<HomeStudioComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeStudioComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(HomeStudioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
