/* =====================================
   CONTROLLER MODAL ADD-LOTE
===================================== */
import { Component, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Lote } from '../../../../../utility/models/gestion/registro/comercializacion/compra/Lote';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-modal-addLote',
  standalone: true,
  imports: [ProgressSpinnerModule, DropdownModule, CheckboxModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './modal-addLote.component.html',
  styleUrl: './modal-addLote.component.css'
})

export class ModalAddLoteComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER

  // BODY
  lotes!: Lote[];
  selected!: Lote[];

  // STATE
  estado!: boolean;
  saving!: boolean;
  @Output() changeAddLote = new EventEmitter<Lote[]>();

  /* METHODS
  -------------------------*/
  // SHOW -> VIEW CREATE
  create(lotes: any, lotesAgredados: any) {
    this.lotes = lotes;
    this.selected = lotesAgredados;
    this.estado = true;
    this.saving = false;
  }

  // ADD -> RECORDS
  save() {
    this.changeAddLote.emit(this.selected);
    this.estado = false;
  }

  // CLOSE -> MODAL
  cancel() {
    this.estado = false;
  }

  /* VALIDADORES
  ---------------------------------------*/
  // valConcepto() { const concepto = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (concepto.test(this.descuento.concepto) ? true : false); }
  // valMonto() { const porcentaje = /^[\d.]{1,10}$/; return (porcentaje.test(this.descuento.monto) ? true : false); }
  // validate() { if (!this.descuento) { return 'Descuento Vacio.' + false; } return (this.valConcepto() && this.valMonto()); }
}
