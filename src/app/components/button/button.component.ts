import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterModule } from '@angular/router'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() type: string = ''
  @Input() link: string = ''
  @Input() text: string = ''
  @Input() icon: string = ''
  @Input() class: string = ''
  isSecondary = ()=> this.type === 'secondary'

  isTertiary = ()=> this.type === 'tertiary'

  buttonType = () => this.isSecondary() ? 'button' : 'submit'

  isLink = () => this.link !== ''
}
