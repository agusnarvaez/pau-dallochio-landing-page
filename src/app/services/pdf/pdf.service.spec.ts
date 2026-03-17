import { TestBed } from '@angular/core/testing'
import { Product } from '../../models/product'

import { PdfService } from './pdf.service'

interface DocMock {
  internal: {
    pageSize: {
      getWidth: jasmine.Spy
      getHeight: jasmine.Spy
      height: number
    }
  }
  setFillColor: jasmine.Spy
  rect: jasmine.Spy
  addImage: jasmine.Spy
  setTextColor: jasmine.Spy
  setFont: jasmine.Spy
  setFontSize: jasmine.Spy
  text: jasmine.Spy
  setLineWidth: jasmine.Spy
  setDrawColor: jasmine.Spy
  line: jasmine.Spy
  splitTextToSize: jasmine.Spy
  addPage: jasmine.Spy
  save: jasmine.Spy
}

describe('PDFService', () => {
  let service: PdfService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(PdfService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  const buildProduct = (): Product => {
    const product = new Product()
    product.title = 'Departamento en Belgrano'
    product.price = 125000
    product.currency = 'USD'
    product.address.street = 'Av Cabildo 1234'
    product.address.city = 'CABA'
    product.rooms = 3
    product.coveredArea = 78
    product.bathrooms = 2
    product.garage = 1
    product.cover = 'https://img.test/cover.jpg'
    product.images = [
      'https://img.test/1.jpg',
      'https://img.test/2.jpg',
      'https://img.test/3.jpg',
      'https://img.test/4.jpg',
      'https://img.test/5.jpg',
    ]
    product.pdfDescription = 'Linea 1<br/>Linea 2 &nbsp; &amp;'
    product.operation_type = 'Venta'
    return product
  }

  const createDocMock = (): DocMock => {
    return {
      internal: {
        pageSize: {
          getWidth: jasmine.createSpy('getWidth').and.returnValue(210),
          getHeight: jasmine.createSpy('getHeight').and.returnValue(297),
          height: 297,
        },
      },
      setFillColor: jasmine.createSpy('setFillColor'),
      rect: jasmine.createSpy('rect'),
      addImage: jasmine.createSpy('addImage'),
      setTextColor: jasmine.createSpy('setTextColor'),
      setFont: jasmine.createSpy('setFont'),
      setFontSize: jasmine.createSpy('setFontSize'),
      text: jasmine.createSpy('text'),
      setLineWidth: jasmine.createSpy('setLineWidth'),
      setDrawColor: jasmine.createSpy('setDrawColor'),
      line: jasmine.createSpy('line'),
      splitTextToSize: jasmine
        .createSpy('splitTextToSize')
        .and.callFake((value: string) => [value]),
      addPage: jasmine.createSpy('addPage'),
      save: jasmine.createSpy('save'),
    }
  }

  it('should set background style over the full page', () => {
    const doc = createDocMock()

    service.setBackground(doc as never)

    expect(doc.setFillColor).toHaveBeenCalledWith('#FFFFF0')
    expect(doc.rect).toHaveBeenCalledWith(0, 0, 210, 297, 'F')
  })

  it('should create title and split text to fit width', () => {
    const doc = createDocMock()

    service.createTitle(doc as never, 'Titulo de prueba')

    expect(doc.setTextColor).toHaveBeenCalledWith('#B80E3B')
    expect(doc.setFontSize).toHaveBeenCalledWith(14)
    expect(doc.splitTextToSize).toHaveBeenCalledWith('Titulo de prueba', 190)
    expect(doc.text).toHaveBeenCalled()
  })

  it('should create branded header with contact information', () => {
    const doc = createDocMock()

    service.createHeader(doc as never)

    expect(doc.addImage).toHaveBeenCalled()
    expect(doc.setFont).toHaveBeenCalledWith('helvetica', 'bold')
    expect(doc.text).toHaveBeenCalledWith(
      'Paula Dallochio Estudio Inmobiliario',
      100,
      15,
    )
    expect(doc.line).toHaveBeenCalledWith(10, 50, 200, 50)
  })

  it('should create formatted price text', () => {
    const doc = createDocMock()
    const product = buildProduct()

    service.createPrice(doc as never, product)

    expect(doc.text).toHaveBeenCalledWith('Precio: USD 125.000', 10, 70)
  })

  it('should create location section with address and icon', () => {
    const doc = createDocMock()
    const product = buildProduct()

    service.createLocation(doc as never, product)

    expect(doc.text).toHaveBeenCalledWith('Ubicación', 10, 80)
    expect(doc.addImage).toHaveBeenCalled()
    expect(doc.text).toHaveBeenCalledWith('Av Cabildo 1234, CABA', 15, 88)
  })

  it('should create property details including plural rules', () => {
    const doc = createDocMock()
    const product = buildProduct()

    service.createPropertyDetails(doc as never, product)

    expect(doc.text).toHaveBeenCalledWith('Detalles principales', 10, 100)
    expect(doc.text).toHaveBeenCalledWith('3 ambientes', 15, 108)
    expect(doc.text).toHaveBeenCalledWith('78 m2 cubiertos', 105, 108)
    expect(doc.text).toHaveBeenCalledWith('2 baños', 15, 118)
    expect(doc.text).toHaveBeenCalledWith('1 cochera', 105, 118)
  })

  it('should create property details for no garage and singular bathroom', () => {
    const doc = createDocMock()
    const product = buildProduct()
    product.bathrooms = 1
    product.garage = 0

    service.createPropertyDetails(doc as never, product)

    expect(doc.text).toHaveBeenCalledWith('1 baño', 15, 118)
    expect(doc.text).toHaveBeenCalledWith('Sin cochera', 105, 118)
  })

  it('should add main image in expected position', () => {
    const doc = createDocMock()
    const product = buildProduct()

    service.createMainImage(doc as never, product)

    expect(doc.addImage).toHaveBeenCalledWith(
      'https://img.test/cover.jpg',
      'JPEG',
      10,
      130,
      190,
      90,
    )
  })

  it('should paginate long descriptions when reaching page bottom', () => {
    const doc = createDocMock()
    const product = buildProduct()
    product.pdfDescription = 'Linea 1\nLinea 2\nLinea 3'
    doc.internal.pageSize.height = 235
    doc.splitTextToSize.and.callFake((value: string) => [value, `${value}-2`])

    service.createDescription(doc as never, product)

    expect(doc.addPage).toHaveBeenCalled()
    expect(doc.text).toHaveBeenCalled()
  })

  it('should create gallery and add new page every four images', () => {
    const doc = createDocMock()
    const product = buildProduct()

    service.createGallery(doc as never, product)

    expect(doc.text).toHaveBeenCalledWith('Galería', 10, 60)
    expect(doc.addImage).toHaveBeenCalledTimes(8)
    expect(doc.addPage).toHaveBeenCalledTimes(1)
  })

  it('should decode html entities and convert line breaks', () => {
    const decoded = service.decodeHtmlEntities(
      'A&amp B &lt C &gt D &quot E &#039 F &nbsp;<br/>Z',
    )

    expect(decoded).toContain('&')
    expect(decoded).toContain('<')
    expect(decoded).toContain('>')
    expect(decoded).toContain('"')
    expect(decoded).toContain("'")
    expect(decoded).toContain('\n')
  })
})
