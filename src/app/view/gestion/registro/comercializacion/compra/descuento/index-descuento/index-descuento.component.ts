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
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

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
  // HEADER
  permissions!: any[];

  // BODY
  @Input() lote!: any;
  @Input() descuentos!: any[];
  descuento!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogDescuentoComponent) dialog!: DialogDescuentoComponent;
  @Output() changeDescuentos = new EventEmitter<any>();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private descuentoService: DescuentoService,
    private confirmationService: ConfirmationService) {
  }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.permissions = this.principalService.getPermissionsStorage('06.01');
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.descuentoService.index(this.lote.id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY        
        this.descuentos = response.descuentos;
        this.changeDescuentos.emit(this.descuentos);
        console.log('RESPONSE->index', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->index Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.dialog.showCreate(this.lote.id);
  }

  // SHOW -> VIEW SHOW
  showShow(descuento: any) {
    this.dialog.showShow(descuento);
  }

  // SHOW -> VIEW EDIT
  showEdit(descuento: any) {
    this.dialog.showEdit(descuento);
  }

  // SHOW -> VIEW DELETE
  showDelete(id: number) {

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
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      }
    });
  }

  // EXPORT -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }

  // CALCULATE -> TOTALES
  total(col: string): number {
    return this.descuentos.reduce((total, item) => total + (item[col] || 0), 0).toFixed(2);
  }
}