import { Component } from '@angular/core'
import { CommonModule, NgClass } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showHeader = false

  constructor() { }

  toggleHeader() { this.showHeader = !this.showHeader }
}
