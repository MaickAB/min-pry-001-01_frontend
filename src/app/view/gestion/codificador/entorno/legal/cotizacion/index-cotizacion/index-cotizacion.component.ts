/* ==================================
    CONTROLLER INDEX COTIZACION
================================== */
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogCotizacionComponent } from '../dialog-cotizacion/dialog-cotizacion.component';
import { Cotizacion } from '../../../../../../utility/models/gestion/codificador/entorno/Cotizacion';
import { CotizacionService } from '../../../../../../../service/gestion/codificador/entorno/legal/Cotizacion.service';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-index-cotizacion',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogCotizacionComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-cotizacion.component.html',
  styleUrl: './index-cotizacion.component.css'
})
export class IndexCotizacionComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HADER
  permissions!: any[];

  // BODY
  cotizaciones!: Cotizacion[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogCotizacionComponent) dialog!: DialogCotizacionComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private cotizacionService: CotizacionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.show();
  }

  // SHOW -> VIEW INDEX
  show() {
    this.loading = true;
    console.log('REQUEST->index');
    this.cotizacionService.index().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.01');
        // BODY
        this.cotizaciones = response.cotizaciones;
        console.log('RESPONSE->index', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->index Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.dialog.showCreate();
  }

  // SHOW -> VIEW SHOW
  showShow(id: number) {
    this.dialog.showShow(id);
  }

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.dialog.showEdit(id);
  }

  // SHOW -> VIEW DELETE
  showDelete(id: number) {

    // MODAL CONFIRMACIÓN
    this.confirmationService.confirm({
      message: 'Está seguro de eliminar el Registro...??',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      // ELIMINACIÓN REGISTRO
      accept: () => {
        console.log('REQUEST->destroy', id);
        this.cotizacionService.destroy(id).subscribe({
          next: (response) => {
            this.cotizaciones = this.cotizaciones.filter((val) => val.id !== id);
            this.messageService.add({ severity: 'success', summary: 'RESPONSE', detail: response.msg, life: 3000 });
            console.log('RESPONSE->destroy', response);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->destroy Error en:', error.error);
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      }
    });
  }

  // EXPORTA -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}
