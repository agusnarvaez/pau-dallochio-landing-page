import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ToastService } from '../../services/toast/toast.service'

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
})
export class ToastContainerComponent {
  protected toastService = inject(ToastService)
}
