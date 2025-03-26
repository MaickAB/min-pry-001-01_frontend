/* ==================================
    CONTROLLER DIALOG SUBLOTE
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
import { DropdownModule } from 'primeng/dropdown';
import { AuxSubLote } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/AuxSubLote';
import { Descuento } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Descuento';
import { SubLoteService } from '../../../../../../../service/gestion/registro/comercializacion/compra/SubLote.service';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';
import { ComunService } from '../../../../../../../service/utility/Comun.service';

@Component({
  selector: 'app-dialog-subLote',
  standalone: true,
  imports: [ProgressSpinnerModule, CheckboxModule, TableModule, CommonModule, DialogModule, DropdownModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-subLote.component.html',
  styleUrl: './dialog-subLote.component.css'
})

export class DialogSubLoteComponent {

  /* ATTRIBUTES
  -------------------------*/
  //  HEADER 
  permissions!: any[];

  // BODY
  lote!: any;
  subLote!: any;
  auxSubLote!: AuxSubLote;
  reportPDF!: any;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  @Output() changeSubLote = new EventEmitter<Descuento>();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private subLoteService: SubLoteService,
    private comunService: ComunService) {
  }

  // SHOW -> VIEW CREATE
  showCreate(lote: any) {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    this.reportPDF = null;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('06.01');
    // BODY
    this.lote = lote;
    this.subLote = { idLote: lote.id, idSocio: 0, porcentaje: null };
    this.auxSubLote = { pesoBruto: 0, tara: 0, humedad: 0, pesoNeto: 0 };
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();

  }

  // SHOW -> VIEW SHOW
  showShow(lote: any, subLote: any) {
    this.showEdit(lote, subLote);
    this.disabled = true;
  }

  // LOAD -> DATA EDIT
  showEdit(lote: any, subLote: any) {
    this.estado = true;
    this.saving = false;
    this.disabled = false;
    this.reportPDF = null;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('06.01');
    // BODY
    this.lote = lote;
    this.subLote = subLote;
    this.calcularAuxSubLote();
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // STORE / UPDATE -> DATA
  save() {
    if (this.validate()) {
      this.saving = true;
      if (this.subLote.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.subLote);
        this.subLoteService.update(this.subLote).subscribe({
          next: (response) => {
            this.subLote = response.subLote;
            this.changeSubLote.emit();
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
        console.log('REQUEST->store', this.subLote);
        this.subLoteService.store(this.subLote).subscribe({
          next: (response) => {
            this.subLote = response.subLote;
            this.changeSubLote.emit();
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
    console.log('REQUEST->report', this.subLote.id);
    this.subLoteService.report(this.subLote.id).subscribe({
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

  // CLOSE -> VIEW
  cancel() {
    this.estado = false;
  }

  calcularAuxSubLote() {
    const roundToTwo = (num: number): number => parseFloat(num.toFixed(2));
    this.auxSubLote = {
      pesoBruto: roundToTwo(this.lote.pesoBruto * (this.subLote.porcentaje / 100)),
      tara: roundToTwo(this.lote.tara * (this.subLote.porcentaje / 100)),
      humedad: roundToTwo(this.lote.humedad * (this.subLote.porcentaje / 100)),
      pesoNeto: roundToTwo((this.lote.pesoBruto - this.lote.humedad - this.lote.tara) * (this.subLote.porcentaje / 100))
    };
  };

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
  valIdSocio(): boolean { return this.subLote.idSocio ? true : false }
  valPorcentaje() { const porcentaje = /^[\d.]{1,3}$/; return (porcentaje.test(this.subLote.porcentaje) ? true : false); }
  validate() { if (!this.subLote) { return 'SubLote Vacio.' + false; } return (this.valIdSocio() && this.valPorcentaje()); }
}
