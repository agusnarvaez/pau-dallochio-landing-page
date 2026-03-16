import { Component } from '@angular/core'
import { CommonModule, NgClass } from '@angular/common'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { ScrollService } from '../../services/scroll/scroll.service'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
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
