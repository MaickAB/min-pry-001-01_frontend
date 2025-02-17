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
  regionales!: Regional[];
  sucursales!: Sucursal[];

  recepciones!: Recepcion[];
  dataCompleto!: Recepcion[];
  dataFiltrado!: Recepcion[];

  loading: boolean = false;
  @ViewChild(DialogRecepcionComponent) dialog!: DialogRecepcionComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private recepcionService: RecepcionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.show();
  }

  // OBTIENE -> DATA INICIAL
  show() {
    this.loading = true;
    console.log('REQUEST->index');
    this.recepcionService.index().subscribe({
      next: (response) => {
        // DATA HEADER
        this.regionales = response.regionales;
        this.sucursales = []

        // DATA BODY        
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

  // MUESTRA -> VIEW EDIT
  showEdit(id: number) {
    this.dialog.edit(id);
  }

  // MUESTRA -> REPORT GENERAL
  showReportGral() {
    alert('REPORTE COMPLETO');
  }

  // MUESTRA -> REPORT INDIVIDUAL
  showReport(id: any) {
    alert('REPORTE INDIVIDUAL');
  }

  // CARGA -> SUCURSALES EN EL COMBO
  loadSucursales(idRegional: any) {
    const regionalSelected = this.regionales.find(r => r.id === idRegional);
    this.sucursales = regionalSelected ? regionalSelected.sucursales : [];
  }

  // FILTRA -> LOTES POR REGIONAL
  filterByRegional(idRegional: number) {
    this.recepciones = this.dataCompleto.filter((val) => val.idRegionalOrigen == idRegional);
    this.dataFiltrado = this.recepciones;
    this.loadSucursales(idRegional);
  }

  // FILTRA -> LOTES POR SUCURSAL
  filterBySucursal(idSucursal: number) {
    this.recepciones = this.dataCompleto.filter((val) => val.idSucursalOrigen == idSucursal);
  }

  // ELIMINA -> FILTRO REGIONAL
  clearFilterRegional() {
    this.recepciones = this.dataCompleto;
  }

  // ELIMINA -> FILTRO SUCURSAL
  clearFilterSucursal() {
    this.recepciones = this.dataFiltrado;
  }
}
