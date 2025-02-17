/* ==================================
    CONTROLLER DIALOG SUCURSAL
================================== */
import { Component, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sucursal } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Sucursal';
import { SucursalService } from '../../../../../../service/gestion/codificador/recursoMaterial/Sucursal.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { ComunService } from '../../../../../../service/utility/Comun.service';

@Component({
  selector: 'app-dialog-sucursal',
  standalone: true,
  imports: [ProgressSpinnerModule, CommonModule, DialogModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-sucursal.component.html',
  styleUrl: './dialog-sucursal.component.css'
})
export class DialogSucursalComponent {

  /* ATTRIBUTES
 -------------------------*/
  //  HEADER 
  regionales!: Regional[];

  //  BODY
  imgUrl!: string;
  imgValida!: boolean;
  sucursal!: Sucursal;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  @Output() changeSucursal = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private sucursalService: SucursalService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->create');
    this.sucursalService.create().subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY        
        this.imgUrl = '/img/imgDefecto.png';
        this.imgValida = false;
        this.sucursal = { idRegional: 0, nombre: '', descripcion: '', direccion: '', fono: '', numLoteInicio: '', numLoteFin: '', foto: '' };
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
    this.sucursalService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY        
        this.imgUrl = response.sucursal.foto;
        this.imgValida = true;
        this.sucursal = response.sucursal;
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
    if (this.validate()) {
      this.saving = true;
      if (this.sucursal.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.sucursal);
        this.sucursalService.update(this.sucursal).subscribe({
          next: (response) => {
            this.sucursal = response.sucursal;
            this.changeSucursal.emit();
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
        // SE CREA
        console.log('REQUEST->store', this.sucursal);
        this.sucursalService.store(this.sucursal).subscribe({
          next: (response) => {
            this.sucursal = response.sucursal;
            this.changeSucursal.emit();
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

  // CLOSE -> VIEW
  cancel() {
    this.estado = false;
  }

  // ---------------------------------------------

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
        this.sucursal.foto = e.target.result;
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
  valIdRegional(): boolean { return this.sucursal.idRegional ? true : false }
  valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.sucursal.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.sucursal.descripcion) ? true : false); }
  valDireccion() { const direccion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (direccion.test(this.sucursal.direccion) ? true : false); }
  valFono() { const fono = /^[\d +-]{1,20}$/; return (fono.test(this.sucursal.fono) ? true : false); }
  valNumLoteInicio() { const numLoteInicio = /^[\d]{1,20}$/; return (numLoteInicio.test(this.sucursal.numLoteInicio) ? true : false); }
  valNumLoteFin() { const numLoteFin = /^[\d]{1,20}$/; return (numLoteFin.test(this.sucursal.numLoteFin) ? true : false); }
  validate() { return (this.valIdRegional() && this.valNombre() && this.valDescripcion() && this.valDireccion() && this.valFono() && this.imgValida && this.valNumLoteInicio() && this.valNumLoteFin()); }
}