import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { LoaderService } from './services/loader/loader.service'
import { ToastContainerComponent } from './components/toast-container/toast-container.component'
import { SeoService } from './services/seo/seo.service'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastContainerComponent,
  ],
})
export class AppComponent {
  constructor(
    private loaderService: LoaderService,
    private seoService: SeoService,
  ) {
    this.seoService.init()
  }
  show = false
  title = 'pau-dallochio-landing-page'

  isLoading = () => this.loaderService.loading
}
