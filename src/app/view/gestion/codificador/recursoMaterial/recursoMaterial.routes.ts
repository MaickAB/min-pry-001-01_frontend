import { Routes } from '@angular/router';
import { IndexMineralComponent } from './mineral/index-mineral/index-mineral.component';
import { EditEmpresaComponent } from './empresa/edit-empresa/edit-empresa.component';
import { IndexSucursalComponent } from './sucursal/index-sucursal/index-sucursal.component';
import { DialogSucursalComponent } from './sucursal/dialog-sucursal/dialog-sucursal.component';


export const RecursoMaterialRoutes: Routes = [

  { path: 'empresa/edit', component: EditEmpresaComponent },
  { path: 'sucursal/index', component: IndexSucursalComponent },
  { path: 'sucursal/dialog', component: DialogSucursalComponent },
  { path: 'mineral/index', component: IndexMineralComponent },
];
