import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'

type WindowWithGoogle = Window & {
  __karma__?: unknown
  google?: {
    maps?: {
      importLibrary?: (libraryName: string) => Promise<unknown>
      Map?: unknown
    }
  }
}

@Injectable({ providedIn: 'root' })
export class MapsLoaderService {
  private loadPromise?: Promise<void>
  private readonly readinessTimeoutMs = 4000
  private readonly readinessPollMs = 50

  load(): Promise<void> {
    const win = window as WindowWithGoogle

    if (win.__karma__) {
      return Promise.resolve()
    }

    if (this.hasImportLibrary(win) || this.isMapsReady(win)) {
      return Promise.resolve()
    }

    if (this.loadPromise) {
      return this.loadPromise
    }

    this.loadPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[data-maps-sdk="true"]',
      )

      if (existingScript) {
        if (existingScript.getAttribute('data-loaded') === '1') {
          void this.waitForApi(win)
            .then(() => resolve())
            .catch((error) => reject(error))
          return
        }

        existingScript.addEventListener(
          'load',
          () => {
            existingScript.setAttribute('data-loaded', '1')
            void this.waitForApi(win)
              .then(() => resolve())
              .catch((error) => reject(error))
          },
          { once: true },
        )

        existingScript.addEventListener(
          'error',
          () => {
            reject(new Error('No se pudo cargar Google Maps JS'))
          },
          { once: true },
        )

        return
      }

      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.setAttribute('data-maps-sdk', 'true')
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${environment.maps_key}` +
        '&v=weekly&loading=async&libraries=places&language=es&region=AR'

      script.addEventListener(
        'load',
        () => {
          script.setAttribute('data-loaded', '1')
          void this.waitForApi(win)
            .then(() => resolve())
            .catch((error) => reject(error))
        },
        { once: true },
      )

      script.addEventListener(
        'error',
        () => {
          reject(new Error('No se pudo cargar Google Maps JS'))
        },
        { once: true },
      )

      document.head.appendChild(script)
    })

    return this.loadPromise
  }

  private hasImportLibrary(win: WindowWithGoogle): boolean {
    return typeof win.google?.maps?.importLibrary === 'function'
  }

  private isMapsReady(win: WindowWithGoogle): boolean {
    return typeof win.google?.maps?.Map === 'function'
  }

  private waitForApi(win: WindowWithGoogle): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const startedAt = Date.now()

      const check = (): void => {
        if (this.hasImportLibrary(win) || this.isMapsReady(win)) {
          resolve()
          return
        }

        if (Date.now() - startedAt >= this.readinessTimeoutMs) {
          reject(new Error('Google Maps JS cargo sin API usable'))
          return
        }

        setTimeout(check, this.readinessPollMs)
      }

      check()
    })
  }
}
