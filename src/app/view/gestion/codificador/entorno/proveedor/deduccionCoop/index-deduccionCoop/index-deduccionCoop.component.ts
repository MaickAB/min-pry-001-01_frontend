/* ==================================
    CONTROLLER INDEX SOCIO
================================== */
import { Component, Input, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Socio } from '../../../../../../utility/models/gestion/codificador/entorno/Socio';
import { DialogDeduccionCoopComponent } from '../dialog-deduccionCoop/dialog-deduccionCoop.component';
import { DeduccionCoopService } from '../../../../../../../service/gestion/codificador/entorno/legal/DeduccionCoop.service';



@Component({
  selector: 'app-index-deduccionCoop',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogDeduccionCoopComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-deduccionCoop.component.html',
  styleUrl: './index-deduccionCoop.component.css'
})
export class IndexDeduccionCoopComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER

  // BODY
  @Input() idCooperativa!: any;
  @Input() deduccionesCoop!: any[];
  socio!: Socio;

  // STATE
  estado!: boolean;
  loading!: boolean;
  @ViewChild(DialogDeduccionCoopComponent) dialog!: DialogDeduccionCoopComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private deduccionCoopService: DeduccionCoopService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.deduccionCoopService.index(this.idCooperativa).subscribe({
      next: (response) => {
        this.deduccionesCoop = response.deduccionesCoop;
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
    this.dialog.showCreate(this.idCooperativa);
  }

  // SHOW -> VIEW EDIT
  showEdit(deduccionCoop: any) {
    this.dialog.showEdit(deduccionCoop);
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
        this.deduccionCoopService.destroy(id).subscribe({
          next: (response) => {
            this.deduccionesCoop = this.deduccionesCoop.filter((val) => val.id !== id);
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

  // EXPORT -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }
}

