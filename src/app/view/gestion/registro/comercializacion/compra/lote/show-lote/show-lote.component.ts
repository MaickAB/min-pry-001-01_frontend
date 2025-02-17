/* ==================================
    CONTROLLER SHOW-LOTE
================================== */
import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
import { Costo } from '../../../../../../utility/models/gestion/registro/comercializacion/compra/Costo';
import { IndexDescuentoComponent } from '../../descuento/index-descuento/index-descuento.component';
import { IndexLeyComponent } from '../../ley/index-ley/index-ley.component';
import { IndexSubLoteComponent } from '../../subLote/index-subLote/index-subLote.component';
import { IndexCostoComponent } from '../../costo/index-costo/index-costo.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@Component({
  selector: 'app-show-lote',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, ConfirmDialogModule, DropdownModule, CheckboxModule, TableModule, PasswordModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, IndexDescuentoComponent, IndexLeyComponent, IndexSubLoteComponent, IndexCostoComponent],
  templateUrl: './show-lote.component.html',
  styleUrl: './show-lote.component.css'
})
export class ShowLoteComponent {

  /* ATTRIBUTES
  -------------------------*/
  lote!: any;
  subLotes!: any[];
  deducciones!: any[];
  descuentos!: any[];
  leyes!: any[];
  cotizacionMinerales!: any[];
  cotizacion15Minerales!: any[];
  cotizacionDivisa!: any;
  costos!: any[];
  costo!: Costo;

  // STATES
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  activeIndex!: number;
  estadoLote!: boolean;
  @Output() changeShow = new EventEmitter();
  @ViewChild(IndexSubLoteComponent) indexSubLote!: IndexSubLoteComponent;

  /* METHODS
  -------------------------*/
  // INYECCIÓN -> DEPENDENCIAS
  constructor(
    private messageService: MessageService,
    private loteService: LoteService,
    private confirmationService: ConfirmationService) {
  }

  // LOAD -> DATA SHOW
  show(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.activeIndex = 0;
    this.estadoLote = false;
    console.log('REQUEST->show', id);
    this.loteService.show(id).subscribe({
      next: (response) => {
        this.lote = response.lote;
        this.subLotes = response.subLotes;
        this.costos = response.costos;
        this.descuentos = response.descuentos;
        this.deducciones = response.deducciones;
        this.leyes = response.leyes;
        this.cotizacionMinerales = response.cotizacionMinerales;
        this.cotizacion15Minerales = response.cotizacion15Minerales;
        this.cotizacionDivisa = response.cotizacionDivisa;
        this.calcularPrecios();
        this.updateEstadoLote();
        console.log('RESPONSE->show', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->show Error en:', error.error);
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

  // UPDATE -> LEYES
  updateLeyes(leyes: any[]) {
    this.leyes = leyes;
    this.calcularPrecios();
    this.updateEstadoLote()
  }

  // UPDATE -> COSTOS
  updateCostos(costos: any[]) {
    this.costos = costos;
    this.calcularPrecios();
    this.updateEstadoLote()
  }

  // CLOSE -> MODAL
  updateSubLotes(subLotes: any[]) {
    this.subLotes = subLotes;
    this.updateEstadoLote()
  }


  // MUESTRA -> REPORT GENERAL
  calcularPrecios() {
    let fcLibra = 2.20462;
    let fcOnzaTroy = 14.5833;
    let pesoNeto = parseFloat(this.lote.pesoBruto) - this.lote.tara - this.lote.humedad;
    this.costo = { mineralSus: 0, regaliaSus: 0, mineralBs: 0, regaliaBs: 0, netoSus: 0, netoBs: 0 };
    let leyMineral = 0;
    let mineralFino = 0;
    const roundToTwo = (num: number): number => parseFloat(num.toFixed(2));
    this.leyes?.forEach(ley => {

      // SI ES LEY-TRANSE, SE HACE EL CÁLCULO
      if (ley.idSolicitante === 4 && ley.detalles && this.costos.length > 0) {
        ley.detalles.forEach((detalle: any) => {
          let cotizacionMineral = this.costos.find(c => c.cotizacion_mineral.idMineral === detalle.idMineral).cotizacion_mineral.valorCotizacion;
          let unidadMedida = this.costos.find(c => c.cotizacion_mineral.idMineral === detalle.idMineral).cotizacion_mineral.unidad_medida.abreviatura;
          let cotizacion15Mineral = this.costos.find(c => c.cotizacion15_mineral.idMineral === detalle.idMineral).cotizacion15_mineral.valorCotizacion;
          let cotizacion15Regalia = this.costos.find(c => c.cotizacion15_mineral.idMineral === detalle.idMineral).cotizacion15_mineral.valorRegalia;
          let unidadMedida15 = this.costos.find(c => c.cotizacion15_mineral.idMineral === detalle.idMineral).cotizacion15_mineral.unidad_medida.abreviatura;
          let cotizacionDiv = this.costos[0]['cotizacion_divisa'].valor;

          if (detalle.idUnidadMedidaLey == 1) {
            leyMineral = detalle.valor / 100; // Ley en porcentaje
            mineralFino = pesoNeto * leyMineral * fcLibra;
          }
          else {
            leyMineral = detalle.valor / 100 / 100; // DM convertido a Porcentaje para la Plata
            mineralFino = pesoNeto * leyMineral * fcLibra * fcOnzaTroy;
          }

          if (unidadMedida == '¢US$ / LF') {
            cotizacionMineral = cotizacionMineral / 100; // Se debe convertir Centavos a Dolar
          }
          if (unidadMedida15 == '¢US$ / LF') {
            cotizacion15Mineral = cotizacion15Mineral / 100; // Se debe convertir Centavos a Dolar
          }

          this.costo.mineralSus = roundToTwo(this.costo.mineralSus + roundToTwo(mineralFino * cotizacionMineral));
          this.costo.regaliaSus = roundToTwo(this.costo.regaliaSus + roundToTwo((mineralFino * cotizacion15Mineral) * (cotizacion15Regalia / 100)));
          this.costo.mineralBs = roundToTwo(this.costo.mineralSus * cotizacionDiv);
          this.costo.regaliaBs = roundToTwo(this.costo.regaliaSus * cotizacionDiv);
          this.costo.netoSus = roundToTwo(this.costo.mineralSus - this.costo.regaliaSus);
          this.costo.netoBs = roundToTwo(this.costo.mineralBs - this.costo.regaliaBs);
        });
      }
    });
  }

  // UPDATE -> ESTADO-COTIZACIONES
  updateEstadoLote() {
    if (this.costos.length && this.leyes.length && this.subLotes.length) {
      this.estadoLote = true;
    }
  }

  // ACEPTA -> COMPRA
  aceptarCompra() {

    // MODAL CONFIRMACIÓN
    this.confirmationService.confirm({
      message: `      
      <div class="text-center">
          <i class="pi pi-check icon-aceptar"></i>
      </div>
      <h3>Si acepta la compra, ya no podrá modificarla...!!</h3>
      `,
      header: 'Confirmar',
      accept: () => {
        this.updateEstadoCompra({ 'idLote': this.lote.id, 'codigo': '1.1' })
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
      }
    });
  }
}




