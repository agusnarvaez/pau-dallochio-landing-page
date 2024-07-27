import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { jsPDF } from 'jspdf'
import { Product } from '../../models/product'
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private http: HttpClient) {}

  generatePropertyPdf(product: Product) {
    console.log('generating pdf', product)
    const doc = new jsPDF('p', 'mm', 'a4')
    // Background styling
    this.setBackground(doc)

    // Header
    this.createHeader(doc)

    // Property Title
    this.createTitle(doc, product.title)

    // Property value
    this.createPrice(doc, product)

    // Property location
    this.createLocation(doc, product)

    // Property details
    this.createPropertyDetails(doc, product)

    // Main Image
    this.createMainImage(doc, product)

    // Description
    this.createDescription(doc, product)

    // Add new page for gallery
    doc.addPage()
    doc.setFillColor('#FFFFF0')
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      'F',
    )
    this.createHeader(doc) // Re-add header for the new page
    this.createGallery(doc, product)

    doc.save(
      `Brochure ${product.operation_type} ${product.address.street} ${product.address.city}.pdf`,
    )
  }

  setBackground(doc: jsPDF) {
    doc.setFillColor('#FFFFF0')
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      'F',
    )
  }

  createTitle(doc: jsPDF, text: string) {
    doc.setTextColor('#B80E3B')
    doc.setFontSize(14)
    const title = text
    const titleX = 10
    const titleY = 60
    const titleWidth = 190 // Width of the text area
    const splitTitle = doc.splitTextToSize(title, titleWidth)
    doc.text(splitTitle, titleX, titleY)
  }

  createHeader(doc: jsPDF) {
    doc.addImage('../../../assets/logos/logo-header.png', 'PNG', 10, 10, 50, 25)

    // Header Styling
    doc.setTextColor('#B80E3B') // Color del texto en negro
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Paula Dallochio Estudio Inmobiliario', 100, 15)

    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text('MAT. CUCICBA 9040', 100, 20)
    doc.addImage('../../../assets/icons/phone-icon.png', 'PNG', 100, 27, 4, 4)
    doc.text('+54911-4085-6083', 106, 30)
    doc.addImage('../../../assets/icons/mail-icon.png', 'PNG', 100, 37, 4, 4)
    doc.text('estudioinmobiliario@pauladallochio.com.ar', 106, 40)

    // Draw line
    doc.setLineWidth(0.5)
    doc.setDrawColor('#B80E3B')
    doc.line(10, 50, 200, 50)
  }

  createPrice(doc: jsPDF, product: Product) {
    function formatNumber(num: number): string {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(
      `Precio: ${product.currency} ${formatNumber(product.price)}`,
      10,
      70,
    )
    doc.setFont('helvetica', 'normal')
  }

  createLocation(doc: jsPDF, product: Product) {
    const detailX = 10
    let detailY = 80

    // Location
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Ubicación', detailX, detailY)
    doc.setLineWidth(0.3)
    doc.setDrawColor('#B80E3B')
    doc.line(detailX, detailY + 1, 200, detailY + 1)

    detailY += 5
    doc.addImage(
      '../../../assets/icons/location-icon.png',
      'PNG',
      detailX,
      detailY,
      4,
      4,
    )
    doc.text(
      `${product.address.street}, ${product.address.city}`,
      detailX + 5,
      detailY + 3,
    )
  }

  createPropertyDetails(doc: jsPDF, product: Product) {
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    const detailX = 10
    let detailY = 100
    const midX = 100

    // Title "Detalles principales"
    doc.setFont('helvetica', 'normal')
    doc.text('Detalles principales', detailX, detailY)
    doc.setLineWidth(0.3)
    doc.setDrawColor('#B80E3B')
    doc.line(detailX, detailY + 1, 200, detailY + 1)

    detailY += 5
    // Rooms
    doc.addImage(
      '../../../assets/icons/home-spaces-icon.png',
      'PNG',
      detailX,
      detailY,
      4,
      4,
    )
    doc.text(`${product.rooms} ambientes`, detailX + 5, detailY + 3)

    // Area
    /* detailY += 10 */
    doc.addImage(
      '../../../assets/icons/area-icon.png',
      'PNG',
      midX,
      detailY,
      4,
      4,
    )
    doc.text(`${product.coveredArea} m2 cubiertos`, midX + 5, detailY + 3)

    // Bathrooms
    detailY += 10
    doc.addImage(
      '../../../assets/icons/bath-icon.png',
      'PNG',
      detailX,
      detailY,
      4,
      4,
    )
    doc.text(
      `${product.bathrooms} baño${product.bathrooms > 1 ? 's' : ''}`,
      detailX + 5,
      detailY + 3,
    )

    // Garage
    doc.addImage(
      '../../../assets/icons/parking-icon.png',
      'PNG',
      midX,
      detailY,
      4,
      4,
    )
    doc.text(
      `${product.garage ? product.garage : 'Sin'} cochera${
        product.garage > 1 ? 's' : ''
      }`,
      midX + 5,
      detailY + 3,
    )
  }

  createMainImage(doc: jsPDF, product: Product) {
    const imageUrl = product.cover
    doc.addImage(imageUrl, 'JPEG', 10, 130, 190, 90) // Adjust dimensions as necessary
  }

  createDescription(doc: jsPDF, product: Product) {
    let y = 230
    const description = this.decodeHtmlEntities(product.pdfDescription)

    // Dividir el texto por saltos de línea
    const paragraphs = description.split('\n')

    paragraphs.forEach((paragraph: string) => {
      if (paragraph.trim().length === 0) return // Saltar líneas vacías

      const splitDesc = doc.splitTextToSize(paragraph, 180)
      splitDesc.forEach((line: string) => {
        if (y + 10 > doc.internal.pageSize.height - 10) {
          doc.addPage()
          this.setBackground(doc)
          this.createHeader(doc)
          y = 60 // Ajuste para la nueva página
        }
        doc.text(line, 10, y)
        y += 7
      })
    })
  }

  createGallery(doc: jsPDF, product: Product) {
    let galleryY = 60 // Posición inicial de la primera página de la galería
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor('#B80E3B')
    doc.text('Galería', 10, galleryY)
    doc.setLineWidth(0.3)
    doc.setDrawColor('#B80E3B')
    doc.line(10, galleryY + 1, 200, galleryY + 1)

    galleryY += 10
    const images = product.images
    images.forEach((image, index) => {
      if (index > 0 && index % 4 === 0) {
        doc.addPage()
        this.setBackground(doc)
        this.createHeader(doc)
        galleryY = 70 - 105 // Reinicia la posición de la galería para la nueva página
      }
      const posX = index % 2 === 0 ? 10 : 110
      if (index % 2 === 0 && index !== 0) galleryY += 105

      doc.addImage(image, 'JPEG', posX, galleryY, 90, 100)
    })
  }

  decodeHtmlEntities(str: string): string {
    return str
      .replace(/&amp/g, '&')
      .replace(/&;/, '&')
      .replace(/&lt/g, '<')
      .replace(/&gt/g, '>')
      .replace(/&quot/g, '"')
      .replace(/&#039/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
  }
}
