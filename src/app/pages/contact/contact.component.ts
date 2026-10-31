import { FormsModule } from '@angular/forms'
import { Component } from '@angular/core'

import { ButtonComponent } from '../../components/button/button.component'
import { ContactFormComponent } from '../../sections/contact/contact-form/contact-form.component'

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ButtonComponent, ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
