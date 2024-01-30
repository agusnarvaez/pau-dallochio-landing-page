import { Injectable } from '@angular/core'
import { Observable, catchError, map, throwError } from 'rxjs'
import { environment } from '../../../../enviroment.prod'
import { HttpClient } from '@angular/common/http'
import { Mail } from '../../models/mail'

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient
  ) { }

  sendEmail(mail:Mail):Observable<any> {
    console.log('Email sending')
    return this.http.post<any>(
      `${environment.mail_api_prod}/mail/send`,
      mail
      )
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.message))
        }),
        map((response) => {
          return response
        }
      ))
  }

}
