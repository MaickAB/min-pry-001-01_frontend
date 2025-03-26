/* ==================================
      CONTROLLER INDEX SUCURSAL
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
import { SucursalService } from '../../../../../../service/gestion/codificador/recursoMaterial/Sucursal.service';
import { Sucursal } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Sucursal';
import { DialogSucursalComponent } from '../dialog-sucursal/dialog-sucursal.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-sucursal',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogSucursalComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-sucursal.component.html',
  styleUrl: './index-sucursal.component.css'
})
export class IndexSucursalComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  regionales!: Regional[];

  // BODY
  sucursales!: Sucursal[];
  data!: Sucursal[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogSucursalComponent) dialog!: DialogSucursalComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private sucursalService: SucursalService,
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
    this.sucursalService.index().subscribe({
      next: (response) => {
        // HEAD
        this.permissions = this.principalService.getPermissionsStorage('02.02');
        this.regionales = response.regionales;
        // BODY
        this.sucursales = response.sucursales;
        this.data = response.sucursales;
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
      message: 'Está seguro de eliminar el Registro...?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      // ELIMINACIÓN REGISTRO
      accept: () => {
        console.log('REQUEST->destroy', id);
        this.sucursalService.destroy(id).subscribe({
          next: (response) => {
            this.sucursales = this.sucursales.filter((val) => val.id !== id);
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
    this.sucursales = this.data.filter((val) => val.idRegional == idParent);
  }

  // CLEAR -> FILTER
  clearFilter() {
    this.sucursales = this.data;
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}