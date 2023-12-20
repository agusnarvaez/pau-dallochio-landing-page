import { FormsModule,  } from '@angular/forms'
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../components/button/button.component'
import { ContactFormComponent } from '../../sections/contact/contact-form/contact-form.component'


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,FormsModule,ButtonComponent,ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})


export class ContactComponent {

}
