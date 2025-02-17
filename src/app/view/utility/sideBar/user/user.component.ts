/* ==================================
      CONTROLLER HELP
================================== */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AuthService } from '../../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { PrincipalService } from '../../../../service/principal/Principal.service';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [AccordionModule, SidebarModule, ButtonModule, CommonModule, InputTextModule, FormsModule, InputGroupModule, InputGroupAddonModule],
  providers: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit {

  /* ATTRIBUTES
  -------------------------*/
  sidebarVisible!: boolean;
  usuario!: any;
  imgUrl!: any;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private authService: AuthService,
    private principalService: PrincipalService
  ) { }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.getDatos();
  }

  // OBTIENE -> LISTA DE ROLES
  getDatos() {
    this.sidebarVisible = false;
    this.usuario = this.principalService.getUsuarioStorage();
    this.imgUrl = this.usuario.persona.foto ? this.usuario.persona.foto : '/img/userDefecto.png';
  }

  // VERIFICA -> CREDENCIALES USER
  cerrarSesion() {
    this.authService.logout();
    this.navHome();
  }

  // NAVEGA -> HOME
  navHome() {
    this.route.navigateByUrl('', { skipLocationChange: false });
  }

  // MUESTRA -> VISTA AYUDA
  show() {
    this.sidebarVisible = true;
  }
}