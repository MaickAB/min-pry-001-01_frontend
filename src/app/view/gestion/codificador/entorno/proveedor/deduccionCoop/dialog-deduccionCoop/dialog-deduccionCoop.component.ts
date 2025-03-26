/* ==================================
  CONTROLLER DIALOG DEDUCCIÓN-COOP
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
import { DeduccionCoopService } from '../../../../../../../service/gestion/codificador/entorno/proveedor/DeduccionCoop.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-deduccionCoop',
  standalone: true,
  imports: [ProgressSpinnerModule, CheckboxModule, TabViewModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-deduccionCoop.component.html',
  styleUrl: './dialog-deduccionCoop.component.css'
})

export class DialogDeduccionCoopComponent {

  /* ATTRIBUTES
  -------------------------*/
  //  HEADER 
  permissions!: any[];

  // BODY
  deduccionCoop!: any;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  @Output() changeDeduccionCoop = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private deduccionCoopService: DeduccionCoopService) {
  }

  // SHOW -> VIEW CREATE
  showCreate(idCooperativa: any) {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('05.04');
    // BODY
    this.deduccionCoop = { idCooperativa: idCooperativa, codigo: '', concepto: '', porcentaje: '', voluntario: false };
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // SHOW -> VIEW SHOW
  showShow(deduccionCoop: any) {
    this.showEdit(deduccionCoop);
    this.disabled = true;
  }

  // SHOW -> VIEW EDIT
  showEdit(deduccionCoop: any) {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('05.04');
    // BODY
    this.deduccionCoop = deduccionCoop;
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // STORE / UPDATE -> DATA
  save() {
    if (this.validate()) {
      this.saving = true;
      if (this.deduccionCoop.id) {

        // SE ACTUALIZA
        console.log('REQUEST->update', this.deduccionCoop);
        this.deduccionCoopService.update(this.deduccionCoop).subscribe({
          next: (response) => {
            this.deduccionCoop = response.deduccionCoop;
            this.changeDeduccionCoop.emit();
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
        console.log('REQUEST->store', this.deduccionCoop);
        this.deduccionCoopService.store(this.deduccionCoop).subscribe({
          next: (response) => {
            this.deduccionCoop = response.deduccionCoop;
            this.changeDeduccionCoop.emit();
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
  valCodigo() { const codigo = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,20}$/; return (codigo.test(this.deduccionCoop.codigo) ? true : false); }
  valConcepto() { const concepto = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (concepto.test(this.deduccionCoop.concepto) ? true : false); }
  valPorcentaje() { const porcentaje = /^[\d.]{1,10}$/; return (porcentaje.test(this.deduccionCoop.porcentaje) ? true : false); }
  validate() { if (!this.deduccionCoop) { return 'Deducción Vacio.' + false; } return (this.valCodigo() && this.valConcepto() && this.valPorcentaje()); }
}
