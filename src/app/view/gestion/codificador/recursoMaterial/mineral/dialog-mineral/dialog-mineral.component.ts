/* ==================================
    CONTROLLER DIALOG MINERAL
================================== */
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Mineral } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Mineral';
import { MineralService } from '../../../../../../service/gestion/codificador/recursoMaterial/Mineral.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TipoMineral } from '../../../../../utility/models/utility/TipoMineral';
import { DropdownModule } from 'primeng/dropdown';
import { ModalMineralComplejoComponent } from '../modal-mineral-complejo/modal-mineral-complejo.component';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';

@Component({
  selector: 'app-dialog-mineral',
  standalone: true,
  imports: [ProgressSpinnerModule, CommonModule, DropdownModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, ModalMineralComplejoComponent],
  templateUrl: './dialog-mineral.component.html',
  styleUrl: './dialog-mineral.component.css'
})
export class DialogMineralComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  tipoMinerales!: TipoMineral[]

  // BODY
  minerales!: Mineral[];
  mineralesComponent!: Mineral[];
  imgUrl!: string;
  imgValida!: boolean;
  mineral!: Mineral;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  @Output() changeMineral = new EventEmitter();
  @ViewChild(ModalMineralComplejoComponent) modal!: ModalMineralComplejoComponent;

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private mineralService: MineralService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->create');
    this.mineralService.create().subscribe({
      next: (response) => {
        // HEADER
        this.tipoMinerales = response.tipoMinerales;
        // BODY        
        this.minerales = response.minerales;
        this.mineralesComponent = [];
        this.imgUrl = '/img/imgDefecto.png';
        this.imgValida = false;
        this.mineral = { codigo: '', abreviatura: '', nombre: '', descripcion: '', foto: '' };
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.fechaHora = this.initReloj();
        console.log('RESPONSE->create', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->create Error en:', error.error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->edit', id);
    this.mineralService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.tipoMinerales = response.tipoMinerales;
        // BODY
        this.mineral = response.mineral;
        this.minerales = response.minerales;
        this.updateMineralesComponent();
        this.imgUrl = response.mineral.foto;
        this.imgValida = true;

        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.fechaHora = this.initReloj();
        console.log('RESPONSE->edit', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->edit Error en:', error.error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // STORE / UPDATE -> DATA
  save() {
    this.prepareData()
    if (this.validate()) {
      this.saving = true;
      if (this.mineral.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.mineral);
        this.mineralService.update(this.mineral).subscribe({
          next: (response) => {
            this.mineral = response.mineral;
            this.changeMineral.emit();
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
            console.log('RESPONSE->update', response);
            this.estado = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->update Error en:', error.error);
          }
        });
      } else {
        // SE GUARDA
        console.log('REQUEST->store', this.mineral);
        this.mineralService.store(this.mineral).subscribe({
          next: (response) => {
            this.mineral = response.mineral;
            this.changeMineral.emit();
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
            console.log('RESPONSE->store', response);
            this.estado = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->store Error en:', error.error);
          }
        });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
  }

  // SHOW -> MODAL MINERALES COMPONENTES
  showModal() {
    if (this.mineral.idTipoMineral == 2)
      this.modal.showMinerales(this.minerales, this.mineralesComponent);
  }

  // CLOSE -> VIEW
  cancel() {
    this.estado = false;
  }

  // --------------------------------------------- 

  // PREPARE -> DATA FOR BACKEND.
  private prepareData() {
    this.mineral.minerales = this.mineralesComponent.map(m => ({ idMineralComponente: m.id }));
  }

  // UPDATE -> MINERALES COMPONENTES
  private updateMineralesComponent() {
    this.mineralesComponent = [];
    this.minerales.forEach(mineral => {
      this.mineral.minerales?.forEach(m => {
        if (mineral.id == m.idMineralComponente) {
          this.mineralesComponent.push(mineral);
        }
      })
    })
  }

  // GEMERA -> DATOS DE MINERAL EN BASE A MODAL-MINERALES-COMPONENTES
  generarDatos(minerales: any) {
    this.mineral.codigo = '';
    this.mineral.abreviatura = '';
    this.mineral.nombre = '';
    this.mineral.descripcion = '';
    this.mineralesComponent = minerales;
    minerales.forEach((m: any) => {
      this.mineral.codigo = this.mineral.codigo + m.codigo + ' ';
      this.mineral.abreviatura = this.mineral.abreviatura + m.abreviatura + ' ';
      this.mineral.nombre = this.mineral.nombre + m.nombre + ' ';
      this.mineral.descripcion = this.mineral.descripcion + m.descripcion + ' ';
    });
    this.mineral.descripcion = 'Mineral Complejo formado por: ' + this.mineral.abreviatura
  }

  // LOAD -> VISTA PREVIA IMG
  loadImg(event: any) {
    const maxSize = 2 * 1024 * 1024;
    const validExtensions = ['jpg', 'png'];
    let imgSelected!: File;

    // SE RECUPERA LA FOTO
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileSize = file.size;
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      // SE VALIDA LA FOTO
      if (fileSize > maxSize || !validExtensions.includes(fileExtension))
        this.imgValida = false
      else
        this.imgValida = true

      // SE CARGA LA FOTO
      imgSelected = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgUrl = e.target.result;
        this.mineral.foto = e.target.result;
      };
      reader.readAsDataURL(imgSelected);
    }
  }

  // INIT -> FECHA CON RELOJ
  private initReloj() {
    setInterval(() => {
      this.fechaHora = new Date(); // Actualiza la fecha y hora cada segundo
    }, 1000);
  }

  /* VALIDADORES
  ---------------------------------------*/
  valCodigo() { const codigo = /^[\w .-]{1,20}$/; return (codigo.test(this.mineral.codigo) ? true : false); }
  valAbreviatura() { const abreviatura = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,20}$/; return (abreviatura.test(this.mineral.abreviatura) ? true : false); }
  valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.mineral.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ:.-]{0,200}$/; return (descripcion.test(this.mineral.descripcion) ? true : false); }
  validate() { return (this.valCodigo() && this.valAbreviatura() && this.valNombre() && this.valDescripcion() && this.imgValida); }
}




