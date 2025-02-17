/* ==================================
      CONTROLLER INDEX USUARIO
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
import { DialogUsuarioComponent } from '../dialog-usuario/dialog-usuario.component';
import { Usuario } from '../../../../../utility/models/gestion/codificador/recursoHumano/Usuario';
import { UsuarioService } from '../../../../../../service/gestion/codificador/recursoHumano/Usuario.service';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';

@Component({
  selector: 'app-index-usuario',
  standalone: true,
  imports: [ProgressSpinnerModule, DropdownModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogUsuarioComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-usuario.component.html',
  styleUrl: './index-usuario.component.css'
})
export class IndexUsuarioComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEAD
  regionales!: Regional[];

  // BODY
  usuarios!: any[];
  data!: any[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogUsuarioComponent) dialog!: DialogUsuarioComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private usuarioService: UsuarioService,
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
    this.usuarioService.index().subscribe({
      next: (response) => {
        // HEAD
        this.regionales = response.regionales;
        // BODY
        this.usuarios = response.usuarios;
        this.data = response.usuarios;
        console.log('RESPONSE->index', response);
      },
      error: (error) => {
        this.usuarios = [];
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE -> Error en:', error.error);
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
      message: 'Está seguro de eliminar el Registro...?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      // ELIMINACIÓN REGISTRO
      accept: () => {
        console.log('REQUEST->destroy', id);
        this.usuarioService.destroy(id).subscribe({
          next: (response) => {
            this.usuarios = this.usuarios.filter((val) => val.id !== id);
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg, life: 3000 });
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
    this.usuarios = this.data.filter((val) => val.persona.idRegional == idRegional);
  }

  // CLEAR -> FILTER
  clearFilter() {
    this.usuarios = this.data;
  }
}
