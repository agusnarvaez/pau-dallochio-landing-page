import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PurposeComponent } from '../../sections/how-we-work/purpose/purpose.component'
import { SalesComponent } from '../../sections/how-we-work/sales/sales.component'
import { AdviceComponent } from '../../sections/how-we-work/advice/advice.component'

@Component({
  selector: 'app-how-we-work',
  standalone: true,
  imports: [CommonModule,PurposeComponent,SalesComponent,AdviceComponent],
  templateUrl: './how-we-work.component.html',
  styleUrl: './how-we-work.component.css'
})
export class HowWeWorkComponent {

}
