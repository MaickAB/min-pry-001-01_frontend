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
import { CostoService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Costo.service';
import { CostoLote } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/CostoLote';


@Component({
  selector: 'app-dialog-costo',
  standalone: true,
  imports: [ProgressSpinnerModule, CheckboxModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-costo.component.html',
  styleUrl: './dialog-costo.component.css'
})

export class DialogCostoComponent {

  /* ATTRIBUTES
  -------------------------*/
  cotizacionMinerales!: any[];
  cotizacion15Minerales!: any[];
  cotizacionDivisa!: any;
  selectedCot15!: any;
  selectedCot!: any;
  costos!: any[];
  costo!: CostoLote;


  estado!: boolean;
  saving!: boolean;
  @Output() changeCosto = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private messageService: MessageService,
    private costoService: CostoService) {
  }

  // SHOW -> VIEW CREATE
  showCreate(idLote: any, cot15Minerales: any[], cotMinerales: any[], cotDivisa: any) {
    this.cotizacion15Minerales = cot15Minerales;
    this.cotizacionMinerales = cotMinerales;
    this.cotizacionDivisa = cotDivisa;
    this.costo = { idLote: idLote, idCotizacionDivisa: cotDivisa.cotizacion.id, cotizacion15Minerales: [], cotizacionMinerales: [] }
    this.estado = true;
    this.saving = false;
  }

  // SHOW -> VIEW CREATE
  showEdit(idLote: any, cot15Minerales: any[], cotMinerales: any[], cotDivisa: any, costos: any[]) {
    this.cotizacion15Minerales = cot15Minerales;
    this.cotizacionMinerales = cotMinerales;
    this.cotizacionDivisa = cotDivisa;
    this.costos = costos;
    this.costo = { idLote: idLote, idCotizacionDivisa: cotDivisa.cotizacion.id, cotizacion15Minerales: [], cotizacionMinerales: [] }
    this.updateSelected();
    this.estado = true;
    this.saving = false;
  }

  // STORE / UPDATE -> DATA
  save() {
    this.prepareData()
    if (true) {
      this.saving = true;
      if (this.costos) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.costo);
        this.costoService.update(this.costo).subscribe({
          next: (response) => {
            this.costo = response.costo;
            this.changeCosto.emit();
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
        console.log('REQUEST->store', this.costo);
        this.costoService.store(this.costo).subscribe({
          next: (response) => {
            this.costo = response.costo;
            this.changeCosto.emit();
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

  // CLOSE -> MODAL
  cancel() {
    this.estado = false;
  }

  // PREPARE -> DATA FOR BACKEND.
  private prepareData() {
    this.costo.cotizacion15Minerales = this.selectedCot15.map((cot: any) => ({ idCotizacion15Mineral: cot.cotizacion15.id }));
    this.costo.cotizacionMinerales = this.selectedCot.map((cot: any) => ({ idCotizacionMineral: cot.cotizacion.id }));
  }

  // UPDATE -> VALORES DE COTIZACIONES
  updateSelected() {
    this.selectedCot15 = [];
    this.cotizacion15Minerales.forEach(cotizacion15 => {
      this.costos.forEach(costo => {
        if (cotizacion15.id == costo.cotizacion15_mineral.idMineral) {
          this.selectedCot15.push(cotizacion15);
        }
      })
    })

    this.selectedCot = [];
    this.cotizacionMinerales.forEach(cotizacion => {
      this.costos.forEach(costo => {
        if (cotizacion.id == costo.cotizacion_mineral.idMineral) {
          this.selectedCot.push(cotizacion);
        }
      })
    })
  }


  /* VALIDADORES
  ---------------------------------------*/
  // valConcepto() { const concepto = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (concepto.test(this.descuento.concepto) ? true : false); }
  // valMonto() { const porcentaje = /^[\d.]{1,10}$/; return (porcentaje.test(this.descuento.monto) ? true : false); }
  // validate() { if (!this.descuento) { return 'Descuento Vacio.' + false; } return (this.valConcepto() && this.valMonto()); }
}
