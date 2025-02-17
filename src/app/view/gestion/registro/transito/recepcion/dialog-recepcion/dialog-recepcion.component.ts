/* ==================================
  CONTROLLER DIALOG RECEPCION
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { RecepcionService } from '../../../../../../service/gestion/registro/transito/Recepcion.service';
import { TableModule } from 'primeng/table';



@Component({
  selector: 'app-dialog-recepcion',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, DropdownModule, CommonModule, CheckboxModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-recepcion.component.html',
  styleUrl: './dialog-recepcion.component.css'
})
export class DialogRecepcionComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER

  // BODDY
  recepcion!: any;
  recepcionLotes!: any[];
  selected!: any[];

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  @Output() changeRecepcion = new EventEmitter();

  /* METHODS
  -------------------------*/
  // INYECCTIÓN -> DEPENDENCIAS
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private recepcionService: RecepcionService) {
  }

  // SHOW -> VIEW EDIT
  edit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->edit', id);
    this.recepcionService.edit(id).subscribe({
      next: (response) => {
        // DATA BODY                        
        this.recepcion = response.recepcion;
        this.recepcionLotes = response.recepcion.lotes;
        this.selected = response.recepcion.lotes.filter((val: any) => val.estadoRecepcion == 'RECIBIDO');
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.initReloj();
        console.log('RESPONSE->create', response);
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
    this.prepareData()
    if (this.validate()) {
      this.saving = true;
      console.log('REQUEST->update', this.recepcion);
      this.recepcionService.update(this.recepcion).subscribe({
        next: (response) => {
          this.recepcion = response.recepcion;
          this.changeRecepcion.emit();
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
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
  }

  // PREPARA -> DATA PARA ENVIAR A BACKEND.
  private prepareData() {
    this.recepcion.idUsuarioDestino = this.usuario.id;
    this.recepcion.fechaHoraDestino = this.fechaHora;
    this.recepcion.lotes = this.selected.map(d => ({ idLote: d.idLote, estadoTransferencia: 'ENVIADO', estadoRecepcion: 'RECIBIDO' }));
  }

  // CLOSE -> MODAL
  cancel() {
    this.estado = false;
  }

  // LOAD -> FECHA-HORA
  initReloj() {
    setInterval(() => {
      this.fechaHora = new Date(); // Actualiza la fecha y hora cada segundo
    }, 1000);
  }

  /* VALIDADORES
  ---------------------------------------*/
  valIdRegionalOrigen(): boolean { return this.recepcion.idRegionalOrigen ? true : false }
  valIdSucursalOrigen(): boolean { return this.recepcion.idSucursalOrigen ? true : false }
  valIdRegionalDestino(): boolean { return this.recepcion.idRegionalDestino ? true : false }
  valIdSucursalDestino(): boolean { return this.recepcion.idSucursalDestino ? true : false }
  valIdLotes(): boolean { return this.recepcion.lotes.length > 0 ? true : false }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,500}$/; if (!this.recepcion.descripcionDestino) return false; return (descripcion.test(this.recepcion.descripcionDestino) ? true : false); }

  validate() {
    return (
      this.valIdRegionalOrigen() &&
      this.valIdSucursalOrigen() &&
      this.valIdRegionalDestino() &&
      this.valIdSucursalDestino() &&
      this.valIdLotes() &&
      this.valDescripcion()
    )
  }
}