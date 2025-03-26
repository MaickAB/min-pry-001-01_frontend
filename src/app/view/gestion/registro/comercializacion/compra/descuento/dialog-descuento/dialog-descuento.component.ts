/* ==================================
    CONTROLLER DIALOG DESCUENTO
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
import { Descuento } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Descuento';
import { DescuentoService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Descuento.service';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';
import { ComunService } from '../../../../../../../service/utility/Comun.service';


@Component({
  selector: 'app-dialog-descuento',
  standalone: true,
  imports: [ProgressSpinnerModule, CheckboxModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-descuento.component.html',
  styleUrl: './dialog-descuento.component.css'
})

export class DialogDescuentoComponent {

  /* ATTRIBUTES
  -------------------------*/
  //  HEADER 
  permissions!: any[];

  // BODY
  descuento!: any;
  reportPDF!: any;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  @Output() changeDescuento = new EventEmitter<Descuento>();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private descuentoService: DescuentoService,
    private comunService: ComunService) {
  }

  // SHOW -> VIEW CREATE
  showCreate(idLote: any) {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('06.01');
    // BODY
    this.descuento = { idLote: idLote, monto: '', concepto: '' };
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // SHOW -> VIEW SHOW
  showShow(descuento: Descuento) {
    this.showEdit(descuento);
    this.disabled = true;
  }

  // SHOW -> VIEW EDIT
  showEdit(descuento: Descuento) {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('06.01');
    // BODY
    this.descuento = descuento;
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // STORE / UPDATE -> DATA
  save() {
    if (this.validate()) {
      this.saving = true;
      if (this.descuento.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.descuento);
        this.descuentoService.update(this.descuento).subscribe({
          next: (response) => {
            this.descuento = response.descuento;
            this.changeDescuento.emit();
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
        console.log('REQUEST->store', this.descuento);
        this.descuentoService.store(this.descuento).subscribe({
          next: (response) => {
            this.descuento = response.descuento;
            this.changeDescuento.emit();
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

  // GENERATE -> REPORT
  report() {
    this.loading = true;
    console.log('REQUEST->report', this.descuento.id);
    this.descuentoService.report(this.descuento.id).subscribe({
      next: (response) => {
        this.reportPDF = this.comunService.formatPDF(response.reportPDF);
        console.log('RESPONSE->report', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->report Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // CIERRA -> MODAL
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
  valConcepto() { const concepto = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (concepto.test(this.descuento.concepto) ? true : false); }
  valMonto() { const porcentaje = /^[\d.]{1,10}$/; return (porcentaje.test(this.descuento.monto) ? true : false); }
  validate() { if (!this.descuento) { return 'Descuento Vacio.' + false; } return (this.valConcepto() && this.valMonto()); }
}
