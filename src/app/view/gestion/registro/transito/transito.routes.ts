import { Routes } from '@angular/router';
import { IndexTransferenciaComponent } from './transferencia/index-transferencia/index-transferencia.component';
import { IndexRecepcionComponent } from './recepcion/index-recepcion/index-recepcion.component';

export const TransitoRoutes: Routes = [
  { path: 'transferencia/index', component: IndexTransferenciaComponent },
  { path: 'recepcion/index', component: IndexRecepcionComponent },
];
