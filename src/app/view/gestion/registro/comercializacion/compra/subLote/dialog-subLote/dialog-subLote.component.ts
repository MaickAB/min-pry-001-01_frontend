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
  lote!: any;
  subLote!: any;
  costo!: any;
  auxSubLote!: AuxSubLote;
  estado!: boolean;
  saving!: boolean;
  @Output() changeSubLote = new EventEmitter<Descuento>();

  /* METHODS
  -------------------------*/
  // INYECCIÓN -> DEPENDENCIAS
  constructor(
    private messageService: MessageService,
    private subLoteService: SubLoteService) {
  }

  // MUESTRA -> VIEW CREATE
  create(lote: any, costo: any) {
    this.lote = lote;
    this.subLote = { idLote: lote.id, idSocio: 0, porcentaje: null };
    this.costo = costo;
    this.auxSubLote = { pesoBruto: 0, tara: 0, humedad: 0, pesoNeto: 0, costoMineralSus: 0, costoMineralBs: 0, costoRegaliaSus: 0, costoRegaliaBs: 0, totalDescuentos: 0, totalLiquidacion: 0 };
    this.estado = true;
    this.saving = false;
  }

  // LOAD -> DATA EDIT
  edit(lote: any, subLote: any, costo: any) {
    this.lote = lote;
    this.subLote = subLote;
    this.costo = costo;
    this.calcularAuxSubLote();
    this.estado = true;
    this.saving = false;
  }

  // GUARDA -> REGISTRO
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
          }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
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
      pesoNeto: roundToTwo((this.lote.pesoBruto - this.lote.humedad - this.lote.tara) * (this.subLote.porcentaje / 100)),
      costoMineralSus: roundToTwo(this.costo.mineralSus * (this.subLote.porcentaje / 100)),
      costoMineralBs: roundToTwo(this.costo.mineralBs * (this.subLote.porcentaje / 100)),
      costoRegaliaSus: roundToTwo(this.costo.regaliaSus * (this.subLote.porcentaje / 100)),
      costoRegaliaBs: roundToTwo(this.costo.regaliaBs * (this.subLote.porcentaje / 100)),
      totalDescuentos: 0,
      totalLiquidacion: 0
    };


  };

  // let totalDeduccion = 0;
  // this.deduccionSelected.forEach(deduccion => {
  //   totalDeduccion += this.sublote.pesoNeto * parseFloat(deduccion.deduccion.porcentaje) / 100;
  // });
  // this.sublote.deduccion = roundToTwo(totalDeduccion);

  // let totalDescuento = 0;
  // this.descuentos.forEach(descuento => {
  //   totalDescuento += parseFloat(descuento.monto);
  // });
  // this.sublote.descuento = roundToTwo(totalDescuento);

  // this.sublote.totalDescuento = roundToTwo(this.sublote.regalia + this.sublote.deduccion + this.sublote.descuento);
  // this.sublote.totalLiquidacion = roundToTwo(this.sublote.totalPagar - this.sublote.totalDescuento);



  /* VALIDADORES
  ---------------------------------------*/
  valIdSocio(): boolean { return this.subLote.idSocio ? true : false }
  valPorcentaje() { const porcentaje = /^[\d.]{1,3}$/; return (porcentaje.test(this.subLote.porcentaje) ? true : false); }
  validate() { if (!this.subLote) { return 'SubLote Vacio.' + false; } return (this.valIdSocio() && this.valPorcentaje()); }
}
