/* ==================================
        CONTROLLER WELCOME
================================== */
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { AppFooterComponent } from '../principal/principal/components/footer/app.footer.component';
import { WelcomeService } from '../../service/welcome/welcome.service';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [AppFooterComponent, RouterOutlet, MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, CommonModule, ButtonModule],
    templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {

    // ATTRIBUTES
    opciones: MenuItem[] | undefined;
    acceso: boolean = false;
    countUsers!: any;

    // METHODS
    constructor(
        private route: Router,
        private authService: AuthService,
        private welcomeService: WelcomeService
    ) { }

    ngOnInit() {
        this.loadOpciones();
        this.acceso = this.authService.isAuthenticated();
        this.getCountUsers();
    }

    // CARGA -> OPCIONES DE NAVEGACIÓN
    loadOpciones() {
        this.opciones = [
            {
                label: 'Inicio',
                icon: 'pi pi-home',
                link: ''
            },
            {
                label: 'Servicios',
                icon: 'pi pi-list-check',
                link: 'service'
            },
            {
                label: 'Conocenos',
                icon: 'pi pi-search',
                link: 'about'
            },
            {
                label: 'Contactanos',
                icon: 'pi pi-envelope',
                link: 'contact'
            }
        ];
    }

    // NAVEGA -> HOME, SERVICE, ABOUT, CONTACT
    navOpciones(url: any) {
        this.route.navigateByUrl(url, { skipLocationChange: false });
    }

    // NAVEGA -> LOGIN
    navLogin() {
        this.route.navigateByUrl('auth/login', { skipLocationChange: false });
    }

    // NAVEGA -> REGISTER
    navRegister() {
        this.route.navigateByUrl('auth/register', { skipLocationChange: false });
    }

    // NAVEGA -> DASHBOARD
    navDashboard() {
        this.route.navigateByUrl('principal', { skipLocationChange: false });
    }

    getCountUsers() {
        this.welcomeService.getCountUsers().subscribe({
            next: (response) => {
                this.countUsers = response.countUsers;
                console.log('RESPONSE->welcome', response);
            },
            error: (error) => {
                console.log('RESPONSE->welcome Error en:', error.error);
            }
        });
    }

}
