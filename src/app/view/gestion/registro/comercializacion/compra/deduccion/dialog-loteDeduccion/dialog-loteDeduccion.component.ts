/* ==================================
  CONTROLLER DIALOG LOTE-DEDUCCIÓN    
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
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';
import { LoteDeduccionService } from '../../../../../../../service/gestion/registro/comercializacion/compra/LoteDeduccion.service';


@Component({
  selector: 'app-dialog-loteDeduccion',
  standalone: true,
  imports: [ProgressSpinnerModule, CheckboxModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-loteDeduccion.component.html',
  styleUrl: './dialog-loteDeduccion.component.css'
})

export class DialogLoteDeduccionComponent {

  /* ATTRIBUTES
-------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  deducciones!: any[];
  deduccionesCoop!: any[];
  selectedDeducciones!: any[];
  selectedDeduccionesCoop!: any[];
  loteDeduccion!: any;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  @Output() changeLoteDeduccion = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private loteDeduccionService: LoteDeduccionService) {
  }

  // SHOW -> VIEW CREATE
  showCreate(idLote: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    console.log('REQUEST->create');
    this.loteDeduccionService.create(idLote).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY        
        this.deducciones = response.deducciones;
        this.deduccionesCoop = response.deduccionesCoop;
        this.loteDeduccion = { idLote: idLote, deducciones: [], deduccionesCoop: [] }
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

  // SHOW -> VIEW EDIT
  showEdit(idLote: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    console.log('REQUEST->edit');
    this.loteDeduccionService.edit(idLote).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY        
        console.log('RESPONSE->edit', response);
        this.deducciones = response.deducciones;
        this.deduccionesCoop = response.deduccionesCoop;
        this.loteDeduccion = response.loteDeduccion;
        this.loteDeduccion.id = 'Aux'; // ID-AUX PARA DISTINGUIR STORE/UPDATE
        this.updateData();
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

  // STORE / UPDATE -> DATA
  save() {
    this.prepareData()
    if (true) {
      this.saving = true;
      if (this.loteDeduccion.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.loteDeduccion);
        this.loteDeduccionService.update(this.loteDeduccion).subscribe({
          next: (response) => {
            this.loteDeduccion = response.data;
            this.changeLoteDeduccion.emit();
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
        console.log('REQUEST->store', this.loteDeduccion);
        this.loteDeduccionService.store(this.loteDeduccion).subscribe({
          next: (response) => {
            this.loteDeduccion = response.data;
            this.changeLoteDeduccion.emit();
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
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
  }

  // CLOSE -> MODAL
  cancel() {
    this.estado = false;
  }

  // PREPARE -> DATA FOR BACKEND.
  private prepareData() {
    this.loteDeduccion.deducciones = this.selectedDeducciones.map((sel: any) => ({ id: sel.id }));
    this.loteDeduccion.deduccionesCoop = this.selectedDeduccionesCoop.map((sel: any) => ({ id: sel.id }));
  }

  // UPDATE -> VALORES DE COTIZACIONES
  updateData() {

    // SE ACTUALIZA LAS DEDUCCIONES SELECCIONADAS
    this.selectedDeducciones = [];
    this.deducciones.forEach(d => {
      this.loteDeduccion.deducciones.forEach((ld: any) => {
        if (d.id == ld.idDeduccion) {
          this.selectedDeducciones.push(d);
        }
      })
    })

    // SE ACTUALIZA LAS DEDUCCIONES-COOP SELECCIONADAS
    this.selectedDeduccionesCoop = [];
    this.deduccionesCoop.forEach(dc => {
      this.loteDeduccion.deduccionesCoop.forEach((ldc: any) => {
        if (dc.id == ldc.idDeduccionCoop) {
          this.selectedDeduccionesCoop.push(dc);
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
  // valConcepto() { const concepto = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (concepto.test(this.descuento.concepto) ? true : false); }
  // valMonto() { const porcentaje = /^[\d.]{1,10}$/; return (porcentaje.test(this.descuento.monto) ? true : false); }
  // validate() { if (!this.descuento) { return 'Descuento Vacio.' + false; } return (this.valConcepto() && this.valMonto()); }
}
