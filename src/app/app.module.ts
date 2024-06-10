//  Módulos angular
import { LOCALE_ID, NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { RouterModule, RouterOutlet } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { NgOptimizedImage } from '@angular/common'
import { AppComponent } from './app.component'
// Componentes

// Páginas

// Importa locales adicionales
import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common'

// Registra los datos locales
registerLocaleData(localeEs)

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    RouterOutlet,
    BrowserModule,
    NgOptimizedImage,
    RouterModule,
    NgModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' }, // Configura la localidad a español
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
