/* ==================================
        CONTROLLER ABOUT
================================== */

import { Component } from '@angular/core';
import { WelcomeService } from '../../../service/welcome/welcome.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  // ATTRIBUTES
  datos:any;

  // METHODS
  constructor(
    private welcomeService: WelcomeService){
  }

  ngOnInit() {
    this.getDatos;
  }

  // OBTIENE -> DATOS INICIALES
  getDatos(){
    this.welcomeService.getDatosService().subscribe((response) => {
      console.log('RESPONSE->', response);
      this.datos = response.datosAbout;
    });
  }
}
