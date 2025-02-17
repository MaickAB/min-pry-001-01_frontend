import { NgClass } from '@angular/common'
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LayoutService } from '../../../../../service/principal/app.layout.service'
import { AppMenuItem } from '../../../../utility/models/app-menu-item'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { AppMenuComponent } from '../menu/app.menu.component'
import { PrincipalService } from '../../../../../service/principal/Principal.service'
import { HelpComponent } from '../../../../utility/sideBar/help/help.component'
import { UserComponent } from '../../../../utility/sideBar/user/user.component'
import { ConfigComponent } from '../../../../utility/sideBar/config/config.component'

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  standalone: true,
  imports: [RouterLink, NgClass, FormsModule, DropdownModule, AppMenuComponent, HelpComponent, UserComponent, ConfigComponent],
})
export class AppTopBarComponent implements OnInit {
  @ViewChild('menubutton') menuButton!: ElementRef
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef
  @ViewChild('topbarmenu') menu!: ElementRef
  @ViewChild(AppMenuComponent) menuSider!: AppMenuComponent;
  @ViewChild(HelpComponent) helpSider!: HelpComponent;
  @ViewChild(UserComponent) userSider!: HelpComponent;
  @ViewChild(ConfigComponent) configSider!: HelpComponent;
  items!: AppMenuItem[];
  @Input() roles!: any[];
  @Output() changeRol = new EventEmitter<any>();
  @Output() changeRoles = new EventEmitter<any>();
  rolSelected: any;

  // METHODS
  constructor(
    public layoutService: LayoutService,
    private principalService: PrincipalService) {
  }

  // INICIALIZA -> ROL SELECCIONADO
  ngOnInit(): void {
    if (this.principalService.getRolSelectedStorage())
      this.rolSelected = this.principalService.getRolSelectedStorage();
  }

  // INICIALIZA -> ROL POR DEFECTO
  ngOnChanges(changes: SimpleChanges): void {
    if (this.roles && changes['roles']) {
      if (!this.principalService.getRolSelectedStorage())
        if (Array.isArray(this.roles) && this.roles.length > 0) {
          this.rolSelected = this.roles[0];
          this.showPermisos();
        }
        else {
          this.rolSelected = this.principalService.getRolSelectedStorage;
          this.showPermisos();
        }
    }
  }

  // ENVIA -> PERMISOS AL SIDER
  showPermisos() {
    this.principalService.setRolSelectedStorage(this.rolSelected);
    this.changeRol.emit(this.rolSelected.permisos);
  }

  // ENVIA -> PERMISOS AL SIDER
  recargarRoles() {
    this.principalService.deleteRolesStorage();
    this.changeRoles.emit(this.rolSelected.permisos);
    this.rolSelected = this.principalService.getRolSelectedStorage();
  }

  // MUESTRA -> AYUDA
  showHelp() {
    this.helpSider.show();
  }

  // MUESTRA -> DATOS USER
  showUser() {
    this.userSider.show();
  }

  // MUESTRA -> CONFIGURACIÓN
  showConfig() {
    this.configSider.show();
  }

}
