import { TestBed } from '@angular/core/testing'

import { PdfService } from './pdf.service'

describe('PDFService', () => {
  let service: PdfService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(PdfService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
