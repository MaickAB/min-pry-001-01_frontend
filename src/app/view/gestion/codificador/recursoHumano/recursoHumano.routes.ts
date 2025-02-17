import { Routes } from '@angular/router';
import { IndexPersonaComponent } from './persona/index-persona/index-persona.component';
import { IndexRolComponent } from './rol/index-rol/index-rol.component';
import { IndexUsuarioComponent } from './usuario/index-usuario/index-usuario.component';

export const RecursoHumanoRoutes: Routes = [

  { path: 'persona/index', component: IndexPersonaComponent },
  { path: 'rol/index', component: IndexRolComponent },
  { path: 'usuario/index', component: IndexUsuarioComponent }
];
