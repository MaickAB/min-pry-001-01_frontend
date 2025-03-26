/* ==================================
    CONTROLLER INDEX-TRANSFERENCIA
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
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { Sucursal } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Sucursal';
import { DialogTransferenciaComponent } from '../dialog-transferencia/dialog-transferencia.component';
import { TransferenciaService } from '../../../../../../service/gestion/registro/transito/Transferencia.service';
import { Transferencia } from '../../../../../utility/models/gestion/registro/transito/transferencia';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';

@Component({
  selector: 'app-index-transferencia',
  standalone: true,
  imports: [TooltipModule, ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogTransferenciaComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-transferencia.component.html',
  styleUrl: './index-transferencia.component.css'
})
export class IndexTransferenciaComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  regionales!: Regional[];
  sucursales!: Sucursal[];

  // BODY
  transferencias!: Transferencia[];
  dataCompleto!: Transferencia[];
  dataFiltrado!: Transferencia[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogTransferenciaComponent) dialog!: DialogTransferenciaComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private transferenciaService: TransferenciaService,
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
    this.transferenciaService.index().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('07.01');
        this.regionales = response.regionales;
        this.sucursales = []

        // BODY        
        this.transferencias = response.transferencias;
        this.dataCompleto = response.transferencias;
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

  // SHOW -> VIEW SHOW
  showShow(id: number) {
    this.dialog.showShow(id);
  }

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.dialog.showEdit(id);
  }

  // SHOW -> VIEW DELETE
  showDelete(id: any) {

    // MODAL CONFIRMACIÓN
    this.confirmationService.confirm({
      message: 'Está seguro de eliminar el Registro...?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      // ELIMINACIÓN REGISTRO
      accept: () => {
        console.log('REQUEST->destroy', id);
        this.transferenciaService.destroy(id).subscribe({
          next: (response) => {
            this.transferencias = this.transferencias.filter((val) => val.id !== id);
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

  // EXPORT -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }

  // ---------------------------------------------

  // LOAD -> SUCURSALES
  loadSucursales(idRegional: any) {
    const regionalSelected = this.regionales.find(r => r.id === idRegional);
    this.sucursales = regionalSelected ? regionalSelected.sucursales : [];
  }

  // FILTER -> LOTES POR REGIONAL
  filterByRegional(idRegional: number) {
    this.transferencias = this.dataCompleto.filter((val) => val.idRegionalOrigen == idRegional);
    this.dataFiltrado = this.transferencias;
    this.loadSucursales(idRegional);
  }

  // FILTER -> LOTES POR SUCURSAL
  filterBySucursal(idSucursal: number) {
    this.transferencias = this.dataCompleto.filter((val) => val.idSucursalOrigen == idSucursal);
  }

  // CLEAR -> FILTRO REGIONAL
  clearFilterRegional() {
    this.transferencias = this.dataCompleto;
  }

  // CLEAR -> FILTRO SUCURSAL
  clearFilterSucursal() {
    this.transferencias = this.dataFiltrado;
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}
