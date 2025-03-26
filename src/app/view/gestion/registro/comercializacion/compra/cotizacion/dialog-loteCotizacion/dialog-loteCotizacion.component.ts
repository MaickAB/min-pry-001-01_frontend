/* ==================================
    CONTROLLER DIALOG COSTO
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
import { LoteCotizacionService } from '../../../../../../../service/gestion/registro/comercializacion/compra/LoteCotizacion.service';


@Component({
  selector: 'app-dialog-loteCotizacion',
  standalone: true,
  imports: [ProgressSpinnerModule, CheckboxModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-loteCotizacion.component.html',
  styleUrl: './dialog-loteCotizacion.component.css'
})

export class DialogLoteCotizacionComponent {

  /* ATTRIBUTES
-------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  cotizacion15!: any;
  cotizacion!: any;
  loteCotizacion!: any;
  fechaCotizacion15!: any;
  fechaCotizacion!: any;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  saving!: boolean;
  loading!: boolean;
  loadingCot!: boolean;
  loadingCot15!: boolean;
  @Output() changeLoteCotizacion = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private loteCotizacionService: LoteCotizacionService) {
  }

  // SHOW -> VIEW CREATE  
  showCreate(idLote: number) {
    this.estado = true;
    this.loading = true;
    this.loadingCot = false;
    this.loadingCot15 = false;
    this.saving = false;
    console.log('REQUEST->create', idLote);
    this.loteCotizacionService.create(idLote).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY        
        this.cotizacion15 = response.cotizacion15;
        this.cotizacion = response.cotizacion;
        this.fechaCotizacion15 = response.cotizacion15.fecha;
        this.fechaCotizacion = response.cotizacion.fecha;
        this.loteCotizacion = { idLote: idLote, idCotizacion15: this.cotizacion15.id, idCotizacion: this.cotizacion.id }
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
  showEdit(loteCotizacion: any) {
    this.estado = true;
    this.loading = false;
    this.loadingCot = false;
    this.loadingCot15 = false;
    this.saving = false;
    // HEADER
    this.permissions = this.principalService.getPermissionsStorage('06.01');
    // BODY    
    this.cotizacion15 = loteCotizacion.cotizacion15;
    this.cotizacion = loteCotizacion.cotizacion;
    this.fechaCotizacion15 = loteCotizacion.cotizacion15.fecha;
    this.fechaCotizacion = loteCotizacion.cotizacion.fecha;
    this.loteCotizacion = { id: loteCotizacion.id, idLote: loteCotizacion.idLote, idCotizacion15: loteCotizacion.idCotizacion15, idCotizacion: loteCotizacion.idCotizacion };
    // FOOTER
    this.usuario = this.principalService.getUsuarioStorage();
    this.fechaHora = this.initReloj();
  }

  // GET -> COTIZACION BY FECHA
  getCotizacion(fecha: any) {
    this.loadingCot = true;
    let data = { idLote: this.loteCotizacion.idLote, 'fecha': fecha }
    console.log('REQUEST->getCotizacion', data);
    this.loteCotizacionService.getCotizacion(data).subscribe({
      next: (response) => {
        if (response.cotizacion) {
          this.cotizacion = response.cotizacion;
          this.fechaCotizacion = response.cotizacion.fecha;
          this.loteCotizacion.idCotizacion = response.cotizacion.id;
        } else {
          this.fechaCotizacion = this.cotizacion.fecha; // Restaurar fecha anterior
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Cotización no encontrada.' });

        }
        console.log('RESPONSE->getCotizacion', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->create Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
        this.loadingCot = false;
      }
    });
  }

  // GET -> COTIZACION-15 BY FECHA
  getCotizacion15(fecha: any) {
    this.loadingCot15 = true;
    let data = { idLote: this.loteCotizacion.idLote, 'fecha': fecha }
    console.log('REQUEST->getCotizacion', data);
    this.loteCotizacionService.getCotizacion15(data).subscribe({
      next: (response) => {
        if (response.cotizacion15) {
          this.cotizacion15 = response.cotizacion15;
          this.fechaCotizacion15 = response.cotizacion15.fecha;
          this.loteCotizacion.idCotizacion15 = response.cotizacion15.id;
        } else {
          this.fechaCotizacion15 = this.cotizacion15.fecha; // Restaurar fecha anterior
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Cotización no encontrada.' });

        }
        console.log('RESPONSE->getCotizacion', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->create Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
        this.loadingCot15 = false;
      }
    });
  }

  // STORE / UPDATE -> DATA
  save() {
    if (this.validate()) {
      this.saving = true;
      if (this.loteCotizacion.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.loteCotizacion);
        this.loteCotizacionService.update(this.loteCotizacion).subscribe({
          next: (response) => {
            this.loteCotizacion = response.loteCotizacion;
            this.changeLoteCotizacion.emit();
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
        console.log('REQUEST->store', this.loteCotizacion);
        this.loteCotizacionService.store(this.loteCotizacion).subscribe({
          next: (response) => {
            this.loteCotizacion = response.loteCotizacion;
            this.changeLoteCotizacion.emit();
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
  valIdLote(): boolean { return this.loteCotizacion.idLote ? true : false }
  valIdCotizacion15(): boolean { return this.loteCotizacion.idCotizacion15 ? true : false }
  valIdCotizacion(): boolean { return this.loteCotizacion.idCotizacion ? true : false }
  validate() { return (this.valIdLote() && this.valIdCotizacion15() && this.valIdCotizacion()); }
}
