/* ==================================
    CONTROLLER INDEX COOPERATIVA
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Cooperativa } from '../../../../../../utility/models/gestion/codificador/entorno/Cooperativa';
import { DialogCooperativaComponent } from '../dialog-cooperativa/dialog-cooperativa.component';
import { CooperativaService } from '../../../../../../../service/gestion/codificador/entorno/proveedor/Cooperativa.service';
import { ShowCooperativaComponent } from '../show-cooperativa/show-cooperativa.component';
import { Regional } from '../../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { DropdownModule } from 'primeng/dropdown';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-cooperativa',
  standalone: true,
  imports: [ProgressSpinnerModule, DropdownModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogCooperativaComponent, ShowCooperativaComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-cooperativa.component.html',
  styleUrl: './index-cooperativa.component.css'
})

export class IndexCooperativaComponent implements OnInit {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  regionales!: Regional[];

  // BODY
  cooperativas!: Cooperativa[];
  data!: Cooperativa[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogCooperativaComponent) dialog!: DialogCooperativaComponent;
  @ViewChild(ShowCooperativaComponent) detail!: ShowCooperativaComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private cooperativaService: CooperativaService,
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
    this.cooperativaService.index().subscribe({
      next: (response) => {
        // HEAD
        this.permissions = this.principalService.getPermissionsStorage('05.04');
        this.regionales = response.regionales;
        // BODY
        this.cooperativas = response.cooperativas;
        this.data = response.cooperativas;
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
    this.detail.show(id);
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
        this.cooperativaService.destroy(id).subscribe({
          next: (response) => {
            this.cooperativas = this.cooperativas.filter((val) => val.id !== id);
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

  // ---------------------------------------------

  // FILTER -> RECORDS BY ID-REGIONAL
  filter(idParent: number) {
    this.cooperativas = this.data.filter((val) => val.idRegional == idParent);
  }

  // CLEAR -> FILTER
  clearFilter() {
    this.cooperativas = this.data;
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}
