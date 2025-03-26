import { NgFor, NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'

import { AppMenuitemComponent } from './app.menuitem.component'
import { LayoutService } from '../../../../../service/principal/app.layout.service'
import { AppMenuItem } from '../../../../utility/models/app-menu-item'
import { PrincipalService } from '../../../../../service/principal/Principal.service'

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  standalone: true,
  imports: [NgFor, NgIf, AppMenuitemComponent],
})
export class AppMenuComponent implements OnInit {
  model: AppMenuItem[] = []
  permisos: any;

  constructor(
    public layoutService: LayoutService,
    private principalService: PrincipalService) {
  }

  ngOnInit(): void {
    if (this.principalService.getRolSelectedStorage()) {
      this.show(this.principalService.getRolSelectedStorage().permisos);
    }
  }

  // PREPARA -> ARRAY DE PERMISOS
  show(data: any[]) {
    const buildMenuModel = (data: any) => {
      const model: any = [];
      const map = new Map();
      data.forEach((item: any) => {
        // Initialize the parent item if it does not exist
        if (!map.has(item.id)) {
          map.set(item.id, {
            label: item.permiso,
            icon: item.icono,
            items: []
          });
        }
        if (item.id.includes('.')) {
          const parentCode = item.id.substring(0, item.id.lastIndexOf('.'));
          if (map.has(parentCode)) {
            map.get(parentCode).items.push({
              label: item.permiso,
              icon: item.icono,
              routerLink: [item.url]
            });
          }
        } else {
          model.push(map.get(item.id));
        }
      });
      return model;
    };
    const menuModel = buildMenuModel(data);
    this.model = menuModel;
  };
}
