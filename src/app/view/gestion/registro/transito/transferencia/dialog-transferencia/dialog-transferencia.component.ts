/* ==================================
  CONTROLLER DIALOG TRANSFERENCIA
================================== */
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { Sucursal } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Sucursal';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { TransferenciaService } from '../../../../../../service/gestion/registro/transito/Transferencia.service';
import { ComunService } from '../../../../../../service/utility/Comun.service';
import { Lote } from '../../../../../utility/models/gestion/registro/comercializacion/compra/Lote';

import { TableModule } from 'primeng/table';
import { ModalAddLoteComponent } from '../modal-addLote/modal-addLote.component';
import { Transferencia } from '../../../../../utility/models/gestion/registro/transito/transferencia';


@Component({
  selector: 'app-dialog-transferencia',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, DropdownModule, CommonModule, CheckboxModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, ModalAddLoteComponent],
  templateUrl: './dialog-transferencia.component.html',
  styleUrl: './dialog-transferencia.component.css'
})
export class DialogTransferenciaComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  regionalesOrigen!: Regional[];
  sucursalesOrigen!: Sucursal[];
  regionalesDestino!: Regional[];
  sucursalesDestino!: Sucursal[];

  // BODY
  transferencia!: Transferencia;
  transferenciaLotes!: any[];
  lotes!: Lote[];
  data!: Lote[];

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  @ViewChild(ModalAddLoteComponent) dialog!: ModalAddLoteComponent;
  @Output() changeTransferencia = new EventEmitter();

  /* METHODS
  -------------------------*/
  // INYECCTIÓN -> DEPENDENCIAS
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private transferenciaService: TransferenciaService,
    private comunService: ComunService) {
  }

  // SHOW -> VIEW CREATE
  create() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->create');
    this.transferenciaService.create().subscribe({
      next: (response) => {
        // DATA HEADER
        this.regionalesOrigen = response.regionalesOrigen;
        this.sucursalesDestino = [];
        this.regionalesDestino = response.regionalesDestino;
        this.sucursalesDestino = [];
        // DATA BODY                        
        this.transferencia = { fechaHoraOrigen: '', descripcionOrigen: '', lotes: [] };
        this.transferenciaLotes = [];
        this.lotes = response.lotes;
        this.data = response.lotes;
        // FOOTHER
        this.usuario = this.principalService.getUsuarioStorage();
        this.initReloj();
        console.log('RESPONSE->create', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->create Error en:', error.error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // SHOW -> VIEW EDIT
  edit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->edit', id);
    this.transferenciaService.edit(id).subscribe({
      next: (response) => {
        // DATA HEADER
        this.regionalesOrigen = response.regionalesOrigen;
        this.loadSucursalesOrigen(response.transferencia.idRegionalOrigen);
        this.regionalesDestino = response.regionalesDestino;
        this.loadSucursalesDestino(response.transferencia.idRegionalDestino);

        // DATA BODY                         
        this.transferencia = response.transferencia;
        this.transferenciaLotes = this.loadDetail(response.lotes, response.transferencia.lotes);
        this.lotes = response.lotes;
        this.data = response.lotes;
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.initReloj();
        console.log('RESPONSE->edit', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->edit Error en:', error.error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // STORE / UPDATE -> DATA
  save() {
    this.prepareData()
    if (this.validate()) {
      this.saving = true;
      if (this.transferencia.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.transferencia);
        this.transferenciaService.update(this.transferencia).subscribe({
          next: (response) => {
            this.transferencia = response.transferencia;
            this.changeTransferencia.emit();
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
            console.log('RESPONSE->update', response);
            this.estado = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->update Error en:', error.error);
          }
        });
      } else {
        // SE GUARDA
        console.log('REQUEST->store', this.transferencia);
        this.transferenciaService.store(this.transferencia).subscribe({
          next: (response) => {
            this.transferencia = response.transferencia;
            this.changeTransferencia.emit();
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
            console.log('RESPONSE->store', response);
            this.estado = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->store Error en:', error.error);
          }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
  }

  // SHOW -> VIEW AGREGAR LOTE
  showAddLote() {
    if (this.valIdRegionalOrigen() && this.valIdSucursalOrigen())
      this.dialog.create(this.lotes, this.transferenciaLotes);
    else
      alert('SELECCIONE LA SUCURSAL ORIGEN...!!')
  }

  // DELETE -> LOTE AGREGADO
  deleteLote(id: any) {
    this.transferenciaLotes = this.transferenciaLotes.filter((val) => val.id !== id);
  }

  // LOAD -> LISTA DE SUCURSALES-ORIGEN
  loadSucursalesOrigen(idRegional: any) {
    const regionalSelected = this.regionalesOrigen.find(r => r.id === idRegional);
    this.sucursalesOrigen = regionalSelected ? regionalSelected.sucursales : [];
  }

  // LOAD -> LISTA DE SUCURSALES-DESTINO
  loadSucursalesDestino(idRegional: any) {
    const regionalSelected = this.regionalesDestino.find(r => r.id === idRegional);
    this.sucursalesDestino = regionalSelected ? regionalSelected.sucursales : [];
  }

  // FILTER -> LOTES POR SUCURSAL
  filterBySucursal(idSucursal: any) {
    this.lotes = this.data.filter((val) => val.idSucursal == idSucursal);
    this.transferenciaLotes = [];
  }

  // CLOSE -> MODAL
  cancel() {
    this.estado = false;
  }

  // PREPARE -> DATA PARA ENVIAR A BACKEND.
  private prepareData() {
    this.transferencia.idUsuarioOrigen = this.usuario.id;
    this.transferencia.fechaHoraOrigen = this.fechaHora;
    this.transferencia.lotes = this.transferenciaLotes.map(d => ({ idLote: d.id }));
  }

  // LOAD -> TRANSFERENCIA-DETALLE PARA EDIT
  private loadDetail(lista: any[], listaSelected: any[]) {
    let result: any[] = [];
    lista.forEach(item => {
      listaSelected.forEach(itemSelected => {
        if (item.id == itemSelected.idLote) {
          result.push(item);
        }
      })
    })
    return result;
  }

  // CLEAR -> TRANSFERENCIA-DETALLE
  clearDetail() {
    this.transferenciaLotes = [];
    this.transferencia.idSucursalOrigen = 0;
  }

  // UPDATE -> TRANSFERENCIA-DETALLE
  updateDetail(detail: any[]) {
    this.transferenciaLotes = detail;
  }

  // LOAD -> FECHA-HORA
  private initReloj() {
    setInterval(() => {
      this.fechaHora = new Date(); // Actualiza la fecha y hora cada segundo
    }, 1000);
  }

  /* VALIDADORES
  ---------------------------------------*/
  valIdRegionalOrigen(): boolean { return this.transferencia.idRegionalOrigen ? true : false }
  valIdSucursalOrigen(): boolean { return this.transferencia.idSucursalOrigen ? true : false }
  valIdRegionalDestino(): boolean { return this.transferencia.idRegionalDestino ? true : false }
  valIdSucursalDestino(): boolean { return this.transferencia.idSucursalDestino ? true : false }
  valIdLotes(): boolean { return this.transferencia.lotes.length > 0 ? true : false }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,500}$/; return (descripcion.test(this.transferencia.descripcionOrigen) ? true : false); }

  validate() {
    return (
      this.valIdRegionalOrigen() &&
      this.valIdSucursalOrigen() &&
      this.valIdRegionalDestino() &&
      this.valIdSucursalDestino() &&
      this.valIdLotes() &&
      this.valDescripcion()
    )
  }
}