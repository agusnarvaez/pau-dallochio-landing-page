import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { SellComponent } from './sell.component'

describe('SellComponent', () => {
  let component: SellComponent
  let fixture: ComponentFixture<SellComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellComponent, RouterTestingModule],
    }).compileComponents()

    fixture = TestBed.createComponent(SellComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
