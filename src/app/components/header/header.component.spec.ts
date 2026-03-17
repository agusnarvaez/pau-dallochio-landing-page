import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { ScrollService } from '../../services/scroll/scroll.service'

import { HeaderComponent } from './header.component'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>
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
      imports: [HeaderComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ScrollService, useValue: scrollServiceSpy },
      ],
    }).compileComponents()

    TestBed.overrideComponent(HeaderComponent, {
      set: { template: '' },
    })

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should toggle showHeader', () => {
    const initialShowHeader = component.showHeader
    component.toggleHeader()
    expect(component.showHeader).toBe(!initialShowHeader)
  })

  it('should close menu and delegate scroll behavior on navigation', () => {
    component.showHeader = true

    component.navigateAndScrollTop()

    expect(component.showHeader).toBeFalse()
    expect(
      scrollServiceSpy.scrollToTopAfterNextNavigation,
    ).toHaveBeenCalledWith(routerStub)
  })
})
