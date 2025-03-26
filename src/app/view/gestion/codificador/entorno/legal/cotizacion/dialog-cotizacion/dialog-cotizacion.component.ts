/* ==================================
    CONTROLLER DIALOG COTIZACIÓN
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
import { Cotizacion } from '../../../../../../utility/models/gestion/codificador/entorno/Cotizacion';
import { Mineral } from '../../../../../../utility/models/gestion/codificador/recursoMaterial/Mineral';
import { CotizacionService } from '../../../../../../../service/gestion/codificador/entorno/legal/Cotizacion.service';
import { Divisa } from '../../../../../../utility/models/utility/Divisa';
import { DropdownModule } from 'primeng/dropdown';
import { UnidadMedida } from '../../../../../../utility/models/utility/UnidadMedida';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-cotizacion',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, TableModule, ConfirmDialogModule, DropdownModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-cotizacion.component.html',
  styleUrl: './dialog-cotizacion.component.css'
})

export class DialogCotizacionComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY  
  minerales!: Mineral[];
  unidadMedidas!: UnidadMedida[];
  divisas!: Mineral[];
  detalleMinerales!: any[];
  detalleDivisas!: any[];
  cotizacion!: Cotizacion;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  activeIndex!: number;
  @Output() changeCotizacion = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private cotizacionService: CotizacionService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    this.activeIndex = 0;
    console.log('REQUEST->create');
    this.cotizacionService.create().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.01');
        // BODY
        this.detalleMinerales = response.minerales.map((m: Mineral) => ({ abreviatura: m.abreviatura, nombre: m.nombre, idUnidadMedida: null, idMineral: m.id, cotizacion: m.cotizacion ?? '', valorCotizacion: null }));
        this.detalleDivisas = response.divisas.map((d: Divisa) => ({ abreviatura: d.abreviatura, nombre: d.nombre, idDivisa: d.id, cotizacion: d.cotizacion ?? '', valor: null }));
        this.unidadMedidas = response.unidadMedidas;
        this.cotizacion = { fecha: '', observacion: '', cotizacion_mineral: [], cotizacion_divisa: [] };
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

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    this.activeIndex = 0;
    console.log('REQUEST->edit', id);
    this.cotizacionService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.01');
        // BODY                
        this.minerales = response.minerales;
        this.unidadMedidas = response.unidadMedidas;
        this.divisas = response.divisas;
        this.cotizacion = response.cotizacion;
        this.updateData();
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
      if (this.cotizacion.id) {

        // SE ACTUALIZA
        console.log('REQUEST->update', this.cotizacion);
        this.cotizacionService.update(this.cotizacion).subscribe({
          next: (response) => {
            this.cotizacion = response.cotizacion;
            this.changeCotizacion.emit();
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
        console.log('REQUEST->store', this.cotizacion);
        this.cotizacionService.store(this.cotizacion).subscribe({
          next: (response) => {
            this.cotizacion = response.cotizacion;
            this.changeCotizacion.emit();
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
    this.cotizacion.cotizacion_mineral = this.detalleMinerales.map(d => ({ idUnidadMedida: d.idUnidadMedida, idMineral: d.idMineral, valorCotizacion: d.valorCotizacion }));
    this.cotizacion.cotizacion_divisa = this.detalleDivisas.map(d => ({ idDivisa: d.idDivisa, valor: d.valor }));
  }

  // UPDATE -> VALORES DE COTIZACIONES
  updateData() {
    this.detalleMinerales = [];
    this.minerales.forEach(mineral => {
      this.cotizacion.cotizacion_mineral.forEach(cm => {
        if (mineral.id == cm.idMineral) {
          this.detalleMinerales.push({ abreviatura: mineral.abreviatura, nombre: mineral.nombre, cotizacion: mineral.cotizacion, idUnidadMedida: cm.idUnidadMedida, idMineral: cm.idMineral, valorCotizacion: cm.valorCotizacion });
        }
      })
    })

    this.detalleDivisas = [];
    this.divisas.forEach(divisa => {
      this.cotizacion.cotizacion_divisa.forEach(v => {
        if (divisa.id == v.idDivisa) {
          this.detalleDivisas.push({ abreviatura: divisa.abreviatura, nombre: divisa.nombre, cotizacion: divisa.cotizacion, idDivisa: divisa.id, valor: v.valor });
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
  valFecha() { const fecha = /^[\d/-]{1,10}$/; return (fecha.test(this.cotizacion.fecha) ? true : false); }
  valObservacion() { const observacion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (observacion.test(this.cotizacion.observacion) ? true : false); }
  validate() { if (!this.cotizacion) { return 'Cotizacion Vacia.' + false; } return (this.valFecha() && this.valObservacion()); }
}
