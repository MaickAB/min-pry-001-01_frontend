/* ==================================
    CONTROLLER DIALOG COTIZACIÓN 15
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
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Mineral } from '../../../../../../utility/models/gestion/codificador/recursoMaterial/Mineral';
import { DropdownModule } from 'primeng/dropdown';
import { UnidadMedida } from '../../../../../../utility/models/utility/UnidadMedida';
import { Cotizacion15 } from '../../../../../../utility/models/gestion/codificador/entorno/Cotizacion15';
import { Cotizacion15Service } from '../../../../../../../service/gestion/codificador/entorno/legal/Cotizacion15.service';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-cotizacion15',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, TableModule, DropdownModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-cotizacion15.component.html',
  styleUrl: './dialog-cotizacion15.component.css'
})

export class DialogCotizacion15Component {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY  
  minerales!: Mineral[];
  unidadMedidas!: UnidadMedida[];
  detalleMinerales!: any[];
  cotizacion15!: Cotizacion15;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  activeIndex!: number;
  @Output() changeCotizacion15 = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private cotizacion15Service: Cotizacion15Service) {
  }

  // MUESTRA -> DIALOG CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    this.activeIndex = 0;
    console.log('REQUEST->create');
    this.cotizacion15Service.create().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.02');
        // BODY
        this.detalleMinerales = response.minerales.map((m: Mineral) => ({ abreviatura: m.abreviatura, nombre: m.nombre, idUnidadMedida: null, idMineral: m.id, cotizacion15: m.cotizacion15 ?? '', valorCotizacion: null, valorRegalia: null }));
        this.unidadMedidas = response.unidadMedidas;
        this.cotizacion15 = { fecha: '', observacion: '', cotizacion_mineral: [] };
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.fechaHora = this.initReloj();
        console.log('RESPONSE->create', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->create Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // SHOW -> VIEW SHOW
  showShow(id: number) {
    this.showEdit(id);
    this.disabled = true;
  }

  // MUESTRA -> DIALOG EDIT
  showEdit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    this.activeIndex = 0;
    console.log('REQUEST->edit', id);
    this.cotizacion15Service.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.02');
        // BODY        
        this.minerales = response.minerales;
        this.unidadMedidas = response.unidadMedidas;
        this.cotizacion15 = response.cotizacion15;
        this.updateDetalles();
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.fechaHora = this.initReloj();
        console.log('RESPONSE->edit', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->edit Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
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
      if (this.cotizacion15.id) {

        // SE ACTUALIZA
        console.log('REQUEST->update', this.cotizacion15);
        this.cotizacion15Service.update(this.cotizacion15).subscribe({
          next: (response) => {
            this.cotizacion15 = response.cotizacion;
            this.changeCotizacion15.emit();
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
            console.log('RESPONSE->update', response);
            this.estado = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->update Error en:', error.error);
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      } else {

        // SE GUARDA
        console.log('REQUEST->store', this.cotizacion15);
        this.cotizacion15Service.store(this.cotizacion15).subscribe({
          next: (response) => {
            this.cotizacion15 = response.cotizacion15;
            this.changeCotizacion15.emit();
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
            console.log('RESPONSE->store', response);
            this.estado = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->store Error en:', error.error);
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR REQUEST', detail: 'Datos Incorrectos...!!' });
      console.log('Datos Incorrectos...!!')
    }
  }

  // GENERATE -> REPORT
  report() {
    alert('showReport');
  }

  // CLOSE -> VIEW
  cancel() {
    this.estado = false;
  }

  // ---------------------------------------------

  // PREPARE -> DATA FOR BACKEND.
  private prepareData() {
    this.cotizacion15.cotizacion_mineral = this.detalleMinerales.map(d => ({ idUnidadMedida: d.idUnidadMedida, idMineral: d.idMineral, valorCotizacion: d.valorCotizacion, valorRegalia: d.valorRegalia }));
  }

  // UPDATE -> VALORES DE COTIZACIONES
  updateDetalles() {
    this.detalleMinerales = [];
    this.minerales.forEach(mineral => {
      this.cotizacion15.cotizacion_mineral.forEach(cm => {
        if (mineral.id == cm.idMineral) {
          this.detalleMinerales.push({ abreviatura: mineral.abreviatura, nombre: mineral.nombre, cotizacion15: mineral.cotizacion15, idUnidadMedida: cm.idUnidadMedida, idMineral: cm.idMineral, valorCotizacion: cm.valorCotizacion, valorRegalia: cm.valorRegalia });
        }
      })
    })
  }

  // INIT -> FECHA CON RELOJ
  private initReloj() {
    setInterval(() => {
      this.fechaHora = new Date(); // Actualiza la fecha y hora cada segundo
    }, 1000);
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }

  /* VALIDADORES
  ---------------------------------------*/
  valFecha() { const fecha = /^[\d/-]{1,10}$/; return (fecha.test(this.cotizacion15.fecha) ? true : false); }
  valObservacion() { const observacion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (observacion.test(this.cotizacion15.observacion) ? true : false); }
  validate() { if (!this.cotizacion15) { return 'Cotizacion Vacia.' + false; } return (this.valFecha() && this.valObservacion()); }
}
