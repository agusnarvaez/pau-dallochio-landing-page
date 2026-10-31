import { CommonModule } from '@angular/common'
import { Component, inject, ChangeDetectionStrategy } from '@angular/core'
import { ToastService } from '../../services/toast/toast.service'

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './toast-container.component.css',
})
export class ToastContainerComponent {
  protected toastService = inject(ToastService)
}
