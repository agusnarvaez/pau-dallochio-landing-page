import { Injectable, signal } from '@angular/core'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastState {
  message: string
  type: ToastType
  duration: number
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toast = signal<ToastState | null>(null)
  private timeoutId: ReturnType<typeof setTimeout> | null = null

  show(message: string, type: ToastType = 'info', duration = 2600): void {
    this.toast.set({ message, type, duration })

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setTimeout(() => {
      this.dismiss()
    }, duration)
  }

  dismiss(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    this.toast.set(null)
  }
}
