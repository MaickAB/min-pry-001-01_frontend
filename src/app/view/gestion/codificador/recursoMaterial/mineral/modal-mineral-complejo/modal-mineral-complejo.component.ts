/* ==================================
  CONTROLLER MODAL MINERAL-COMPLEJO
================================== */
import { Component, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Mineral } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Mineral';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-modal-mineral-complejo',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, ButtonModule],
  templateUrl: './modal-mineral-complejo.component.html',
  styleUrl: './modal-mineral-complejo.component.css'
})
export class ModalMineralComplejoComponent {

  /* ATTRIBUTES
  -------------------------*/
  minerales!: Mineral[];
  selected!: Mineral[];
  estado!: boolean;
  @Output() changeMineralComplejo = new EventEmitter<Mineral[]>();

  /* METHODS
  -------------------------*/
  // SHOW -> VIEW CREATE
  showMinerales(minerales: any, mineralesComponent: any) {
    this.minerales = minerales;
    this.selected = mineralesComponent;
    this.estado = true;
  }

  // SAVE -> MINERALES SELECCIONADOS
  save() {
    this.changeMineralComplejo.emit(this.selected);
    this.estado = false;
  }

  // CLOSE -> VIEW
  cancel() {
    this.estado = false;
  }
}




