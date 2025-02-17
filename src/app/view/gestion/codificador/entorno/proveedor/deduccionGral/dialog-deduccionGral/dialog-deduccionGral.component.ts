/* ==================================
      CONTROLLER DIALOG SOCIO
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
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { DeduccionGralService } from '../../../../../../../service/gestion/codificador/entorno/legal/DeduccionGral.service';

@Component({
  selector: 'app-dialog-deduccionGral',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-deduccionGral.component.html',
  styleUrl: './dialog-deduccionGral.component.css'
})

export class DialogDeduccionGralComponent {

  /* ATTRIBUTES
  -------------------------*/
  deduccionGral!: any;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  @Output() changeDeduccionGral = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private deduccionGralService: DeduccionGralService) {
  }

  // SHOW -> VIEW CREATE
  showCreate(idCooperativa: any) {
    this.estado = true;
    this.saving = false;
    // HEADER
    // BODY
    this.deduccionGral = { codigo: '', concepto: '', porcentaje: '', voluntario: false, idCooperativa: idCooperativa };
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // SHOW -> VIEW EDIT
  showEdit(deduccion: any) {
    this.estado = true;
    this.saving = false;
    // HEADER
    // BODY
    this.deduccionGral = deduccion;
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // STORE / UPDATE -> DATA
  save() {
    if (this.validate()) {
      this.saving = true;
      if (this.deduccionGral.id) {

        // SE ACTUALIZA
        console.log('REQUEST->update', this.deduccionGral);
        this.deduccionGralService.update(this.deduccionGral).subscribe({
          next: (response) => {
            this.deduccionGral = response.deduccionGral;
            this.changeDeduccionGral.emit();
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
        console.log('REQUEST->store', this.deduccionGral);
        this.deduccionGralService.store(this.deduccionGral).subscribe({
          next: (response) => {
            this.deduccionGral = response.deduccionGral;
            this.changeDeduccionGral.emit();
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
      this.messageService.add({ severity: 'error', summary: 'ERROR REQUEST', detail: 'Datos Incorrectos...!!' });
      console.log('Datos Incorrectos...!!')
    }
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

  /* VALIDADORES
   ---------------------------------------*/
  valCodigo() { const codigo = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,20}$/; return (codigo.test(this.deduccionGral.codigo) ? true : false); }
  valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.deduccionGral.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.deduccionGral.descripcion) ? true : false); }
  valFono() { const fono = /^[\d +-]{0,20}$/; return (fono.test(this.deduccionGral.fono) ? true : false); }
  validate() { if (!this.deduccionGral) { return 'Cliente Vacio.' + false; } return (this.valCodigo() && this.valNombre() && this.valDescripcion() && this.valCodigo()); }
}
