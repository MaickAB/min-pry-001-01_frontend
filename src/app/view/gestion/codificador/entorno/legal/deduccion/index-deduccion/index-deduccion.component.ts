/* ==================================
      CONTROLLER INDEX DEDUCCIÓN
================================== */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogDeduccionComponent } from '../dialog-deduccion/dialog-deduccion.component';
import { Deduccion } from '../../../../../../utility/models/gestion/codificador/entorno/Deduccion';
import { DeduccionService } from '../../../../../../../service/gestion/codificador/entorno/legal/Deduccion.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-index-deduccion',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogDeduccionComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-deduccion.component.html',
  styleUrl: './index-deduccion.component.css'
})
export class IndexDeduccionComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER

  // BODY
  deducciones!: Deduccion[];
  deduccion!: Deduccion;

  // STATE
  loading: boolean = false;
  @ViewChild(DialogDeduccionComponent) dialog!: DialogDeduccionComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private deduccionService: DeduccionService,
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
    this.deduccionService.index().subscribe({
      next: (response) => {
        // HEADER
        // BODY        
        this.deducciones = response.deducciones;
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
        this.deduccionService.destroy(id).subscribe({
          next: (response) => {
            this.deducciones = this.deducciones.filter((val) => val.id !== id);
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
