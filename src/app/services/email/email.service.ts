import { Injectable } from '@angular/core'
import { Observable, catchError, map, throwError } from 'rxjs'
import { enviroment } from '../../../../enviroment.prod'
import { HttpClient } from '@angular/common/http'
import { Mail } from '../../models/mail'

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  mail = {
    from: "no_reply@bapps.com.ar",
    to: "agus.narvaez@outlook.com",
    subject: "Example Subject",
    message: "This is the body of the email.",
    html:"<h1>This is the body of the email</h1><h2>This is the subtitle of the email</h2>"
  }
  constructor(
    private http: HttpClient
  ) { }

  sendEmail(mail:Mail):Observable<any> {
    console.log('Email sending')
    return this.http.post<any>(
      `${enviroment.mail_api_prod}/mail/send`,
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
