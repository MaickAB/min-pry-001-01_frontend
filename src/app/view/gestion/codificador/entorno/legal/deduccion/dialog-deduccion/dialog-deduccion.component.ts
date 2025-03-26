/* ==================================
    CONTROLLER DIALOG DEDUCCION
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
import { Deduccion } from '../../../../../../utility/models/gestion/codificador/entorno/Deduccion';
import { DeduccionService } from '../../../../../../../service/gestion/codificador/entorno/legal/Deduccion.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-deduccion',
  standalone: true,
  imports: [ProgressSpinnerModule, CheckboxModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-deduccion.component.html',
  styleUrl: './dialog-deduccion.component.css'
})

export class DialogDeduccionComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  deduccion!: Deduccion;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  @Output() changeDeduccion = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private deduccionService: DeduccionService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('05.03');
    // BODY        
    this.deduccion = { codigo: '', concepto: '', porcentaje: '' };
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    console.log('REQUEST->edit', id);
    this.deduccionService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.03');
        // BODY        
        this.deduccion = response.deduccion;
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

  // SHOW -> VIEW SHOW
  showShow(id: number) {
    this.showEdit(id);
    this.disabled = true;
  }

  // STORE / UPDATE -> DATA
  save() {
    if (this.validate()) {
      this.saving = true;
      if (this.deduccion.id) {

        // SE ACTUALIZA
        console.log('REQUEST->update', this.deduccion);
        this.deduccionService.update(this.deduccion).subscribe({
          next: (response) => {
            this.deduccion = response.deduccion;
            this.changeDeduccion.emit();
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
        console.log('REQUEST->store', this.deduccion);
        this.deduccionService.store(this.deduccion).subscribe({
          next: (response) => {
            this.deduccion = response.deduccion;
            this.changeDeduccion.emit();
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
  valCodigo() { const codigo = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,20}$/; return (codigo.test(this.deduccion.codigo) ? true : false); }
  valConcepto() { const concepto = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (concepto.test(this.deduccion.concepto) ? true : false); }
  valPorcentaje() { const porcentaje = /^[\d.]{1,10}$/; return (porcentaje.test(this.deduccion.porcentaje) ? true : false); }
  validate() { if (!this.deduccion) { return 'Deducción Vacio.' + false; } return (this.valCodigo() && this.valConcepto() && this.valPorcentaje()); }
}
