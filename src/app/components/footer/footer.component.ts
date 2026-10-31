import { Component } from '@angular/core'

import { Router, RouterLink } from '@angular/router'
import { ScrollService } from '../../services/scroll/scroll.service'

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  constructor(
    private router: Router,
    private scrollService: ScrollService,
  ) {}

  goToTopAfterNavigation(): void {
    this.scrollService.scrollToTopAfterNextNavigation(this.router)
  }
}
