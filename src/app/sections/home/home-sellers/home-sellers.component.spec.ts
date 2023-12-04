import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeSellersComponent } from './home-sellers.component'

describe('HomeSellersComponent', () => {
  let component: HomeSellersComponent
  let fixture: ComponentFixture<HomeSellersComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSellersComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(HomeSellersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
