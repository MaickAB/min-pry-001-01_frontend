/* ==================================
    CONTROLLER INDEX SOCIO
================================== */
import { Component, Input, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Socio } from '../../../../../../utility/models/gestion/codificador/entorno/Socio';
import { DialogSocioComponent } from '../dialog-socio/dialog-socio.component';
import { SocioService } from '../../../../../../../service/gestion/codificador/entorno/proveedor/Socio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';

@Component({
  selector: 'app-index-socio',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogSocioComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-socio.component.html',
  styleUrl: './index-socio.component.css'
})
export class IndexSocioComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  @Input() idCooperativa!: any;
  @Input() socios!: Socio[];
  socio!: Socio;

  // STATE
  estado!: boolean;
  loading!: boolean;
  @ViewChild(DialogSocioComponent) dialog!: DialogSocioComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private socioService: SocioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.permissions = this.principalService.getPermissionsStorage('05.04');
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.socioService.index(this.idCooperativa).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.04');
        // BODY
        this.socios = response.socios;
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
    this.dialog.showCreate(this.idCooperativa);
  }

  // SHOW -> VIEW SHOW
  showShow(socio: Socio) {
    this.dialog.showShow(socio);
  }

  // SHOW -> VIEW EDIT
  showEdit(socio: Socio) {
    this.dialog.showEdit(socio);
  }

  // SHOW -> VIEW DELETE
  showDelete(id: number) {

    // MODAL CONFIRMACIÓN
    this.confirmationService.confirm({
      message: 'Está seguro de eliminar el Registro...??',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      // ELIMINACIÓN REGISTRO
      accept: () => {
        console.log('REQUEST->destroy', id);
        this.socioService.destroy(id).subscribe({
          next: (response) => {
            this.socios = this.socios.filter((val) => val.id !== id);
            this.messageService.add({ severity: 'success', summary: 'RESPONSE', detail: response.msg, life: 3000 });
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
}

