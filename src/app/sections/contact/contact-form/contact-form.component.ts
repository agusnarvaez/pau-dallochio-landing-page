import { Component, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, NgForm } from '@angular/forms'
import { ButtonComponent } from '../../../components/button/button.component'

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule,FormsModule,ButtonComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  @ViewChild('myForm') myForm!: NgForm
  message: string = ''
  fullName: string = ''
  email: string = ''
  phone: string = ''
  subject: string = ''

  onSubmit() {
    console.log(this.myForm.value)
    /* this.message = 'Mensaje enviado' */
    /* this.myForm.reset() */
  }
}
