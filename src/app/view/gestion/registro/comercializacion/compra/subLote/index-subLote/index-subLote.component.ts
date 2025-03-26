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
import { SubLoteService } from '../../../../../../../service/gestion/registro/comercializacion/compra/SubLote.service';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';



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
  // HEADER
  permissions!: any[];

  // BODY
  @Input() lote!: any;
  @Input() subLotes!: any[];
  auxSubLotes!: any[];

  // STATE
  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogSubLoteComponent) dialog!: DialogSubLoteComponent;
  @Output() changeSubLotes = new EventEmitter<any>();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private subLoteService: SubLoteService,
    private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.loadAuxSubLotes();
    this.permissions = this.principalService.getPermissionsStorage('06.01');
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index', this.lote.id);
    this.subLoteService.index(this.lote.id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY  
        this.subLotes = response.subLotes;
        this.changeSubLotes.emit(this.subLotes);
        this.loadAuxSubLotes();
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
    this.dialog.showCreate(this.lote);
  }

  // SHOW -> VIEW SHOW
  showShow(subLote: any) {
    this.dialog.showShow(this.lote, subLote);
  }

  // SHOW -> VIEW EDIT
  showEdit(subLote: any) {
    this.dialog.showEdit(this.lote, subLote);
  }

  // SHOW -> VIEW DELETE
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
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      }
    });
  }

  // LOAD -> DATA AUX
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
          pesoNeto: roundToTwo((parseFloat(sl.lote.pesoBruto) - sl.lote.tara - sl.lote.humedad) * (sl.porcentaje / 100))
        });
    })
    this.auxSubLotes = auxTable;
  }

  // EXPORT -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
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