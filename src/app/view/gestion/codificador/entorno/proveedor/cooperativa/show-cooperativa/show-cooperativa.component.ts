/* ==================================
    CONTROLLER SHOW-COOPERATIVA
================================== */
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { Cooperativa } from '../../../../../../utility/models/gestion/codificador/entorno/Cooperativa';
import { CooperativaService } from '../../../../../../../service/gestion/codificador/entorno/proveedor/Cooperativa.service';
import { Socio } from '../../../../../../utility/models/gestion/codificador/entorno/Socio';
import { IndexSocioComponent } from '../../socio/index-socio/index-socio.component';
import { IndexDeduccionCoopComponent } from '../../deduccionCoop/index-deduccionCoop/index-deduccionCoop.component';
import { DeduccionCoop } from '../../../../../../utility/models/gestion/codificador/entorno/DeduccionCoop';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-show-cooperativa',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, DropdownModule, CheckboxModule, TableModule, PasswordModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, IndexDeduccionCoopComponent, IndexSocioComponent],
  templateUrl: './show-cooperativa.component.html',
  styleUrl: './show-cooperativa.component.css'
})
export class ShowCooperativaComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  deduccionesCoop!: DeduccionCoop[];
  socios!: Socio[];
  cooperativa!: Cooperativa;

  // STATE
  estado!: boolean;
  loading!: boolean;
  activeIndex!: number;
  @Output() changeShow = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private cooperativaService: CooperativaService) {
  }

  // SHOW -> VIEW SHOW
  show(id: number) {
    this.estado = true;
    this.loading = true;
    this.activeIndex = 0;
    console.log('REQUEST->show', id);
    this.cooperativaService.show(id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('05.04');
        // BODY
        this.cooperativa = response.cooperativa;
        this.deduccionesCoop = response.cooperativa.deducciones_coop;
        this.socios = response.cooperativa.socios;
        console.log('RESPONSE->show', response);
        console.log('RESPONSE->show', this.cooperativa);
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

  // GENERATE -> REPORT
  report() {
    alert('showReport');
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




