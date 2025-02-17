/* ==================================
        CONTROLLER SERVICE
================================== */

import { Component } from '@angular/core';
import { WelcomeService } from '../../../service/welcome/welcome.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
  // ATTRIBUTES
  datos: any;

  // METHODS
  constructor(
    private welcomeService: WelcomeService){
  }

  ngOnInit() {
    this.getDatos;
  }

  // OBTIENE -> DATOS INICIALES
  getDatos() {
    this.welcomeService.getDatosService().subscribe((response) => {
      console.log('RESPONSE->', response);
      this.datos = response.datosService;
    });
  }

}
