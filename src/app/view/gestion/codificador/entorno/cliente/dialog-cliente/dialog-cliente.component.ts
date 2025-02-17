/* ==================================
      CONTROLLER DIALOG CLIENTE
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
import { Cliente } from '../../../../../utility/models/gestion/codificador/entorno/Cliente';
import { ClienteService } from '../../../../../../service/gestion/codificador/entorno/Cliente.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';

@Component({
  selector: 'app-dialog-cliente',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, DropdownModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-cliente.component.html',
  styleUrl: './dialog-cliente.component.css'
})

export class DialogClienteComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  regionales!: Regional[];

  // BODY
  cliente!: Cliente;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  @Output() changeCliente = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private clienteService: ClienteService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->create');
    this.clienteService.create().subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY        
        this.cliente = { codigo: '', nombre: '', descripcion: '', fono: '' };
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
    this.clienteService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY        
        this.cliente = response.cliente;
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
      if (this.cliente.id) {

        // SE ACTUALIZA
        console.log('REQUEST->update', this.cliente);
        this.clienteService.update(this.cliente).subscribe({
          next: (response) => {
            this.cliente = response.cliente;
            this.changeCliente.emit();
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
        console.log('REQUEST->store', this.cliente);
        this.clienteService.store(this.cliente).subscribe({
          next: (response) => {
            this.cliente = response.cliente;
            this.changeCliente.emit();
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
  valIdRegional(): boolean { return this.cliente.idRegional ? true : false }
  valCodigo() { const codigo = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,20}$/; return (codigo.test(this.cliente.codigo) ? true : false); }
  valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.cliente.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.cliente.descripcion) ? true : false); }
  valFono() { const fono = /^[\d +-]{0,20}$/; return (fono.test(this.cliente.fono || '') ? true : false); }
  validate() { if (!this.cliente) { return 'Cliente Vacio.' + false; } return (this.valCodigo() && this.valNombre() && this.valDescripcion() && this.valCodigo()); }
}
