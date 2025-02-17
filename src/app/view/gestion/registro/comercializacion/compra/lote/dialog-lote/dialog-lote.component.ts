/* ==================================
    CONTROLLER DIALOG LOTE
================================== */
import { Component, Output, EventEmitter } from '@angular/core';
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
import { Regional } from '../../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { Sucursal } from '../../../../../../utility/models/gestion/codificador/recursoMaterial/Sucursal';
import { Socio } from '../../../../../../utility/models/gestion/codificador/entorno/Socio';
import { Lote } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Lote';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { LoteService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Lote.service';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-dialog-lote',
  standalone: true,
  imports: [ProgressSpinnerModule, DropdownModule, CommonModule, CheckboxModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-lote.component.html',
  styleUrl: './dialog-lote.component.css'
})
export class DialogLoteComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  regionales!: Regional[];
  sucursales!: Sucursal[];

  // BODY
  minerales!: any[];
  molienderos!: any[];
  cooperativas!: any[];
  socios!: Socio[];
  mineral!: any;
  taraPorcentaje: any;
  humedadPorcentaje: any;
  pesoNeto: any;
  tara!: boolean;
  lote!: Lote;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  @Output() changeLote = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private loteService: LoteService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->create');
    this.loteService.create().subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        this.sucursales = []
        // BODY        
        this.minerales = response.minerales;
        this.cooperativas = response.cooperativas;
        this.molienderos = response.molienderos;
        this.socios = [];
        this.mineral = { nombre: '', abreviatura: '', foto: '/img/mineralDefecto.png' }
        this.humedadPorcentaje = 0;
        this.tara = true;
        this.pesoNeto = 0;
        this.lote = { idUsuario: this.principalService.getUsuarioStorage().id, idMoliendero: null, numLote: '', sacos: '', pesoBruto: '', humedad: 0, tara: 0 };
        // FOOTER
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
  showEdit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->edit', id);
    this.loteService.edit(id).subscribe({
      next: (response) => {

        // DATA HEADER
        this.regionales = response.regionales;
        this.loadSucursales(response.lote.idRegional);

        // DATA BODY        
        this.minerales = response.minerales;
        this.cooperativas = response.cooperativas;
        this.molienderos = response.molienderos;
        this.tara = response.lote.tara ? true : false;
        this.lote = response.lote;
        this.loadMineral(response.lote.idMineral);
        this.loadSocios(response.lote.idCooperativa);
        this.calculateHumedadPorcentaje();

        // DATA FOOTER
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
    if (this.validate()) {
      this.saving = true;
      if (this.lote.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.lote);
        this.loteService.update(this.lote).subscribe({
          next: (response) => {
            this.lote = response.lote;
            this.changeLote.emit();
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
        console.log('REQUEST->store', this.lote);
        this.loteService.store(this.lote).subscribe({
          next: (response) => {
            this.lote = response.lote;
            this.changeLote.emit();
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

  // CLOSE -> MODAL
  cancel() {
    this.estado = false;
  }

  // --------------------------------------------- 

  // LOAD -> LISTA DE SUCURSALES
  loadSucursales(idRegional: any) {
    const regionalSelected = this.regionales.find(r => r.id === idRegional);
    this.sucursales = regionalSelected ? regionalSelected.sucursales : [];
  }

  // LOAD -> MINERAL A COMPRAR
  loadMineral(idMineral: any) {
    this.mineral = this.minerales.find(m => m.id === idMineral);
  }

  // LOAD -> LISTA DE SOCIOS
  loadSocios(idCooperativa: any) {
    const cooperativaSelected = this.cooperativas.find(c => c.id === idCooperativa);
    this.socios = cooperativaSelected.socios;
  }

  // LOAD -> NUMERO DE LOTE
  loadNumLote($idSucursal: number) {
    console.log('REQUEST->getNumLote', $idSucursal);
    this.loteService.getNumLote($idSucursal).subscribe({
      next: (response) => {
        this.lote.numLote = response.numLote;
        console.log('RESPONSE->getNumLote', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->getNumLote Error en:', error.error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // CALCULATE -> HUMEDAD EN KG.
  calculateHumedadKg() {
    this.lote.humedad = Math.round(((this.humedadPorcentaje ?? 0) * parseInt(this.lote.pesoBruto)) / 100);
    this.calculatePesoNeto();
  }

  // CALCULATE -> HUMEDAD EN %.
  calculateHumedadPorcentaje() {
    this.humedadPorcentaje = Math.round((this.lote.humedad * 100) / parseInt(this.lote.pesoBruto));
    this.calculatePesoNeto()
  }

  // CALCULATE -> PESO NETO
  calculatePesoNeto() {
    if (this.tara)
      this.lote.tara = Math.round(parseInt(this.lote.pesoBruto) * 0.30 / 46);
    else
      this.lote.tara = 0;
    this.pesoNeto = parseInt(this.lote.pesoBruto) - (this.lote.tara + this.lote.humedad);
  }

  // INIT -> FECHA CON RELOJ
  private initReloj() {
    setInterval(() => {
      this.fechaHora = new Date(); // Actualiza la fecha y hora cada segundo
    }, 1000);
  }

  /* VALIDADORES
  ---------------------------------------*/
  valIdRegional(): boolean { return this.lote.idRegional ? true : false }
  valIdSucursal(): boolean { return this.lote.idSucursal ? true : false }
  valIdMineral(): boolean { return this.lote.idMineral ? true : false }
  valIdCooperativa(): boolean { return this.lote.idCooperativa ? true : false }
  valIdSocio(): boolean { return this.lote.idSocio ? true : false }
  valSacos() { const sacos = /^[\d]{0,20}$/; return (sacos.test(this.lote.sacos || '') ? true : false); }
  valPesoBruto() { const pesoBruto = /^[\d]{1,20}$/; return (pesoBruto.test(this.lote.pesoBruto) ? true : false); }

  validate() {
    return (
      this.valIdRegional() &&
      this.valIdSucursal() &&
      this.valIdMineral() &&
      this.valIdCooperativa() &&
      this.valIdSocio() &&
      this.valSacos() &&
      this.valPesoBruto());
  }
}




