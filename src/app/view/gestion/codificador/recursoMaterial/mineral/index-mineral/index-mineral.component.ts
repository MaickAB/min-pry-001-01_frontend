/* ==================================
      CONTROLLER INDEX MINERAL
================================== */
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Mineral } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Mineral';
import { MineralService } from '../../../../../../service/gestion/codificador/recursoMaterial/Mineral.service';
import { DialogMineralComponent } from '../dialog-mineral/dialog-mineral.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TipoMineral } from '../../../../../utility/models/utility/TipoMineral';
import { DropdownModule } from 'primeng/dropdown';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-mineral',
  standalone: true,
  imports: [ProgressSpinnerModule, DropdownModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogMineralComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-mineral.component.html',
  styleUrl: './index-mineral.component.css'
})
export class IndexMineralComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  tipoMinerales!: TipoMineral[];

  // BODY
  minerales!: Mineral[];
  data!: Mineral[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogMineralComponent) dialog!: DialogMineralComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private mineralService: MineralService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.show();
  }

  // SHOW -> VIEW INDEX
  show() {
    this.loading = true;
    console.log('REQUEST->index');
    this.mineralService.index().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('02.03');
        this.tipoMinerales = response.tipoMinerales;
        // BODY
        this.minerales = response.minerales;
        this.data = response.minerales;
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
    this.dialog.showCreate();
  }

  // SHOW -> VIEW SHOW
  showShow(id: number) {
    this.dialog.showShow(id);
  }

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.dialog.showEdit(id);
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
        this.mineralService.destroy(id).subscribe({
          next: (response) => {
            this.minerales = this.minerales.filter((val) => val.id !== id);
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

  // EXPORTA -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }

  // ---------------------------------------------

  // FILTER -> MINERALES POR TIPO
  filter(idParent: number) {
    this.minerales = this.data.filter((val) => val.idTipoMineral == idParent);
  }

  // CLEAR -> FILTER
  clearFilter() {
    this.minerales = this.data;
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}
