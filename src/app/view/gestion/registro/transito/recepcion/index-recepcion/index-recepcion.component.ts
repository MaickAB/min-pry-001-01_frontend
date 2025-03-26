/* ==================================
    CONTROLLER INDEX RECEPCION
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
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { Sucursal } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Sucursal';
import { DialogRecepcionComponent } from '../dialog-recepcion/dialog-recepcion.component';
import { RecepcionService } from '../../../../../../service/gestion/registro/transito/Recepcion.service';
import { Recepcion } from '../../../../../utility/models/gestion/registro/transito/recepcion';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';

@Component({
  selector: 'app-index-recepcion',
  standalone: true,
  imports: [TooltipModule, ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogRecepcionComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-recepcion.component.html',
  styleUrl: './index-recepcion.component.css'
})
export class IndexRecepcionComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  regionales!: Regional[];
  sucursales!: Sucursal[];

  // BODY
  recepciones!: Recepcion[];
  dataCompleto!: Recepcion[];
  dataFiltrado!: Recepcion[];

  // STATE
  loading: boolean = false;

  @ViewChild(DialogRecepcionComponent) dialog!: DialogRecepcionComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private recepcionService: RecepcionService,
    private messageService: MessageService) {
  }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.show();
  }

  // SHOW -> VIEW INDEX
  show() {
    this.loading = true;
    console.log('REQUEST->index');
    this.recepcionService.index().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('07.02');
        this.regionales = response.regionales;
        this.sucursales = []

        // BODY        
        this.recepciones = response.recepciones;
        this.dataCompleto = response.recepciones;
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

  // SHOW -> VIEW SHOW
  showShow(id: number) {
    this.dialog.showShow(id);
  }

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.dialog.showEdit(id);
  }

  // LOAD -> SUCURSALES
  loadSucursales(idRegional: any) {
    const regionalSelected = this.regionales.find(r => r.id === idRegional);
    this.sucursales = regionalSelected ? regionalSelected.sucursales : [];
  }

  // FILTER -> LOTES POR REGIONAL
  filterByRegional(idRegional: number) {
    this.recepciones = this.dataCompleto.filter((val) => val.idRegionalOrigen == idRegional);
    this.dataFiltrado = this.recepciones;
    this.loadSucursales(idRegional);
  }

  // FILTER -> LOTES POR SUCURSAL
  filterBySucursal(idSucursal: number) {
    this.recepciones = this.dataCompleto.filter((val) => val.idSucursalOrigen == idSucursal);
  }

  // CLEAR -> FILTRO REGIONAL
  clearFilterRegional() {
    this.recepciones = this.dataCompleto;
  }

  // CLEAR -> FILTRO SUCURSAL
  clearFilterSucursal() {
    this.recepciones = this.dataFiltrado;
  }

  // EXPORT -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }

}
