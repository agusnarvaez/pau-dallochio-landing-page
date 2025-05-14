import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {}

  private _loading: boolean = false
  get loading(): boolean {
    return this._loading
  }
  set loading(value: boolean) {
    this._loading = value
  }

  showLoading() {
    this.loading = true
  }
  hideLoading() {
    this.loading = false
  }
}
