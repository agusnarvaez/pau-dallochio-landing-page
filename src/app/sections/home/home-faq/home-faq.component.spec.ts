import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeFaqComponent } from './home-faq.component'

describe('HomeFaqComponent', () => {
  let component: HomeFaqComponent
  let fixture: ComponentFixture<HomeFaqComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFaqComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(HomeFaqComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
