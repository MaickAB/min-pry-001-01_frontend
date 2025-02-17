/* ==================================
      CONTROLLER INDEX ROL
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
import { Rol } from '../../../../../utility/models/gestion/codificador/recursoHumano/Rol';
import { RolService } from '../../../../../../service/gestion/codificador/recursoHumano/Rol.service';
import { DialogRolComponent } from '../dialog-rol/dialog-rol.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-index-rol',
  standalone: true,
  imports: [ProgressSpinnerModule, DropdownModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogRolComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-rol.component.html',
  styleUrl: './index-rol.component.css'
})

export class IndexRolComponent implements OnInit {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  regionales!: Regional[];

  // BODY
  roles!: Rol[];
  data!: Rol[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogRolComponent) dialog!: DialogRolComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private rolService: RolService,
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
    this.rolService.index().subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY
        this.roles = response.roles;
        this.data = response.roles;
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
        this.rolService.destroy(id).subscribe({
          next: (response) => {
            this.roles = this.roles.filter((val) => val.id !== id);
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

  // ---------------------------------------------

  // FILTER -> RECORDS BY ID-REGIONAL
  filter(idRegional: number) {
    this.roles = this.data.filter((val) => val.idRegional == idRegional);
  }

  // CLEAR -> FILTER
  clearFilter() {
    this.roles = this.data;
  }
}