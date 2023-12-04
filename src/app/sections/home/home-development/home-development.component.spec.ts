import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeDevelopmentComponent } from './home-development.component'

describe('HomeDevelopmentComponent', () => {
  let component: HomeDevelopmentComponent
  let fixture: ComponentFixture<HomeDevelopmentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDevelopmentComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(HomeDevelopmentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
