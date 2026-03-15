import { ApplicationConfig } from '@angular/core'
import { provideRouter, withInMemoryScrolling } from '@angular/router'

import { routes } from './app.routes'
import { provideHttpClient, withJsonpSupport } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(withJsonpSupport()),
  ],
}
