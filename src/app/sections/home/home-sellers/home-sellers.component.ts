import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import {  RouterLink } from '@angular/router'

@Component({
  selector: 'app-home-sellers',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './home-sellers.component.html',
  styleUrl: './home-sellers.component.css'
})
export class HomeSellersComponent {

}
