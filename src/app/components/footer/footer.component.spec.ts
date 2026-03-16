import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { ScrollService } from '../../services/scroll/scroll.service'

import { FooterComponent } from './footer.component'

describe('FooterComponent', () => {
  let component: FooterComponent
  let fixture: ComponentFixture<FooterComponent>
  let scrollServiceSpy: jasmine.SpyObj<ScrollService>
  let routerStub: Router

  beforeEach(async () => {
    scrollServiceSpy = jasmine.createSpyObj<ScrollService>('ScrollService', [
      'scrollToTopAfterNextNavigation',
    ])
    routerStub = {
      navigate: jasmine.createSpy('navigate'),
      events: { pipe: () => ({ subscribe: () => undefined }) },
    } as unknown as Router

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ScrollService, useValue: scrollServiceSpy },
      ],
    }).compileComponents()

    TestBed.overrideComponent(FooterComponent, {
      set: { template: '' },
    })

    fixture = TestBed.createComponent(FooterComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should delegate goToTopAfterNavigation to ScrollService', () => {
    component.goToTopAfterNavigation()

    expect(
      scrollServiceSpy.scrollToTopAfterNextNavigation,
    ).toHaveBeenCalledWith(routerStub)
  })
})
