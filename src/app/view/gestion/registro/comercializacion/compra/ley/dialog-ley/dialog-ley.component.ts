/* ==================================
    CONTROLLER DIALOG LEYES
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
import { LeyService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Ley.service';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dialog-ley',
  standalone: true,
  imports: [ProgressSpinnerModule, CheckboxModule, TableModule, CommonModule, DialogModule, FormsModule, DropdownModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-ley.component.html',
  styleUrl: './dialog-ley.component.css'
})

export class DialogLeyComponent {

  /* ATTRIBUTES
  -------------------------*/
  /* ATTRIBUTES
-------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  solicitantes!: any[];
  laboratorios!: any[];
  unidadMedidaLeys!: any[];
  ley!: any;
  leyDetalles!: any[];

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // SATATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;

  @Output() changeLey = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private leyService: LeyService) {
  }

  // SHOW -> VIEW CREATE
  showCreate(lote: any) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    console.log('REQUEST->create');
    this.leyService.create().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY
        this.solicitantes = response.solicitantes;
        this.laboratorios = response.laboratorios;
        this.unidadMedidaLeys = response.unidadMedidaLeys;
        this.ley = { idLote: lote.id, idLaboratorio: null, detalles: [] };
        if (lote.mineral.minerales.length)
          this.leyDetalles = lote.mineral.minerales.map((m: any) => ({ nombre: m.mineral.nombre, abreviatura: m.mineral.abreviatura, idMineral: m.mineral.id, valor: null, idUnidadMedidaLey: null }));
        else
          this.leyDetalles = [{ nombre: lote.mineral.nombre, abreviatura: lote.mineral.abreviatura, idMineral: lote.mineral.id, valor: null, idUnidadMedidaLey: null }];
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
  showShow(ley: any) {
    this.showEdit(ley);
    this.disabled = true;
  }

  // SHOW -> VIEW EDIT
  showEdit(ley: any) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    console.log('REQUEST->edit', ley.id);
    this.leyService.edit(ley.id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY
        this.solicitantes = response.solicitantes;
        this.laboratorios = response.laboratorios;
        this.unidadMedidaLeys = response.unidadMedidaLeys;
        this.ley = ley;
        this.updateData(ley.detalles);
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
      if (this.ley.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.ley);
        this.leyService.update(this.ley).subscribe({
          next: (response) => {
            this.ley = response.ley;
            this.changeLey.emit();
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
        console.log('REQUEST->store', this.ley);
        this.leyService.store(this.ley).subscribe({
          next: (response) => {
            this.ley = response.ley;
            this.changeLey.emit();
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

  // PREPARE -> DATA PARA ENVIAR A BACKEND.
  private prepareData() {
    this.ley.detalles = this.leyDetalles.map(d => ({ idMineral: d.idMineral, idUnidadMedidaLey: d.idUnidadMedidaLey, valor: d.valor }));
  }

  // UPDATE -> DATA SELECTED
  private updateData(minerales: any) {
    this.leyDetalles = [];
    minerales.forEach((mineral: any) => {
      this.leyDetalles.push({ nombre: mineral.mineral.nombre, abreviatura: mineral.mineral.abreviatura, idMineral: mineral.idMineral, valor: mineral.valor, idUnidadMedidaLey: mineral.idUnidadMedidaLey });
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
  valIdSolicitante(): boolean { return this.ley.idSolicitante ? true : false }
  // valIdLaboratorio(): boolean { return this.ley.idLaboratorio ? true : false }
  // valValorLey() { const porcentaje = /^[\d.]{1,10}$/; return (porcentaje.test(this.ley.valorLey) ? true : false); }
  validate() { if (!this.ley) { return 'Ley Vacio.' + false; } return (this.valIdSolicitante()) }
}
