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
  descuento!: Descuento;
  estado!: boolean;
  saving!: boolean;
  @Output() changeDescuento = new EventEmitter<Descuento>();

  /* METHODS
  -------------------------*/
  // INYECCIÓN -> DEPENDENCIAS
  constructor(
    private messageService: MessageService,
    private descuentoService: DescuentoService) {
  }

  // MUESTRA -> VIEW CREATE
  create(idLote: any) {
    this.descuento = { idLote: idLote, monto: '', concepto: '' };
    this.estado = true;
    this.saving = false;
  }

  // LOAD -> DATA EDIT
  edit(descuento: Descuento) {
    this.descuento = descuento;
    this.estado = true;
    this.saving = false;
  }

  // GUARDA -> REGISTRO
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
          }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
  }

  // CIERRA -> MODAL
  cancel() {
    this.estado = false;
  }

  /* VALIDADORES
  ---------------------------------------*/
  valConcepto() { const concepto = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (concepto.test(this.descuento.concepto) ? true : false); }
  valMonto() { const porcentaje = /^[\d.]{1,10}$/; return (porcentaje.test(this.descuento.monto) ? true : false); }
  validate() { if (!this.descuento) { return 'Descuento Vacio.' + false; } return (this.valConcepto() && this.valMonto()); }
}
