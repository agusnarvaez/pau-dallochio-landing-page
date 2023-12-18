import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../components/button/button.component'

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent {

}
