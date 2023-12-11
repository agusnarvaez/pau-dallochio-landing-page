import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'

@Component({
  selector: 'app-home-contact',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './home-contact.component.html',
  styleUrl: './home-contact.component.css'
})
export class HomeContactComponent {

}
