import { TestBed } from '@angular/core/testing'
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing'

import { EmailService } from './email.service'
import { environment } from '../../../environments/environment'
import { Mail } from '../../models/mail'
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http'

describe('EmailService', () => {
  let service: EmailService
  let httpMock: HttpTestingController

  const mockMail: Mail = {
    site: 'pauladallochio',
    subject: 'Consulta por propiedad',
    email: 'juan@example.com',
    message: 'Hola! Quisiera mas informacion.',
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    })
    service = TestBed.inject(EmailService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should send email and return api response', () => {
    const mockResponse = { ok: true, id: 'mail_1' }

    service.sendEmail(mockMail).subscribe((response) => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${environment.mail_api_prod}/mail/form`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(mockMail)

    req.flush(mockResponse)
  })

  it('should map http error to a readable error', () => {
    service.sendEmail(mockMail).subscribe({
      next: () => fail('expected error, but got success response'),
      error: (error: Error) => {
        expect(error).toBeTruthy()
        expect(error.message).toContain('Http failure response')
      },
    })

    const req = httpMock.expectOne(`${environment.mail_api_prod}/mail/form`)
    req.flush(
      { message: 'error interno' },
      { status: 500, statusText: 'Server Error' },
    )
  })
})
