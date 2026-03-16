import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {}

  private readonly loadingSubject = new BehaviorSubject<boolean>(false)
  readonly loading$ = this.loadingSubject.asObservable()

  get loading(): boolean {
    return this.loadingSubject.value
  }
  set loading(value: boolean) {
    this.loadingSubject.next(value)
  }

  showLoading() {
    this.loading = true
  }
  hideLoading() {
    this.loading = false
  }
}
