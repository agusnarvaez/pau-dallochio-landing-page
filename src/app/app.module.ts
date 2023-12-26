//  Módulos angular
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { RouterModule, RouterOutlet } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { NgOptimizedImage } from '@angular/common'
// Componentes

// Páginas


@NgModule({
  declarations: [

  ],
  imports: [
    AppRoutingModule,
    RouterOutlet,
    BrowserModule,
    NgOptimizedImage,
    RouterModule,
    NgModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
