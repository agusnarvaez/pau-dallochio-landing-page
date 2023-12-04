import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-home-introduction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-introduction.component.html',
  styleUrl: './home-introduction.component.css'
})
export class HomeIntroductionComponent {
  show = false

  toggleShow() { this.show = !this.show }
}
