/* ==================================
        ROUTES PRINCIPAL
================================== */
import { Routes } from '@angular/router';
import { PrincipalComponent } from './view/principal/principal/principal.component';
import { WelcomeComponent } from './view/welcome/welcome.component';
import { permisoGuard } from './service/auth/guard/permiso.guard';
import { AuthComponent } from './view/auth/auth.component';


export const routes: Routes = [

  // WELCOME
  {
    path: '',
    component: WelcomeComponent,
    loadChildren: () =>
      import('./view/welcome/welcome.routes').then(m => m.WelcomeRoutes),
  },

  // AUTENTICACIÓN
  {
    path: 'auth',
    component: AuthComponent,
    loadChildren: () =>
      import('./view/auth/auth.routes').then(m => m.AuthRoutes)
  },

  // PRINCIPAL ADMIN
  {
    path: 'principal',
    component: PrincipalComponent,
    loadChildren: () =>
      import('./view/principal/principal.routes').then(m => m.PrincipalRoutes), canActivate: [permisoGuard]
  },

  // RECURSOS MATERIALES
  {
    path: 'codificador/recursoMaterial',
    component: PrincipalComponent,
    loadChildren: () =>
      import('./view/gestion/codificador/recursoMaterial/recursoMaterial.routes').then(m => m.RecursoMaterialRoutes), canActivate: [permisoGuard]
  },

  // RECURSOS HUMANOS
  {
    path: 'codificador/recursoHumano',
    component: PrincipalComponent,
    loadChildren: () =>
      import('./view/gestion/codificador/recursoHumano/recursoHumano.routes').then(m => m.RecursoHumanoRoutes), canActivate: [permisoGuard]
  },

  // ENTORNO
  {
    path: 'codificador/entorno',
    component: PrincipalComponent,
    loadChildren: () =>
      import('./view/gestion/codificador/entorno/entorno.routes').then(m => m.EntornoRoutes), canActivate: [permisoGuard]
  },

  // COMERCIALIZACIÓN
  {
    path: 'registro/comercializacion',
    component: PrincipalComponent,
    loadChildren: () =>
      import('./view/gestion/registro/comercializacion/comercializacion.routes').then(m => m.ComercializacionRoutes), canActivate: [permisoGuard]
  },

  // TRANSITO
  {
    path: 'registro/transito',
    component: PrincipalComponent,
    loadChildren: () =>
      import('./view/gestion/registro/transito/transito.routes').then(m => m.TransitoRoutes), canActivate: [permisoGuard]
  },

  { path: '**', redirectTo: '' },
]

