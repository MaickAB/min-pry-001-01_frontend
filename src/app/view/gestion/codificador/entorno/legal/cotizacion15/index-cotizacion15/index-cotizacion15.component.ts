/* ==================================
    CONTROLLER INDEX COTIZACION 15
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
import { DialogCotizacion15Component } from '../dialog-cotizacion15/dialog-cotizacion15.component';
import { Cotizacion15Service } from '../../../../../../../service/gestion/codificador/entorno/legal/Cotizacion15.service';
import { Cotizacion15 } from '../../../../../../utility/models/gestion/codificador/entorno/Cotizacion15';


@Component({
  selector: 'app-index-cotizacion15',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogCotizacion15Component],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-cotizacion15.component.html',
  styleUrl: './index-cotizacion15.component.css'
})
export class IndexCotizacion15Component {

  /* ATTRIBUTES
  -------------------------*/
  // HADER

  // BODY
  cotizaciones15!: Cotizacion15[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogCotizacion15Component) dialog!: DialogCotizacion15Component;

  /* METHODS
  -------------------------*/
  constructor(
    private cotizacion15Service: Cotizacion15Service,
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
    this.cotizacion15Service.index().subscribe({
      next: (response) => {
        // HEADER
        // BODY
        this.cotizaciones15 = response.cotizaciones15;
        console.log('RESPONSE->index', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->index Error en:', error.error);
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
        this.cotizacion15Service.destroy(id).subscribe({
          next: (response) => {
            this.cotizaciones15 = this.cotizaciones15.filter((val) => val.id !== id);
            this.messageService.add({ severity: 'success', summary: 'RESPONSE', detail: response.msg, life: 3000 });
            console.log('RESPONSE->destroy', response);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->destroy Error en:', error.error);
          }
        });
      }
    });
  }

  // SHOW -> VIEW REPORT
  showReport(id: number) {
    alert('showReport' + id);
  }

  // EXPORTA -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }
}


