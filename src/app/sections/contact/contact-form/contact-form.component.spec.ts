import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NgForm } from '@angular/forms'
import { of, throwError } from 'rxjs'

import { ContactFormComponent } from './contact-form.component'
import { EmailService } from '../../../services/email/email.service'
import { ToastService } from '../../../services/toast/toast.service'
import { Mail } from '../../../models/mail'

describe('ContactFormComponent', () => {
  let component: ContactFormComponent
  let fixture: ComponentFixture<ContactFormComponent>
  let emailServiceSpy: jasmine.SpyObj<EmailService>
  let toastServiceSpy: jasmine.SpyObj<ToastService>
  let formSpy: jasmine.SpyObj<NgForm>

  beforeEach(async () => {
    emailServiceSpy = jasmine.createSpyObj<EmailService>('EmailService', [
      'sendEmail',
    ])
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', [
      'show',
    ])
    formSpy = jasmine.createSpyObj<NgForm>('NgForm', ['reset'])

    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        { provide: EmailService, useValue: emailServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ContactFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    component.myForm = formSpy
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should hide subject input when subject is pre-filled', () => {
    component.subject = 'Comprar este inmueble'

    component.ngOnInit()

    expect(component.showSubject).toBeFalse()
  })

  it('should delegate sendMail to EmailService', () => {
    const mail: Mail = { site: 'pauladallochio', subject: 'subject', message: 'msg' }
    const mockResponse = { ok: true }
    emailServiceSpy.sendEmail.and.returnValue(of(mockResponse))

    component.sendMail(mail).subscribe((response) => {
      expect(response).toEqual(mockResponse)
    })

    expect(emailServiceSpy.sendEmail).toHaveBeenCalledWith(mail)
  })

  it('should send the form data to mailing-api, reset form and show success toast', () => {
    component.fullName = 'Juan Perez'
    component.email = 'juan@example.com'
    component.phone = '1112345678'
    component.subject = 'Consulta'
    component.message = 'Hola! Quisiera mas informacion.'

    emailServiceSpy.sendEmail.and.returnValue(of({ ok: true }))

    component.onSubmit()

    expect(component.isSubmitting).toBeFalse()
    expect(emailServiceSpy.sendEmail).toHaveBeenCalledOnceWith({
      site: 'pauladallochio',
      subject: 'Consulta',
      name: 'Juan Perez',
      email: 'juan@example.com',
      phone: '1112345678',
      message: 'Hola! Quisiera mas informacion.',
    })

    expect(formSpy.reset).toHaveBeenCalled()
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'Mensaje enviado correctamente. Te responderemos a la brevedad.',
      'success',
      4000,
    )
  })

  it('should stop submitting and show error toast when send fails', () => {
    component.fullName = 'Juan Perez'
    component.email = 'juan@example.com'
    component.phone = '1112345678'
    component.subject = 'Consulta'
    component.message = 'Hola! Quisiera mas informacion.'

    emailServiceSpy.sendEmail.and.returnValue(
      throwError(() => new Error('mail service error')),
    )

    component.onSubmit()

    expect(component.isSubmitting).toBeFalse()
    expect(formSpy.reset).not.toHaveBeenCalled()
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'No pudimos enviar tu mensaje. Intenta nuevamente en unos minutos.',
      'error',
    )
  })
})
