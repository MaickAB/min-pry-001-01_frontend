/* =============================================
    CONTROLLER INDEX LEYES
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
import { DialogLeyComponent } from '../dialog-ley/dialog-ley.component';
import { Lote } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Lote';
import { LeyService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Ley.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@Component({
  selector: 'app-index-ley',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, ConfirmDialogModule, DialogModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, DialogLeyComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-ley.component.html',
  styleUrl: './index-ley.component.css'
})
export class IndexLeyComponent {

  /* ATTRIBUTES
 -------------------------*/
  @Input() lote!: Lote;
  @Input() leyes!: any[];
  @Output() changeLeyes = new EventEmitter<any[]>();

  ley!: any;
  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogLeyComponent) dialog!: DialogLeyComponent;
  @Output() changeDescuento = new EventEmitter();

  /* METHODS
  -------------------------*/
  // INYECCTIÓN -> DEPENDENCIAS
  constructor(
    private messageService: MessageService,
    private leyService: LeyService,
    private confirmationService: ConfirmationService) {
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.leyService.index(this.lote.id).subscribe({
      next: (response) => {
        this.leyes = response.leyes;
        this.changeLeyes.emit(response.leyes);
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

  // MUESTRA -> VIEW DETAIL
  showDetail(id: any) {
    alert('DETALLE LEY ' + id);
  }

  // MUESTRA -> VIEW CREATE
  showCreate() {
    this.dialog.create(this.lote);
  }

  // MUESTRA -> VIEW EDIT
  showEdit(ley: any) {
    this.dialog.edit(ley);
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
        this.leyService.destroy(id).subscribe({
          next: (response) => {
            this.leyes = this.leyes.filter((val) => val.id !== id);
            this.changeLeyes.emit(response.leyes);
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

  // MUESTRA -> REPORT GENERAL
  report() {
  }
}