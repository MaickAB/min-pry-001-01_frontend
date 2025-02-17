/* ==================================
        CONTROLLER REGISTER
================================== */
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Usuario } from '../../utility/models/gestion/codificador/recursoHumano/Usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // ATTRIBUTES
  usuario: Usuario;
  error: any;

  // METHODS
  constructor(
    private route: Router,
    private messageService: MessageService,
    private authService: AuthService) {
    this.usuario = { login: '', email: '', password: '', password_confirmation: '', fechaInicio: '', fechaFin: '', descripcion: '' };
  }

  // NAVEGA -> HOME
  navHome() {
    this.route.navigateByUrl('', { skipLocationChange: false });
  }

  // GUARDA -> DATOS USUARIO
  saveUsuario() {
    if (this.validarDatos(this.usuario)) {
      this.authService.register(this.usuario).subscribe({
        next: () => {
          this.showMessage(), setTimeout(async () => {
            await this.navLogin(); // Redireccionar después de 3 segundos
          }, 2000);
        },
        error: (error) => this.error = error
      });
    }
    else
      alert('Datos Incorrectos');
  }

  // VALIDA -> DATOS
  validarDatos(usuario: Usuario) {
    if (!usuario) {
      return false;
    }
    const name = /^[a-zA-Z ]{1,50}/;
    const email = /^[a-zA-Z0-9._-]{1,30}@[a-zA-Z0-9.-]{1,30}\.[a-zA-Z]{2,6}$/;
    const password = /^[a-zA-Z0-9._*-]{8,20}$/;
    const confirmPassword = /^[a-zA-Z0-9._*-]{8,20}$/;
    return (
      name.test(usuario.login) &&
      email.test(usuario.email) &&
      password.test(usuario.password) &&
      confirmPassword.test(usuario.password_confirmation)
    ) ? true : false;
  }

  // NAVEGA -> LOGIN-USER
  navLogin() {
    this.route.navigateByUrl('auth/login', { skipLocationChange: false });
  }

  // MUESTRA -> MENSAJE
  showMessage() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

}
