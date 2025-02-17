/* ==================================
        CONTROLLER AUTH
================================== */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../service/auth/auth.service';
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ButtonModule, RouterOutlet],
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  // ATTRIBUTES

  // METHODS
  constructor(
    private route: Router,
    private authService: AuthService) {
  }

  // NAVEGA -> HOME
  navHome() {
    this.route.navigateByUrl('', { skipLocationChange: false });
  }


}
