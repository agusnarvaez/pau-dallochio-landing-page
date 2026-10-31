import { Component } from '@angular/core'

import { ButtonComponent } from '../../components/button/button.component'

@Component({
  selector: 'app-not-found',
  imports: [ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {}
