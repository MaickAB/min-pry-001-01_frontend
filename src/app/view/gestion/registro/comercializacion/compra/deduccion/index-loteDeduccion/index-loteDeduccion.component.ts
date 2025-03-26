/* =============================================
    CONTROLLER INDEX LOTE-DEDUCCIÓN
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
import { DialogLoteDeduccionComponent } from '../dialog-loteDeduccion/dialog-loteDeduccion.component';
import { LoteDeduccionService } from '../../../../../../../service/gestion/registro/comercializacion/compra/LoteDeduccion.service';


@Component({
  selector: 'app-index-loteDeduccion',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, ConfirmDialogModule, CommonModule, DialogModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, DialogLoteDeduccionComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-loteDeduccion.component.html',
  styleUrl: './index-loteDeduccion.component.css'
})
export class IndexLoteDeduccionComponent {

  /* ATTRIBUTES
 -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  @Input() lote!: any;
  @Input() loteDeducciones!: any[];
  @Input() loteDeduccionesCoop!: any[];

  // STATE
  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogLoteDeduccionComponent) dialog!: DialogLoteDeduccionComponent;
  @Output() changeDeducciones = new EventEmitter<any>();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private loteDeduccionService: LoteDeduccionService) {
  }

  ngOnInit() {
    this.permissions = this.principalService.getPermissionsStorage('06.01');
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.loteDeduccionService.index(this.lote.id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY 
        this.loteDeducciones = response.loteDeducciones;
        this.loteDeduccionesCoop = response.loteDeduccionesCoop;
        this.changeDeducciones.emit({ 'ded': this.loteDeducciones, 'dedCoop': this.loteDeduccionesCoop });
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
    this.dialog.showEdit(this.lote.id);
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}