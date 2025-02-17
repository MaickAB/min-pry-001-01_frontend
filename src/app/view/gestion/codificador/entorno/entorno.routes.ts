import { Routes } from '@angular/router';
import { IndexClienteComponent } from './cliente/index-cliente/index-cliente.component';
import { IndexCotizacionComponent } from './legal/cotizacion/index-cotizacion/index-cotizacion.component';
import { IndexDeduccionComponent } from './legal/deduccion/index-deduccion/index-deduccion.component';
import { IndexLaboratorioComponent } from './laboratorio/index-laboratorio/index-laboratorio.component';
import { IndexCotizacion15Component } from './legal/cotizacion15/index-cotizacion15/index-cotizacion15.component';
import { IndexCooperativaComponent } from './proveedor/cooperativa/index-cooperativa/index-cooperativa.component';
import { IndexSocioComponent } from './proveedor/socio/index-socio/index-socio.component';

export const EntornoRoutes: Routes = [
  { path: 'cooperativa/index', component: IndexCooperativaComponent },
  { path: 'socio/index/:id', component: IndexSocioComponent },
  { path: 'cliente/index', component: IndexClienteComponent },
  { path: 'laboratorio/index', component: IndexLaboratorioComponent },
  { path: 'cotizacion/index', component: IndexCotizacionComponent },
  { path: 'cotizacion15/index', component: IndexCotizacion15Component },
  { path: 'deduccion/index', component: IndexDeduccionComponent },
];
