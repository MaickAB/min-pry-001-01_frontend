/* =============================================
    CONTROLLER INDEX LOTE-COTIZACION
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
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';
import { DialogLoteCotizacionComponent } from '../dialog-loteCotizacion/dialog-loteCotizacion.component';
import { LoteCotizacionService } from '../../../../../../../service/gestion/registro/comercializacion/compra/LoteCotizacion.service';


@Component({
  selector: 'app-index-loteCotizacion',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, ConfirmDialogModule, CommonModule, DialogModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, DialogLoteCotizacionComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-loteCotizacion.component.html',
  styleUrl: './index-loteCotizacion.component.css'
})
export class IndexLoteCotizacionComponent {

  /* ATTRIBUTES
 -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  @Input() lote!: any;
  @Input() loteCotizacion!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogLoteCotizacionComponent) dialog!: DialogLoteCotizacionComponent;
  @Output() changeLoteCotizacion = new EventEmitter<any>();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private loteCotizacionService: LoteCotizacionService) {
  }

  ngOnInit() {
    this.permissions = this.principalService.getPermissionsStorage('06.01');
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.loteCotizacionService.index(this.lote.id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY 
        this.loteCotizacion = response.loteCotizacion;
        this.changeLoteCotizacion.emit(this.loteCotizacion);
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

  // SHOW -> VIEW EDIT
  showEdit() {
    this.dialog.showEdit(this.loteCotizacion);
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}