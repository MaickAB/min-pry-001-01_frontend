/* =============================================
    CONTROLLER INDEX COSTO
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Lote } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Lote';
import { DialogCostoComponent } from '../dialog-costo/dialog-costo.component';
import { CostoService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Costo.service';


@Component({
  selector: 'app-index-costo',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, ConfirmDialogModule, CommonModule, DialogModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, DialogCostoComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-costo.component.html',
  styleUrl: './index-costo.component.css'
})
export class IndexCostoComponent {

  /* ATTRIBUTES
 -------------------------*/
  @Input() lote!: Lote;
  @Input() cotizacionMinerales!: any[];
  @Input() cotizacion15Minerales!: any[];
  @Input() cotizacionDivisa!: any;
  @Input() costos!: any[];

  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogCostoComponent) dialog!: DialogCostoComponent;
  @Output() changeCostos = new EventEmitter();

  /* METHODS
  -------------------------*/
  // INYECCTIÓN -> DEPENDENCIAS
  constructor(
    private messageService: MessageService,
    private costoService: CostoService,
    private confirmationService: ConfirmationService) {
  }

  // MUESTRA -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.costoService.index(this.lote.id).subscribe({
      next: (response) => {
        this.costos = response.costos;
        this.changeCostos.emit(response.costos);
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

  // SHOW -> VIEW CREATE
  showCreate() {
    this.dialog.showCreate(this.lote.id, this.cotizacion15Minerales, this.cotizacionMinerales, this.cotizacionDivisa);
  }

  // SHOW -> VIEW EDIT
  showEdit() {
    this.dialog.showEdit(this.lote.id, this.cotizacion15Minerales, this.cotizacionMinerales, this.cotizacionDivisa, this.costos);
  }
}