//  Módulos angular
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { RouterModule, RouterOutlet } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { NgOptimizedImage } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
// Componentes

// Páginas


@NgModule({
  declarations: [

  ],
  imports: [
    AppRoutingModule,
    RouterOutlet,
    BrowserModule,
    HttpClientModule,
    NgOptimizedImage,
    RouterModule,
    NgModule
    /* FormsModule,
    NgOptimizedImage */
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
