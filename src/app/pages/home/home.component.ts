import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomeBannerComponent } from '../../sections/home/home-banner/home-banner.component'
import {
  HOME_FAQ_ITEMS,
  HomeFaqComponent,
} from '../../sections/home/home-faq/home-faq.component'
import { HomeStudioComponent } from '../../sections/home/home-studio/home-studio.component'
import { HomeReviewsComponent } from '../../sections/home/home-reviews/home-reviews.component'
import { HomeContactComponent } from '../../sections/home/home-contact/home-contact.component'
import { SeoService } from '../../services/seo/seo.service'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeBannerComponent,
    HomeStudioComponent,
    HomeReviewsComponent,
    HomeFaqComponent,
    HomeContactComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setFaqStructuredData(HOME_FAQ_ITEMS)
  }

  ngOnDestroy(): void {
    this.seoService.clearFaqStructuredData()
  }
}
