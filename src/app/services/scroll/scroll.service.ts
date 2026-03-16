import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { filter, take } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  scrollToTop(): void {
    this.scrollWindowToTop()

    requestAnimationFrame(() => {
      this.scrollWindowToTop()
    })
  }

  scrollToTopAfterNextNavigation(router: Router): void {
    this.scrollToTop()

    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        this.scrollToTop()
      })
  }

  private scrollWindowToTop(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    this.document.documentElement.scrollTop = 0
    this.document.body.scrollTop = 0
  }
}
