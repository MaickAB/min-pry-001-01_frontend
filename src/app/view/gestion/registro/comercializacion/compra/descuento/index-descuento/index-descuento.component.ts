/* =============================================
    CONTROLLER INDEX DESCUENTOS
============================================= */

import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { DialogDescuentoComponent } from '../dialog-descuento/dialog-descuento.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Lote } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Lote';
import { DescuentoService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Descuento.service';


@Component({
  selector: 'app-index-descuento',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, ConfirmDialogModule, CommonModule, DialogModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, DialogDescuentoComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-descuento.component.html',
  styleUrl: './index-descuento.component.css'
})
export class IndexDescuentoComponent {

  /* ATTRIBUTES
 -------------------------*/
  @Input() lote!: Lote;
  @Input() descuentos!: any[];
  @Input() deducciones!: any[];

  descuento!: any;
  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogDescuentoComponent) dialog!: DialogDescuentoComponent;
  @Output() changeDescuento = new EventEmitter();

  /* METHODS
  -------------------------*/
  // INYECCTIÓN -> DEPENDENCIAS
  constructor(
    private messageService: MessageService,
    private descuentoService: DescuentoService,
    private confirmationService: ConfirmationService) {
  }

  // MUESTRA -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.descuentoService.index(this.lote.id).subscribe({
      next: (response) => {
        this.deducciones = response.deducciones;
        this.descuentos = response.descuentos;
        console.log('RESPONSE->index', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->index Error en:', error.error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // MUESTRA -> VIEW CREATE
  showCreate() {
    this.dialog.create(this.lote.id);
  }

  // MUESTRA -> VIEW DETAIL
  showDetail(id: any) {
    alert('DETALLE DESCUENTO ' + id);
  }

  // MUESTRA -> VIEW EDIT
  showEdit(descuento: any) {
    this.dialog.edit(descuento);
  }

  // MUESTRA -> VIEW DELETE
  showDelete(id: any) {

    // MODAL CONFIRMACIÓN
    this.confirmationService.confirm({
      message: 'Está seguro de eliminar el Registro...?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      // ELIMINACIÓN REGISTRO
      accept: () => {
        console.log('REQUEST->destroy', id);
        this.descuentoService.destroy(id).subscribe({
          next: (response) => {
            this.descuentos = this.descuentos.filter((val) => val.id !== id);
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg, life: 3000 });
            console.log('RESPONSE->destroy', response);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->destroy Error en:', error.error);
          }
        });
      }
    });
  }

  // getTotalDeduccionGral(field: string): number {
  //   return this.deducciones.reduce((total, item) => total + (item[field] || 0), 0).toFixed(2);
  // }
  // getTotalDeduccion(field: string): number {
  //   return this.deducciones.reduce((total, item) => total + (item[field] || 0), 0).toFixed(2);
  // }

  // MUESTRA -> REPORT GENERAL
  report() {
    alert('REPORTE COMPLETO');
  }

  total(col: string): number {
    return this.descuentos.reduce((total, item) => total + (item[col] || 0), 0).toFixed(2);
  }
}