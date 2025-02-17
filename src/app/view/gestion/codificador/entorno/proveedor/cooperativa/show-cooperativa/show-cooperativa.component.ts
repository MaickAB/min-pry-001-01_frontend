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
import { CooperativaService } from '../../../../../../../service/gestion/codificador/entorno/Cooperativa.service';
import { Socio } from '../../../../../../utility/models/gestion/codificador/entorno/Socio';
import { IndexSocioComponent } from '../../socio/index-socio/index-socio.component';
import { IndexDeduccionGralComponent } from '../../deduccionGral/index-deduccionGral/index-deduccionGral.component';
import { IndexDeduccionCoopComponent } from '../../deduccionCoop/index-deduccionCoop/index-deduccionCoop.component';
import { DeduccionCoop } from '../../../../../../utility/models/gestion/codificador/entorno/DeduccionCoop';



@Component({
  selector: 'app-show-cooperativa',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, DropdownModule, CheckboxModule, TableModule, PasswordModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, IndexDeduccionGralComponent, IndexDeduccionCoopComponent, IndexSocioComponent],
  templateUrl: './show-cooperativa.component.html',
  styleUrl: './show-cooperativa.component.css'
})
export class ShowCooperativaComponent {

  /* ATTRIBUTES
  -------------------------*/
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
    private messageService: MessageService,
    private cooperativaService: CooperativaService) {
  }

  // LOAD -> DATA SHOW
  show(id: number) {
    this.estado = true;
    this.loading = true;
    this.activeIndex = 0;
    console.log('REQUEST->show', id);
    this.cooperativaService.show(id).subscribe({
      next: (response) => {
        this.cooperativa = response.cooperativa;
        this.deduccionesCoop = response.cooperativa.deducciones_coop;
        this.socios = response.cooperativa.socios;
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
}




