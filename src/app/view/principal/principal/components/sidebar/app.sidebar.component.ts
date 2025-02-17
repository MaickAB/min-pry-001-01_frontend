import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'

import { AppMenuComponent } from '../menu/app.menu.component'
import { LayoutService } from '../../../../../service/principal/app.layout.service'

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
  ) { }

  showPermisos(permisos: any) {
    this.menuOpcion.showPermisos(permisos);
  }
}
