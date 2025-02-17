/* ==================================
    CONTROLLER DIALOG LABORATORIO
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
import { Laboratorio } from '../../../../../utility/models/gestion/codificador/entorno/Laboratorio';
import { LaboratorioService } from '../../../../../../service/gestion/codificador/entorno/Laboratorio.service';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';

@Component({
  selector: 'app-dialog-laboratorio',
  standalone: true,
  imports: [ProgressSpinnerModule, DropdownModule, TabViewModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-laboratorio.component.html',
  styleUrl: './dialog-laboratorio.component.css'
})

export class DialogLaboratorioComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  regionales!: Regional[];

  // BODY
  laboratorio!: Laboratorio;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  @Output() changeLaboratorio = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private laboratorioService: LaboratorioService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->create');
    this.laboratorioService.create().subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY        
        this.laboratorio = { codigo: '', nombre: '', descripcion: '', fono: '' };
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.fechaHora = this.initReloj();
        console.log('RESPONSE->edit', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->edit Error en:', error.error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->edit', id);
    this.laboratorioService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY        
        this.laboratorio = response.laboratorio;
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.fechaHora = this.initReloj();
        console.log('RESPONSE->edit', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->edit Error en:', error.error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // STORE / UPDATE -> DATA
  save() {
    if (this.validate()) {
      this.saving = true;
      if (this.laboratorio.id) {

        // SE ACTUALIZA
        console.log('REQUEST->update', this.laboratorio);
        this.laboratorioService.update(this.laboratorio).subscribe({
          next: (response) => {
            this.laboratorio = response.laboratorio;
            this.changeLaboratorio.emit();
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
        console.log('REQUEST->store', this.laboratorio);
        this.laboratorioService.store(this.laboratorio).subscribe({
          next: (response) => {
            this.laboratorio = response.laboratorio;
            this.changeLaboratorio.emit();
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
  valIdRegional(): boolean { return this.laboratorio.idRegional ? true : false }
  valCodigo() { const codigo = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,20}$/; return (codigo.test(this.laboratorio.codigo) ? true : false); }
  valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.laboratorio.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.laboratorio.descripcion) ? true : false); }
  valFono() { const fono = /^[\d +-]{0,20}$/; return (fono.test(this.laboratorio.fono || '') ? true : false); }
  validate() { if (!this.laboratorio) { return 'Cliente Vacio.' + false; } return (this.valCodigo() && this.valNombre() && this.valDescripcion() && this.valCodigo()); }
}
