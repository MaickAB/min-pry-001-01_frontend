/* ==================================
        CONTROLLER HOME
================================== */
import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { WelcomeService } from '../../../service/welcome/welcome.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // ATTRIBUTES
  datos:any;

  // METHODOS
  constructor(
    private welcomeService: WelcomeService,
    private route: Router) {
  }

  ngOnInit() {
    this.getDatos;
  }

  // OBTIENE -> DATOS INICIALES
  getDatos(){
      this.welcomeService.getDatosHome().subscribe((response) => {
        console.log('RESPONSE->', response);
        this.datos = response.datosHome;
      });
  }

  // NAVEGA -> ABOUT
  navAbout() {
    this.route.navigateByUrl('about', { skipLocationChange: true });
  }

}
