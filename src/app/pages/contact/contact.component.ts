import { FormsModule } from '@angular/forms'
import { Component, ChangeDetectionStrategy } from '@angular/core'

import { ButtonComponent } from '../../components/button/button.component'
import { ContactFormComponent } from '../../sections/contact/contact-form/contact-form.component'

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ButtonComponent, ContactFormComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
