import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor() { }

  private _filters: string[] = []

  get = () => this._filters

  add = (filter: string) => this._filters.push(filter)

  remove = (filter: string) => this._filters = this._filters.filter(f => f !== filter)

  clear = () => this._filters = []
}
