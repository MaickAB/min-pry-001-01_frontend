/* ==================================
    CONTROLLER INDEX LOTE
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
import { DialogLoteComponent } from '../dialog-lote/dialog-lote.component';
import { Router } from '@angular/router';
import { Lote } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Lote';
import { LoteService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Lote.service';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { Sucursal } from '../../../../../../utility/models/gestion/codificador/recursoMaterial/Sucursal';
import { ShowLoteComponent } from '../show-lote/show-lote.component';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';

@Component({
  selector: 'app-index-lote',
  standalone: true,
  imports: [TooltipModule, ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogLoteComponent, ShowLoteComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-lote.component.html',
  styleUrl: './index-lote.component.css'
})
export class IndexLoteComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  regionales!: Regional[];
  sucursales!: Sucursal[];

  // BODY
  lotes!: Lote[];
  dataCompleto!: Lote[];
  dataFiltrado!: Lote[];

  // STATE  
  loading: boolean = false;
  @ViewChild(ShowLoteComponent) detail!: ShowLoteComponent;
  @ViewChild(DialogLoteComponent) dialog!: DialogLoteComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private loteService: LoteService,
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
    this.loteService.index().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        this.regionales = response.regionales;
        this.sucursales = []

        // BODY        
        this.lotes = response.lotes;
        this.dataCompleto = response.lotes;
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
  showShow(id: any) {
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
      message: 'Está seguro de eliminar el Registro...?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      // ELIMINACIÓN REGISTRO
      accept: () => {
        console.log('REQUEST->destroy', id);
        this.loteService.destroy(id).subscribe({
          next: (response) => {
            this.lotes = this.lotes.filter((val) => val.id !== id);
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg, life: 3000 });
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
    this.lotes = this.dataCompleto.filter((val) => val.idRegional == idRegional);
    this.dataFiltrado = this.lotes;
    this.loadSucursales(idRegional);
  }

  // FILTER -> LOTES POR SUCURSAL
  filterBySucursal(idSucursal: number) {
    this.lotes = this.dataCompleto.filter((val) => val.idSucursal == idSucursal);
  }

  // CLEAR -> FILTRO REGIONAL
  clearFilterRegional() {
    this.lotes = this.dataCompleto;
  }

  // CLEAR -> FILTRO SUCURSAL
  clearFilterSucursal() {
    this.lotes = this.dataFiltrado;
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}
