import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HeaderComponent } from './header.component'
import { ActivatedRoute } from '@angular/router'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                title: 'pau-dallochio-landing-page'
              }
            }
          }
        }
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should toggle showHeader', () => {
    const initialShowHeader = component.showHeader
    component.toggleHeader()
    expect(component.showHeader).toBe(!initialShowHeader)
  })
})
