import { Routes } from '@angular/router';
import { IndexLoteComponent } from './compra/lote/index-lote/index-lote.component';

export const ComercializacionRoutes: Routes = [
  { path: 'compra/lote/index', component: IndexLoteComponent },
  { path: 'venta/lote/index', component: IndexLoteComponent },
];
