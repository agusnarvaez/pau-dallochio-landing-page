import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../components/button/button.component'

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
