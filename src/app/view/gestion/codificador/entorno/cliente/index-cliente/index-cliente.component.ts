/* ==================================
    CONTROLLER INDEX CLIENTE
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
import { Cliente } from '../../../../../utility/models/gestion/codificador/entorno/Cliente';
import { DialogClienteComponent } from '../dialog-cliente/dialog-cliente.component';
import { ClienteService } from '../../../../../../service/gestion/codificador/entorno/Cliente.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';

@Component({
  selector: 'app-index-cliente',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogClienteComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-cliente.component.html',
  styleUrl: './index-cliente.component.css'
})
export class IndexClienteComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  regionales!: Regional[];

  // BODY
  clientes!: Cliente[];
  data!: Cliente[];

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  loading: boolean = false;
  @ViewChild(DialogClienteComponent) dialog!: DialogClienteComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private clienteService: ClienteService,
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
    this.clienteService.index().subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY        
        this.clientes = response.clientes;
        this.data = response.clientes;
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
        this.clienteService.destroy(id).subscribe({
          next: (response) => {
            this.clientes = this.clientes.filter((val) => val.id !== id); // Actualiza la Tabla
            this.messageService.add({ severity: 'success', summary: 'RESPONSE', detail: response.msg, life: 3000 }),
              console.log('RESPONSE->destroy', response)
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
    this.clientes = this.data.filter((val) => val.idRegional == idRegional);
  }

  // CLEAR -> FILTER
  clearFilter() {
    this.clientes = this.data;
  }
}
