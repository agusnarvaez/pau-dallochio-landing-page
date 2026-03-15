import { Component } from '@angular/core'
import { CommonModule, NgClass } from '@angular/common'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router'
import { filter } from 'rxjs'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showHeader = false
  private shouldScrollAfterNavigation = false

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.shouldScrollAfterNavigation) {
          this.scrollToPageTop()
          this.shouldScrollAfterNavigation = false
        }
      })
  }

  toggleHeader() {
    this.showHeader = !this.showHeader
  }

  navigateAndScrollTop(): void {
    this.showHeader = false
    this.shouldScrollAfterNavigation = true
    this.scrollToPageTop()
  }

  private scrollToPageTop(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })
  }
}
