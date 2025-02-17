/* ==================================
      CONTROLLER INDEX PERSONA
================================== */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Persona } from '../../../../../utility/models/gestion/codificador/recursoHumano/Persona';
import { PersonaService } from '../../../../../../service/gestion/codificador/recursoHumano/Persona.service';
import { DialogPersonaComponent } from '../dialog-persona/dialog-persona.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { TipoPersona } from '../../../../../utility/models/utility/TipoPersona';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';

@Component({
  selector: 'app-index-persona',
  standalone: true,
  imports: [ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, DialogPersonaComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-persona.component.html',
  styleUrl: './index-persona.component.css'
})
export class IndexPersonaComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  regionales!: Regional[];

  // BODY
  personas!: Persona[];
  data!: Persona[];

  // STATE
  loading: boolean = false;
  @ViewChild(DialogPersonaComponent) dialog!: DialogPersonaComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private personaService: PersonaService,
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
    this.personaService.index().subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY
        this.personas = response.personas;
        this.data = response.personas;
        console.log('RESPONSE->index', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE -> Error en:', error.error);
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
        this.personaService.destroy(id).subscribe({
          next: (response) => {
            this.personas = this.personas.filter((val) => val.id !== id);
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg, life: 3000 });
            console.log('RESPONSE->destroy', response);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->destroy Error en:', error.error);
          }
        });
      }
    });
  }

  // SHOW -> VIEW REPORT
  showReport(id: number) {
    alert('showReport' + id);
  }

  // EXPORTA -> DATA A XLS
  exportXLS() {
    alert('exportXLS');
  }

  // ---------------------------------------------

  // FILTER -> RECORDS BY ID-REGIONAL
  filter(idRegional: number) {
    this.personas = this.data.filter((val) => val.idRegional == idRegional);
  }

  // CLEAR -> FILTER
  clearFilter() {
    this.personas = this.data;
  }
}
