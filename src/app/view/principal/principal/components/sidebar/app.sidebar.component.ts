import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'

import { AppMenuComponent } from '../menu/app.menu.component'
import { LayoutService } from '../../../../../service/principal/app.layout.service'
import { PrincipalService } from '../../../../../service/principal/Principal.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app.sidebar.component.html',
  standalone: true,
  imports: [AppMenuComponent],
})
export class AppSidebarComponent {
  @ViewChild(AppMenuComponent) menuOpcion!: AppMenuComponent;
  constructor(
    public layoutService: LayoutService,
    public el: ElementRef,
    public principalService: PrincipalService
  ) { }

  show(permisos: any) {
    this.menuOpcion.show(permisos);
  }
}
