/* ==================================
    CONTROLLER INDEX LABORATORIO
================================== */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, Header, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogLaboratorioComponent } from '../dialog-laboratorio/dialog-laboratorio.component';
import { Laboratorio } from '../../../../../utility/models/gestion/codificador/entorno/Laboratorio';
import { LaboratorioService } from '../../../../../../service/gestion/codificador/entorno/Laboratorio.service';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-laboratorio',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogLaboratorioComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-laboratorio.component.html',
  styleUrl: './index-laboratorio.component.css'
})
export class IndexLaboratorioComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  regionales!: Regional[];

  // BODY
  laboratorios!: Laboratorio[];
  data!: Laboratorio[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogLaboratorioComponent) dialog!: DialogLaboratorioComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private laboratorioService: LaboratorioService,
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
    this.laboratorioService.index().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.06');
        this.regionales = response.regionales;
        // BODY        
        this.laboratorios = response.laboratorios;
        this.data = response.laboratorios;
        console.log('RESPONSE->create', response);
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
        this.laboratorioService.destroy(id).subscribe({
          next: (response) => {
            this.laboratorios = this.laboratorios.filter((val) => val.id !== id); // Actualiza la Tabla
            this.messageService.add({ severity: 'success', summary: 'RESPONSE', detail: response.msg, life: 3000 }),
              console.log('RESPONSE->destroy', response)
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

  // ---------------------------------------------

  // FILTER -> RECORDS BY ID-REGIONAL
  filter(idParent: number) {
    this.laboratorios = this.data.filter((val) => val.idRegional == idParent);
  }

  // CLEAR -> FILTER
  clearFilter() {
    this.laboratorios = this.data;
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}
