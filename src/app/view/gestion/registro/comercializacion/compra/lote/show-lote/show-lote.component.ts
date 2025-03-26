/* ==================================
    CONTROLLER SHOW-LOTE
================================== */
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { LoteService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Lote.service';
import { IndexDescuentoComponent } from '../../descuento/index-descuento/index-descuento.component';
import { IndexLeyComponent } from '../../ley/index-ley/index-ley.component';
import { IndexSubLoteComponent } from '../../subLote/index-subLote/index-subLote.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';
import { IndexLoteDeduccionComponent } from '../../deduccion/index-loteDeduccion/index-loteDeduccion.component';
import { IndexLoteCotizacionComponent } from '../../cotizacion/index-loteCotizacion/index-loteCotizacion.component';
import { ComunService } from '../../../../../../../service/utility/Comun.service';

@Component({
  selector: 'app-show-lote',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, ConfirmDialogModule, DropdownModule, CheckboxModule, TableModule, PasswordModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, IndexDescuentoComponent, IndexLeyComponent, IndexSubLoteComponent, IndexLoteCotizacionComponent, IndexLoteDeduccionComponent],
  templateUrl: './show-lote.component.html',
  styleUrl: './show-lote.component.css'
})
export class ShowLoteComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  lote!: any;
  descuentos!: any[];
  loteDeducciones!: any[];
  loteDeduccionesCoop!: any[];
  loteCotizacion!: any;
  leyes!: any[];
  subLotes!: any[];
  reportPDF!: any;

  // STATES
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  activeIndex!: number;
  @Output() changeShow = new EventEmitter();
  @ViewChild(IndexSubLoteComponent) indexSubLote!: IndexSubLoteComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private loteService: LoteService,
    private confirmationService: ConfirmationService,
    private comunService: ComunService) {
  }

  // SHOW -> VIEW SHOW
  show(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.activeIndex = 0;
    this.reportPDF = null;
    console.log('REQUEST->show', id);
    this.loteService.show(id).subscribe({
      next: (response) => {
        console.log('RESPONSE->show', response);
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY
        this.lote = response.lote;
        this.descuentos = response.descuentos;
        this.loteDeducciones = response.loteDeducciones;
        this.loteDeduccionesCoop = response.loteDeduccionesCoop;
        this.loteCotizacion = response.loteCotizacion
        this.leyes = response.leyes;
        this.subLotes = response.subLotes;
        console.log('RESPONSE->show', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->show Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // ACEPTA -> COMPRA
  aceptarCompra() {

    // MODAL CONFIRMACIÓN
    this.confirmationService.confirm({
      message: `      
      <div class="text-center">
          <i class="pi pi-lock icon-aceptar"></i>
      </div>
      <h3>Si Cierra la compra, ya no podrá modificarla...!!</h3>
      `,
      header: 'Confirmar',
      accept: () => {
        if (this.loteDeducciones.length && this.loteCotizacion && this.leyes.length && this.subLotes.length) {
          this.updateEstadoCompra({ 'idLote': this.lote.id, 'codigo': '1.1' })
        } else {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'LOTE INCOMPLETO...!!' });
        }
      }
    });
  }

  // RECHAZA -> COMPRA
  rechazarCompra() {
    this.confirmationService.confirm({
      message: `      
      <div class="text-center">
          <i class="pi pi-times icon-rechazar"></i>
      </div>
      <h3>Si rechaza la compra, ya no podrá modificarla...!!</h3>
      `,
      header: 'Confirmar',
      accept: () => {
        this.updateEstadoCompra({ 'idLote': this.lote.id, 'codigo': '1.2' })
      }
    });
  }

  // ABRIR -> COMPRA
  abrirCompra() {

    // MODAL CONFIRMACIÓN
    this.confirmationService.confirm({
      message: `      
      <div class="text-center">
          <i class="pi pi-folder-open icon-aceptar"></i>
      </div>
      <h3>Está seguro de reabrir la compra para su edición...??</h3>
      `,
      header: 'Confirmar',
      accept: () => {
        this.updateEstadoCompra({ 'idLote': this.lote.id, 'codigo': '1' })
      }
    });
  }

  // UPDATE -> DESCUENTOS
  updateDescuentos(data: any) {
    this.descuentos = data;
  }

  // UPDATE -> DEDUCCIONES
  updateDeducciones(data: any) {
    this.loteDeducciones = data.ded;
    this.loteDeduccionesCoop = data.dedCoop;
  }

  // UPDATE -> COTIZACIONES
  updateLoteCotizacion(data: any) {
    this.loteCotizacion = data;
  }

  // UPDATE -> LEYES
  updateLeyes(data: any) {
    this.leyes = data;
  }

  // UPDATE -> SUB-LOTES
  updateSubLotes(data: any) {
    this.subLotes = data;
    console.log('sublo', data);
  }

  // UPDATE -> ESTADO DE COMPRA
  private updateEstadoCompra(data: any) {
    this.saving = true;
    console.log('REQUEST->updateState', this.lote.id);
    this.loteService.updateState(data).subscribe({
      next: (response) => {
        this.lote = response.lote;
        this.changeShow.emit();
        this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
        console.log('RESPONSE->updateState', response);
        this.estado = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->updateState Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      }
    });
  }

  // GENERATE -> REPORT
  report() {
    this.loading = true;
    console.log('REQUEST->report', this.lote.id);
    this.loteService.report(this.lote.id).subscribe({
      next: (response) => {
        this.reportPDF = this.comunService.formatPDF(response.reportPDF);
        console.log('RESPONSE->report', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->report Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // CLOSE -> MODAL
  cancel() {
    this.estado = false;
    this.changeShow.emit();
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}