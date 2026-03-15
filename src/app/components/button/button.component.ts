import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router'
import { filter, take } from 'rxjs'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() type: string = ''
  @Input() link: string | undefined = ''
  @Input() text: string = ''
  @Input() ariaLabel: string = ''
  @Input() icon: string = ''
  @Input() class: string = ''
  @Input() svgIcon: string | undefined = ''
  @Input() iconClass: string | undefined
  @Input() rounded = false
  @Input() disabled: boolean | null = false
  @Input() isExternalLink: boolean = false

  constructor(private router: Router) {}

  isSecondary = () => this.type === 'secondary'

  isTertiary = () => this.type === 'tertiary'

  buttonType = () => (this.isSecondary() ? 'button' : 'submit')

  isLink = () => this.link !== ''

  isSvgImage = () => this.svgIcon !== ''

  isIcon = () => this.icon !== ''

  hasText = () => this.text !== ''

  goToTop(): void {
    this.scrollToPageTop()

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        this.scrollToPageTop()
      })
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
