/* ==================================
        CONTROLLER CONTACT
================================== */

import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ButtonModule, InputTextModule,FormsModule,InputTextareaModule ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  // ATTRIBUTES
  email:any;
  mensaje:any;

  // METHODS
  constructor(
    private route: Router,
    private authService: AuthService){
  }

  // VERIFICA -> CREDENCIALES USER
  sendMensaje() {
    if (this.validarDatos(this.email,this.mensaje)){
      // this.authService.autenticarUser(this.user).subscribe({
      //   next:()=>this.navPantalPrincipallUser(),
      //   error:(err)=> console.error('Error:',err),
      //   complete:()=> console.log('Consulta exitosa')
      // });
    }      
    else 
      alert('Datos Incorrectos');
  }

  validarDatos(e:any,m:any) {
    if (!e || !m) {
      return false;
    }    
    const email = /^[a-zA-Z0-9._-]{1,30}@[a-zA-Z0-9.-]{1,30}\.[a-zA-Z]{2,6}$/;
    const mensaje = /^[a-zA-Z0-9._*-]{0,500}$/;
    return (email.test(e)&&mensaje.test(m) ? true : false);
  }
}
