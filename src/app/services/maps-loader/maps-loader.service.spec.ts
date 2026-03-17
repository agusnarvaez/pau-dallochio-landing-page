import { TestBed } from '@angular/core/testing'

import { MapsLoaderService } from './maps-loader.service'

describe('MapsLoaderService', () => {
  let service: MapsLoaderService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(MapsLoaderService)

    delete (window as Window & { google?: unknown }).google
    document
      .querySelectorAll('script[data-maps-sdk="true"]')
      .forEach((script) => script.remove())
  })

  it('should resolve immediately when Google Maps is already available', async () => {
    ;(window as Window & { google?: unknown }).google = {
      maps: {
        Map: () => ({}),
      },
    }

    await expectAsync(service.load()).toBeResolved()
    expect(document.querySelector('script[data-maps-sdk="true"]')).toBeNull()
  })

  it('should resolve immediately when importLibrary is available', async () => {
    ;(window as Window & { google?: unknown }).google = {
      maps: {
        importLibrary: async () => undefined,
      },
    }

    await expectAsync(service.load()).toBeResolved()
    expect(document.querySelector('script[data-maps-sdk="true"]')).toBeNull()
  })

  it('should append script and resolve after load when api becomes available', async () => {
    const loadPromise = service.load()

    const script = document.querySelector(
      'script[data-maps-sdk="true"]',
    ) as HTMLScriptElement

    expect(script).toBeTruthy()
    ;(window as Window & { google?: unknown }).google = {
      maps: {
        Map: () => ({}),
      },
    }

    script.dispatchEvent(new Event('load'))

    await expectAsync(loadPromise).toBeResolved()
  })

  it('should return the same promise while loading', async () => {
    const firstLoad = service.load()
    const secondLoad = service.load()

    expect(firstLoad).toBe(secondLoad)
    expect(
      document.querySelectorAll('script[data-maps-sdk="true"]').length,
    ).toBe(1)
    ;(window as Window & { google?: unknown }).google = {
      maps: {
        Map: () => ({}),
      },
    }

    const script = document.querySelector(
      'script[data-maps-sdk="true"]',
    ) as HTMLScriptElement
    script.dispatchEvent(new Event('load'))

    await expectAsync(firstLoad).toBeResolved()
  })

  it('should reject when script fails to load', async () => {
    const loadPromise = service.load()

    const script = document.querySelector(
      'script[data-maps-sdk="true"]',
    ) as HTMLScriptElement
    script.dispatchEvent(new Event('error'))

    await expectAsync(loadPromise).toBeRejectedWithError(
      'No se pudo cargar Google Maps JS',
    )
  })

  it('should reuse an existing loaded script and resolve when api is ready', async () => {
    const existingScript = document.createElement('script')
    existingScript.setAttribute('data-maps-sdk', 'true')
    existingScript.setAttribute('data-loaded', '1')
    document.head.appendChild(existingScript)
    ;(window as Window & { google?: unknown }).google = {
      maps: {
        Map: () => ({}),
      },
    }

    await expectAsync(service.load()).toBeResolved()
  })

  it('should reject when existing loaded script has no usable maps api', async () => {
    Object.defineProperty(service as object, 'readinessTimeoutMs', {
      value: 0,
      configurable: true,
    })

    const existingScript = document.createElement('script')
    existingScript.setAttribute('data-maps-sdk', 'true')
    existingScript.setAttribute('data-loaded', '1')
    document.head.appendChild(existingScript)

    await expectAsync(service.load()).toBeRejectedWithError(
      'Google Maps JS cargo sin API usable',
    )
  })
})
