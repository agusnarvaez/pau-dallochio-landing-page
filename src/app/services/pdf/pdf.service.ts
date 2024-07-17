import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { jsPDF } from 'jspdf'

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private http: HttpClient) {}

  generatePropertyPdf() {
    console.log('generating pdf')
    const doc = new jsPDF()

    doc.text(
      'Hola Paula! Estuve revisando tu web y me pareció importante contactarte para realizarte una consulta.',
      10,
      10,
    )
    doc.save('consulta.pdf')
  }
}
