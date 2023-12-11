import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomeBannerComponent } from '../../sections/home/home-banner/home-banner.component'
import { HomeFaqComponent } from '../../sections/home/home-faq/home-faq.component'
import { HomeStudioComponent } from '../../sections/home/home-studio/home-studio.component'
import { HomeReviewsComponent } from '../../sections/home/home-reviews/home-reviews.component'
import { HomeContactComponent } from '../../sections/home/home-contact/home-contact.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeBannerComponent,
    HomeStudioComponent,
    HomeReviewsComponent,
    HomeFaqComponent,
    HomeContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
