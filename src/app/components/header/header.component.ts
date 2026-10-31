import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule, NgClass } from '@angular/common'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { ScrollService } from '../../services/scroll/scroll.service'

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showHeader = false

  constructor(
    private router: Router,
    private scrollService: ScrollService,
  ) {}

  toggleHeader() {
    this.showHeader = !this.showHeader
  }

  navigateAndScrollTop(): void {
    this.showHeader = false
    this.scrollService.scrollToTopAfterNextNavigation(this.router)
  }
}
