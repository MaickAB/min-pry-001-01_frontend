import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

import { MenuChangeEvent } from '../../view/utility/models/menu-change-event'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuSource = new Subject<MenuChangeEvent>()
  private resetSource = new Subject()
  private _menuSource$ = this.menuSource.asObservable()
  private _resetSource$ = this.resetSource.asObservable()

  public get menuSource$() {
    return this._menuSource$
  }
  public get resetSource$() {
    return this._resetSource$
  }
  public set resetSource$(value) {
    this._resetSource$ = value
  }
  public set menuSource$(value) {
    this._menuSource$ = value
  }
  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event)
  }

  reset() {
    this.resetSource.next(true)
  }
}
