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
import { SocioService } from '../../../../../../../service/gestion/codificador/entorno/Socio.service';
import { ActivatedRoute } from '@angular/router';
import { Cooperativa } from '../../../../../../utility/models/gestion/codificador/entorno/Cooperativa';
import { DialogDeduccionGralComponent } from '../dialog-deduccionGral/dialog-deduccionGral.component';
import { Deduccion } from '../../../../../../utility/models/gestion/codificador/entorno/Deduccion';
import { DeduccionGralService } from '../../../../../../../service/gestion/codificador/entorno/legal/DeduccionGral.service';



@Component({
  selector: 'app-index-deduccionGral',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogDeduccionGralComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-deduccionGral.component.html',
  styleUrl: './index-deduccionGral.component.css'
})
export class IndexDeduccionGralComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER

  // BODY
  @Input() cooperativa!: Cooperativa;
  @Input() deduccionesGral!: any[];
  deduccion!: Deduccion;

  // STATE
  estado!: boolean;
  loading!: boolean;
  @ViewChild(DialogDeduccionGralComponent) dialog!: DialogDeduccionGralComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private deduccionGralService: DeduccionGralService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.show();
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.deduccionGralService.index(this.cooperativa.id).subscribe({
      next: (response) => {
        this.deduccionesGral = response.deduccionesGral;
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
    this.dialog.showCreate(this.cooperativa.id);
  }

  // SHOW -> VIEW EDIT
  showEdit(socio: Socio) {
    this.dialog.showEdit(socio);
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
        this.deduccionGralService.destroy(id).subscribe({
          next: (response) => {
            this.deduccionesGral = this.deduccionesGral.filter((val) => val.id !== id);
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

