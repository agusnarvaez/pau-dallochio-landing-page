import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { ScrollService } from '../../services/scroll/scroll.service'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
