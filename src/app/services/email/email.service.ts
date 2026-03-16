import { Injectable } from '@angular/core'
import { Observable, catchError, throwError } from 'rxjs'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Mail } from '../../models/mail'

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(mail: Mail): Observable<unknown> {
    return this.http
      .post<unknown>(`${environment.mail_api_prod}/mail/send`, mail)
      .pipe(
        catchError((error: { message?: string }) => {
          return throwError(
            () => new Error(error.message ?? 'No se pudo enviar el email'),
          )
        }),
      )
  }
}
