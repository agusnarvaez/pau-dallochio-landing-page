import { Component, ChangeDetectionStrategy } from '@angular/core'

import { ButtonComponent } from '../../../components/button/button.component'

@Component({
  selector: 'app-home-contact',
  imports: [ButtonComponent],
  templateUrl: './home-contact.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-contact.component.css',
})
export class HomeContactComponent {}
