import { FormsModule, NgForm } from '@angular/forms'
import { Component, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../components/button/button.component'


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,FormsModule,ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})


export class ContactComponent {
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
