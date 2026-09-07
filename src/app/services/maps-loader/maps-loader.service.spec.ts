import { TestBed } from '@angular/core/testing'
import { MapsLoaderService } from './maps-loader.service'

type MapsWindow = Window & {
  __karma__?: unknown
  google?: {
    maps?: {
      importLibrary?: unknown
      Map?: unknown
    }
  }
}

describe('MapsLoaderService', () => {
  let service: MapsLoaderService
  let win: MapsWindow

  beforeEach(() => {
    // Estos tests apagan el guard de __karma__ a proposito, asi que el
    // servicio inyecta un <script> real apuntando a maps.googleapis.com.
    // Con la key placeholder de environment.ts Google devuelve un payload
    // que tira InvalidKeyMapError de forma asincrona; al ser cross-origin
    // el browser lo enmascara como "Script error." y llega despues de que
    // termino la suite, volteando Karma en CI. Lo dejamos entrar al DOM sin
    // src: no hay descarga ni ejecucion, y las aserciones de querySelector
    // sobre el elemento siguen valiendo.
    const appendToHead = Node.prototype.appendChild.bind(document.head)
    spyOn(document.head, 'appendChild').and.callFake(((node: Node) => {
      if (node instanceof HTMLScriptElement) {
        node.removeAttribute('src')
      }
      return appendToHead(node)
    }) as typeof document.head.appendChild)

    TestBed.configureTestingModule({})
    service = TestBed.inject(MapsLoaderService)
    win = window as MapsWindow

    win.__karma__ = undefined
    delete win.google
    document
      .querySelectorAll('script[data-maps-sdk="true"]')
      .forEach((script) => script.remove())
  })

  afterEach(() => {
    win.__karma__ = undefined
    delete win.google
    document
      .querySelectorAll('script[data-maps-sdk="true"]')
      .forEach((script) => script.remove())
  })

  it('should resolve immediately in karma environment', async () => {
    win.__karma__ = {}
    await expectAsync(service.load()).toBeResolved()
    expect(document.querySelector('script[data-maps-sdk="true"]')).toBeNull()
  })

  it('should resolve immediately when Google Maps is already available', async () => {
    win.google = {
      maps: {
        Map: () => ({}),
      },
    }

    await expectAsync(service.load()).toBeResolved()
    expect(document.querySelector('script[data-maps-sdk="true"]')).toBeNull()
  })

  it('should resolve immediately when importLibrary is available', async () => {
    win.google = {
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
    win.google = {
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

    win.google = {
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

    win.google = {
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
