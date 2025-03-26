/* ==================================
      CONTROLLER HELP
================================== */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../service/auth/auth.service';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';

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
  @Input() usuario!: any;
  imgUrl!: any;

  estado!: boolean;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private authService: AuthService,
    private principalService: PrincipalService
  ) { }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    // this.usuario = this.principalService.getUsuarioStorage();
    this.imgUrl = this.usuario.persona.foto ? this.usuario.persona.foto : '/img/userDefecto.png';
  }

  // OBTIENE -> LISTA DE ROLES
  show() {
    this.estado = true;
  }

  // VERIFICA -> CREDENCIALES USER
  cerrarSesion() {
    console.log('REQUEST->logout');
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('RESPONSE->logout', response);
      },
      error: (error) => {
        console.log('RESPONSE->logout Error en:', error.error);
      }
    });
    this.route.navigateByUrl('', { skipLocationChange: false });
  }
}