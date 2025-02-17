/* ==================================
        ROUTES WELCOME
================================== */
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServiceComponent } from './service/service.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';


export const WelcomeRoutes: Routes = [   
  { path: '', component: HomeComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];
 