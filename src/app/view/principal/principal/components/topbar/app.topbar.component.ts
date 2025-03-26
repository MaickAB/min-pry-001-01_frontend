import { CommonModule, NgClass } from '@angular/common'
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core'
import { RouterLink, TitleStrategy } from '@angular/router'
import { LayoutService } from '../../../../../service/principal/app.layout.service'
import { AppMenuItem } from '../../../../utility/models/app-menu-item'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, NgClass, FormsModule, DropdownModule],
})
export class AppTopBarComponent {
  @ViewChild('menubutton') menuButton!: ElementRef
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef
  @ViewChild('topbarmenu') menu!: ElementRef
  items!: AppMenuItem[];
  @Input() roles!: any[];
  @Input() rol!: any;
  @Input() load!: any;
  @Output() changeRol = new EventEmitter<any>();
  @Output() changeRoles = new EventEmitter<any>();
  @Output() eventOption = new EventEmitter<any>();

  // METHODS
  constructor(
    public layoutService: LayoutService) {
  }

  // NOTIFY -> CAMBIO DE ROL
  updateRol() {
    this.changeRol.emit(this.rol);
  }

  // NOTIFY -> UPDATE-ROLES Y PERMISOS
  updateRoles() {
    this.changeRoles.emit();
  }

  // NOTIFY -> SHOW VIEW TOP-OPTIONS
  showOption(e: string) {
    this.eventOption.emit(e);
  }
}
