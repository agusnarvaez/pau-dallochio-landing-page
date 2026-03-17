import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CarrouselComponent } from './carrousel.component'

describe('CarrouselComponent', () => {
  let component: CarrouselComponent
  let fixture: ComponentFixture<CarrouselComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrouselComponent],
    }).compileComponents()

    TestBed.overrideComponent(CarrouselComponent, {
      set: { template: '' },
    })

    fixture = TestBed.createComponent(CarrouselComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should combine videos and images preserving order', () => {
    component.videos = ['https://youtube.com/watch?v=abc']
    component.images = ['https://img.com/1.jpg', 'https://img.com/2.jpg']

    expect(component.allMedia()).toEqual([
      'https://youtube.com/watch?v=abc',
      'https://img.com/1.jpg',
      'https://img.com/2.jpg',
    ])
  })

  it('should detect video urls and extract youtube ids', () => {
    expect(component.isVideo('https://youtube.com/watch?v=abc123')).toBeTrue()
    expect(component.isVideo('https://youtu.be/xyz456')).toBeTrue()
    expect(component.isVideo('https://img.com/1.jpg')).toBeFalse()

    expect(
      component.getYoutubeVideoId('https://youtube.com/watch?v=abc123'),
    ).toBe('abc123')
    expect(component.getYoutubeVideoId('https://youtu.be/xyz456')).toBe(
      'xyz456',
    )
    expect(component.getYoutubeVideoId('https://img.com/1.jpg')).toBe('')
  })

  it('should update carousel metrics for desktop breakpoint', () => {
    component.images = ['1', '2']
    component.videos = ['v1']

    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1024)
    component.updateCarouselMetrics()
    expect(component.carouselContainerHeight).toBe('150%')
    expect(component.carouselContainerWidth).toBe('30%')
    expect(component.carouselItemHeight).toBe('33.333333333333336%')
    expect(component.carouselItemWidth).toBe('100%')
  })

  it('should update carousel metrics for mobile breakpoint', () => {
    component.images = ['1', '2']
    component.videos = ['v1']

    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(375)
    component.updateCarouselMetrics()
    expect(component.carouselContainerWidth).toBe('300%')
    expect(component.carouselContainerHeight).toBe('100%')
    expect(component.carouselItemWidth).toBe('33.333333333333336%')
    expect(component.carouselItemHeight).toBe('100%')
  })

  it('should provide media labels according to media type', () => {
    expect(
      component.mediaLabel('https://youtube.com/watch?v=abc', 0),
    ).toContain('Video 1')
    expect(component.mediaLabel('https://kuula.co/share/abc', 1)).toContain(
      'Tour virtual 360 2',
    )
    expect(component.mediaLabel('https://img.com/1.jpg', 2)).toContain(
      'Imagen 3',
    )
  })

  it('should manage image selection and keyboard selection', () => {
    component.images = ['1', '2', '3']

    component.selectImage(2)
    expect(component.imageIndex).toBe(2)
    expect(component.isImageSelected(2)).toBeTrue()
    expect(component.actualImage()).toBe('3')

    const preventDefaultSpy = jasmine.createSpy('preventDefault')
    component.onThumbnailKeydown(
      {
        key: 'Enter',
        preventDefault: preventDefaultSpy,
      } as unknown as KeyboardEvent,
      1,
    )
    expect(component.imageIndex).toBe(1)
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should navigate next and previous media with wrap-around', () => {
    component.images = ['1', '2']
    component.videos = ['v1']
    component.imageIndex = 2

    component.nextImage()
    expect(component.imageIndex).toBe(0)

    component.prevImage()
    expect(component.imageIndex).toBe(2)
  })

  it('should compute transform style for desktop', () => {
    component.images = ['1', '2']
    component.imageIndex = 1

    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(900)
    expect(component.transformStyle()).toBe('translateY(-50%)')
  })

  it('should compute transform style for mobile', () => {
    component.images = ['1', '2']
    component.imageIndex = 1

    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(390)
    expect(component.transformStyle()).toBe('translateX(-50%)')
  })

  it('should expose helpers for empty media and default size', () => {
    component.images = []
    component.videos = []

    expect(component.noImages()).toBeTrue()
    expect(component.imagesSize()).toBe(1)
    expect(component.actualMediaLabel()).toContain('Imagen 1')
  })

  it('should sanitize youtube embed urls', () => {
    const sanitizerSpy = spyOn(
      (
        component as unknown as {
          sanitizer: {
            bypassSecurityTrustResourceUrl: (value: string) => unknown
          }
        }
      ).sanitizer,
      'bypassSecurityTrustResourceUrl',
    ).and.callThrough()

    component.getSafeYoutubeUrl('abc123')

    expect(sanitizerSpy).toHaveBeenCalledWith(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('should react to lifecycle hooks', () => {
    const resizeSpy = spyOn(component, 'onResize')
    const detectChangesSpy = spyOn(
      (component as unknown as { cdr: { detectChanges: () => void } }).cdr,
      'detectChanges',
    )

    component.ngOnChanges({ images: { currentValue: ['a'] } as never })
    expect(resizeSpy).toHaveBeenCalled()
    expect(detectChangesSpy).toHaveBeenCalled()

    resizeSpy.calls.reset()
    component.ngOnInit()
    expect(resizeSpy).toHaveBeenCalled()
  })
})
