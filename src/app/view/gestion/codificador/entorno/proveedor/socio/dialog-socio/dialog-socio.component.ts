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
import { Socio } from '../../../../../../utility/models/gestion/codificador/entorno/Socio';
import { SocioService } from '../../../../../../../service/gestion/codificador/entorno/proveedor/Socio.service';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-socio',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-socio.component.html',
  styleUrl: './dialog-socio.component.css'
})

export class DialogSocioComponent {

  /* ATTRIBUTES
  -------------------------*/
  //  HEADER 
  permissions!: any[];

  // BODY
  socio!: Socio;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  @Output() changeSocio = new EventEmitter<Socio>();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private socioService: SocioService) {
  }

  // SHOW -> VIEW CREATE
  showCreate(idCooperativa: any) {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('05.04');
    // BODY
    this.socio = { codigo: '', nombre: '', descripcion: '', fono: '', idCooperativa: idCooperativa };
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // SHOW -> VIEW SHOW
  showShow(socio: Socio) {
    this.showEdit(socio);
    this.disabled = true;
  }

  // SHOW -> VIEW EDIT
  showEdit(socio: Socio) {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('05.04');
    // BODY
    this.socio = socio;
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // STORE / UPDATE -> DATA
  save() {
    if (this.validate()) {
      this.saving = true;
      if (this.socio.id) {

        // SE ACTUALIZA
        console.log('REQUEST->update', this.socio);
        this.socioService.update(this.socio).subscribe({
          next: (response) => {
            this.socio = response.socio;
            this.changeSocio.emit();
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
        console.log('REQUEST->store', this.socio);
        this.socioService.store(this.socio).subscribe({
          next: (response) => {
            this.socio = response.socio;
            this.changeSocio.emit();
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
  valCodigo() { const codigo = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,20}$/; return (codigo.test(this.socio.codigo) ? true : false); }
  valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.socio.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.socio.descripcion) ? true : false); }
  valFono() { const fono = /^[\d +-]{0,20}$/; return (fono.test(this.socio.fono || '') ? true : false); }
  validate() {
    return (
      this.valCodigo() &&
      this.valNombre() &&
      this.valDescripcion() &&
      this.valFono());
  }
}
