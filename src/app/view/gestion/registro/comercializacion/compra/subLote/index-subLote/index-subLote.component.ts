/* =============================================
    CONTROLLER INDEX SUB-LOTES
============================================= */

import { Component, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
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

import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { DialogSubLoteComponent } from '../dialog-subLote/dialog-subLote.component';
import { Lote } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Lote';
import { SubLoteService } from '../../../../../../../service/gestion/registro/comercializacion/compra/SubLote.service';



@Component({
  selector: 'app-index-subLote',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, ConfirmDialogModule, CommonModule, DialogModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, DialogSubLoteComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-subLote.component.html',
  styleUrl: './index-subLote.component.css'
})
export class IndexSubLoteComponent {

  /* ATTRIBUTES
 -------------------------*/
  @Input() lote!: Lote;
  @Input() subLotes!: any[];
  @Input() costo!: any;
  @Input() descuentos!: any[];
  @Input() deducciones!: any[];

  auxSubLotes!: any[];
  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogSubLoteComponent) dialog!: DialogSubLoteComponent;
  @Output() changeSubLote = new EventEmitter();

  /* METHODS
  -------------------------*/
  // INYECCTIÓN -> DEPENDENCIAS
  constructor(
    private messageService: MessageService,
    private subLoteService: SubLoteService,
    private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.loadAuxSubLotes();
  }

  // MUESTRA -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index', this.lote.id);
    this.subLoteService.index(this.lote.id).subscribe({
      next: (response) => {
        this.subLotes = response.subLotes;
        this.loadAuxSubLotes();
        this.changeSubLote.emit(response.subLotes);
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
    this.dialog.create(this.lote, this.costo);
  }

  // MUESTRA -> VIEW DETAIL
  showDetail(id: any) {
    alert('DETALLE DESCUENTO ' + id);
  }

  // MUESTRA -> VIEW EDIT
  showEdit(subLote: any) {
    this.dialog.edit(this.lote, subLote, this.costo);
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
        this.subLoteService.destroy(id).subscribe({
          next: (response) => {
            this.auxSubLotes = this.auxSubLotes.filter((val) => val.id !== id);
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

  loadAuxSubLotes() {
    let auxTable: any[] = [];
    const roundToTwo = (num: number): number => parseFloat(num.toFixed(2));
    this.subLotes.forEach(sl => {
      auxTable.push(
        {
          id: sl.id,
          idLote: sl.idLote,
          idSocio: sl.idSocio,
          porcentaje: sl.porcentaje,
          socio: sl.socio.nombre,
          pesoBruto: roundToTwo(parseFloat(sl.lote.pesoBruto) * (sl.porcentaje / 100)),
          tara: roundToTwo(sl.lote.tara * (sl.porcentaje / 100)),
          humedad: roundToTwo(sl.lote.humedad * (sl.porcentaje / 100)),
          pesoNeto: roundToTwo((parseFloat(sl.lote.pesoBruto) - sl.lote.tara - sl.lote.humedad) * (sl.porcentaje / 100)),
          mineralSus: roundToTwo(this.costo.mineralSus * (sl.porcentaje / 100)),
          regaliaSus: roundToTwo(this.costo.regaliaSus * (sl.porcentaje / 100)),
          mineralBs: roundToTwo(this.costo.mineralBs * (sl.porcentaje / 100)),
          regaliaBs: roundToTwo(this.costo.regaliaBs * (sl.porcentaje / 100)),
          netoSus: roundToTwo(this.costo.netoSus * (sl.porcentaje / 100)),
          netoBs: roundToTwo(this.costo.netoBs * (sl.porcentaje / 100)),
          totalDescuentos: 0,
          totalLiquidacion: 0
        });
    })
    this.auxSubLotes = auxTable;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['costo'] && !changes['costo'].firstChange) {
      this.loadAuxSubLotes();
    }
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
    return this.subLotes.reduce((total, item) => total + (item[col] || 0), 0).toFixed(2);
  }

  /* VALIDADORES
  ---------------------------------------*/
  // valIdRegional(): boolean { return this.sucursal.idRegional ? true : false }
  // valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.sucursal.nombre) ? true : false); }
  // valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.sucursal.descripcion) ? true : false); }
  // valDireccion() { const direccion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (direccion.test(this.sucursal.direccion) ? true : false); }
  // valFono() { const fono = /^[\d +-]{1,20}$/; return (fono.test(this.sucursal.fono) ? true : false); }
  // valNumLoteInicio() { const numLoteInicio = /^[\d]{1,20}$/; return (numLoteInicio.test(this.sucursal.numLoteInicio) ? true : false); }
  // valNumLoteFin() { const numLoteFin = /^[\d]{1,20}$/; return (numLoteFin.test(this.sucursal.numLoteFin) ? true : false); }
  // validarDatos() { if (!this.sucursal) { return 'sucursal vacia--' + false; } return (this.valIdRegional() && this.valNombre() && this.valDescripcion() && this.valDireccion() && this.valFono() && this.imgValida && this.valNumLoteInicio() && this.valNumLoteFin); }
}