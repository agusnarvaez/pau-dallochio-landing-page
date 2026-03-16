import { DOCUMENT } from '@angular/common'
import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { NavigationEnd, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { ScrollService } from './scroll.service'

describe('ScrollService', () => {
  let service: ScrollService
  let documentRef: Document

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ScrollService)
    documentRef = TestBed.inject(DOCUMENT)
  })

  it('should scroll to top immediately and on animation frame', () => {
    const scrollSpy = spyOn(window, 'scrollTo')
    const rafSpy = spyOn(window, 'requestAnimationFrame').and.callFake(
      (callback: FrameRequestCallback) => {
        callback(0)
        return 1
      },
    )

    documentRef.documentElement.scrollTop = 120
    documentRef.body.scrollTop = 80

    service.scrollToTop()

    expect(rafSpy).toHaveBeenCalled()
    expect(scrollSpy).toHaveBeenCalledTimes(2)
    expect(documentRef.documentElement.scrollTop).toBe(0)
    expect(documentRef.body.scrollTop).toBe(0)
  })

  it('should scroll now and once again after next navigation', fakeAsync(() => {
    const routerEvents$ = new Subject<unknown>()
    const routerStub = {
      events: routerEvents$.asObservable(),
    } as Router

    const scrollSpy = spyOn(window, 'scrollTo')
    spyOn(window, 'requestAnimationFrame').and.callFake(
      (callback: FrameRequestCallback) => {
        callback(0)
        return 1
      },
    )

    service.scrollToTopAfterNextNavigation(routerStub)

    routerEvents$.next(new NavigationEnd(1, '/catalogo', '/catalogo'))
    routerEvents$.next(new NavigationEnd(2, '/contacto', '/contacto'))
    tick()

    expect(scrollSpy.calls.count()).toBe(4)
  }))
})
