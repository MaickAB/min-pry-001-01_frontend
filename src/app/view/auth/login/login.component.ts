/* ==================================
        CONTROLLER LOGIN
================================== */
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Credencial } from '../../utility/models/principal/Credencial';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, PasswordModule, CommonModule, InputTextModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  /* ATTRIBUTES
  -------------------------*/
  credencial!: Credencial;
  loading!: boolean;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private messageService: MessageService,
    private authService: AuthService) {
    this.credencial = { email: '', password: '' };
    this.loading = false;
  }

  // VERIFICA -> CREDENCIALES USER
  autenticarUser() {
    if (this.validarDatos(this.credencial)) {
      this.loading = true;
      console.log('REQUEST->login', this.credencial);
      this.authService.login(this.credencial).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
          console.log('RESPONSE->login', response);
          setTimeout(async () => {
            await this.navPantallaPrincipalUser(); // Redireccionar después de 3 segundos
          }, 1000);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.msg });
          console.log('RESPONSE->login Error en:', error.error);
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
  }

  // NAVEGA -> PANTALLA PRINCIPAL USER
  navPantallaPrincipalUser() {
    this.route.navigateByUrl('principal', { skipLocationChange: false });
  }

  // VALIDA -> DATOS
  validarDatos(user: any) {
    if (!user) {
      return false;
    }
    const email = /^[a-zA-Z0-9._-]{1,30}@[a-zA-Z0-9.-]{1,30}\.[a-zA-Z]{2,6}$/;
    const password = /^[a-zA-Z0-9._*-]{8,20}$/;
    return (email.test(user.email) && password.test(user.password)) ? true : false;
  }
}

