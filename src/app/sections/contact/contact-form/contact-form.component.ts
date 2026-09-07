import { Component, DestroyRef, Input, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, NgForm } from '@angular/forms'
import { ButtonComponent } from '../../../components/button/button.component'
import { EmailService } from '../../../services/email/email.service'
import { Mail } from '../../../models/mail'
import { Product } from '../../../models/product'
import { forkJoin } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ToastService } from '../../../services/toast/toast.service'

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent {
  @ViewChild('myForm') myForm!: NgForm
  message: string = ''
  fullName: string = ''
  email: string = ''
  phone: string = ''
  isSubmitting = false
  private destroyRef = inject(DestroyRef)

  @Input() subject: string = ''
  @Input() product: Product | undefined
  showSubject = true
  constructor(
    public emailService: EmailService,
    private toastService: ToastService,
  ) {}
  ngOnInit() {
    if (this.subject !== '') {
      this.showSubject = false
    }
  }

  sendMail = (mailToSend: Mail) => this.emailService.sendEmail(mailToSend)

  onSubmit() {
    if (this.isSubmitting || this.myForm?.invalid) {
      return
    }

    this.isSubmitting = true

    const propertyBlock = this.product
      ? `
      <div style="padding: 0 5%; margin-top: 10px; border-top: 1px solid #9D9480;">
        <h2 style="font-size: 12px; color: #9D9480;">Propiedad consultada</h2>
        <p style="font-size: 12px; color: #9D9480;"><strong>${this.product.title}</strong></p>
        <p style="font-size: 12px; color: #9D9480;">${this.product.operation_type} - ${this.product.address.street}, ${this.product.address.city}</p>
        <p style="font-size: 12px; color: #9D9480;">${this.product.currency} ${this.product.price.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</p>
        <p style="font-size: 12px; color: #9D9480;"><a href="https://www.pauladallochio.com.ar/catalogo/${this.product.id}" style="color: #9D9480;">Ver publicación</a></p>
      </div>
      `
      : ''
    const propertySubjectTag = this.product ? ` [${this.product.title}]` : ''

    const notification = new Mail(
      'info@pauladallochio.com.ar',
      /* 'agus.narvaez@outlook.com', */
      'no_reply@pauladallochio.com.ar',
      `Nuevo mensaje de ${this.fullName} - ${this.subject}${propertySubjectTag}`,
      this.message,
      `
      <body style="width:100%; height: 100%; background-color: #FFFFF0; font-size: 10px; padding: 5% 0;">
        <h1 style="padding: 0 5%; font-size: 15px; color: #9D9480">Hola Paula! - Tienes un nuevo mensaje de ${this.fullName}</h1>
        <h2 style="padding: 0 5%;  font-size: 12px; color: #9D9480">${this.subject}</h2>
        <p style="padding: 0 5%; font-size: 12px; color: #9D9480">${this.message}</p>
        <p style="padding: 0 5%; font-size: 12px; color: #9D9480">${this.email}</p>
        <p style="padding: 0 5%; font-size: 12px; color: #9D9480">${this.phone}</p>
        ${propertyBlock}
        <div style="background-color: #FFFFF0; text-align: center; padding: 10px;">
          <img src="https://pauladallochio.com.ar/assets/logos/logo-header.png" alt="Logo Paula Dallochio" style="width: 100px; height: auto;" />
        </div>
      </body>
      `,
    )
    notification.cc = 'agus.narvaez@outlook.com'

    const mailToSend = new Mail(
      this.email,
      'no_reply@pauladallochio.com.ar',
      `Solicitud de información - ${this.subject}`,
      'Gracias por contactarte con nosotros, en breve nos pondremos en contacto con vos.',
      `
      <body style="width:100%; height: 100%; background-color: #FFFFF0; font-size: 10px; padding: 5% 0;">
        <h1 style="padding: 0 5%; font-size: 15px; color: #9D9480" >Hola ${this.fullName}! - Gracias por contactarte con nosotros</h1>
        <h2 style="padding: 0 5%; font-size: 12px; color: #9D9480" >Tu consulta sobre ${this.subject} ya fue enviada</h2>
        <p style="padding: 0 5%; font-size: 12px; color: #9D9480" >Te estaremos contestando a la brevedad</p>
        <div style="background-color: #FFFFFF0; text-align: center; padding: 10px;">
          <img src="https://pauladallochio.com.ar/assets/logos/logo-header.png" alt="Logo Paula Dallochio" style="width: 100px; height: auto;" />
        </div>
      </body>
      `,
    )

    forkJoin([this.sendMail(notification), this.sendMail(mailToSend)])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.myForm.reset()
          this.isSubmitting = false
          this.toastService.show(
            'Mensaje enviado correctamente. Te responderemos a la brevedad.',
            'success',
            4000,
          )
        },
        error: () => {
          this.isSubmitting = false
          this.toastService.show(
            'No pudimos enviar tu mensaje. Intenta nuevamente en unos minutos.',
            'error',
          )
        },
      })
  }
}
