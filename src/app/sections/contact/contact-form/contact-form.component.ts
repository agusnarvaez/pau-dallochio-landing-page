import { Component, DestroyRef, Input, ViewChild, inject } from '@angular/core'

import { FormsModule, NgForm } from '@angular/forms'
import { ButtonComponent } from '../../../components/button/button.component'
import { EmailService } from '../../../services/email/email.service'
import { Mail } from '../../../models/mail'
import { Product } from '../../../models/product'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ToastService } from '../../../services/toast/toast.service'

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule, ButtonComponent],
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

    const product = this.product
    const mail: Mail = {
      site: 'pauladallochio',
      subject: this.subject,
      name: this.fullName,
      email: this.email,
      phone: this.phone,
      message: this.message,
      ...(product && {
        fields: [
          { label: 'Propiedad consultada', value: product.title },
          {
            label: 'Operación',
            value: `${product.operation_type} - ${product.address.street}, ${product.address.city}`,
          },
          {
            label: 'Precio',
            value: `${product.currency} ${product.price.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
          },
        ],
        link: `/catalogo/${encodeURIComponent(String(product.id))}`,
      }),
    }

    // mailing-api arma y manda el aviso a Paula y la confirmación al visitante.
    this.sendMail(mail)
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
