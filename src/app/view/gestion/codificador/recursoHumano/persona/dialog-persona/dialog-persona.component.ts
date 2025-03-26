/* ==================================
    CONTROLLER DIALOG PERSONA
================================== */
import { Component, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Persona } from '../../../../../utility/models/gestion/codificador/recursoHumano/Persona';
import { PersonaService } from '../../../../../../service/gestion/codificador/recursoHumano/Persona.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TipoPersona } from '../../../../../utility/models/utility/TipoPersona';
import { TipoGenero } from '../../../../../utility/models/utility/TipoGenero';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-persona',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, DropdownModule, CheckboxModule, TableModule, PasswordModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-persona.component.html',
  styleUrl: './dialog-persona.component.css'
})
export class DialogPersonaComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  regionales!: Regional[];

  // BODY
  tipoPersonas!: TipoPersona[];
  tipoGeneros!: TipoGenero[];
  imgUrl!: string;
  imgValida!: boolean;
  persona!: Persona;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  @Output() changePersona = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private personaService: PersonaService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    console.log('REQUEST->create');
    this.personaService.create().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('04.01');
        this.regionales = response.regionales;
        // BODY        
        this.tipoPersonas = response.tipoPersonas;
        this.tipoGeneros = response.tipoGeneros;
        this.imgUrl = '/img/imgDefecto.png';
        this.imgValida = false;
        this.persona = { documento: '', nombre: '', apePaterno: '', apeMaterno: '', direccion: '', fono: '', foto: '', descripcion: '' };
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.fechaHora = this.initReloj();
        console.log('RESPONSE->create', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->create Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // SHOW -> VIEW SHOW
  showShow(id: number) {
    this.showEdit(id);
    this.disabled = true;
  }

  // SHOW -> VIEW EDIT
  showEdit(id: number) {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    console.log('REQUEST->edit', id);
    this.personaService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('04.01');
        this.regionales = response.regionales;
        // BODY
        this.tipoPersonas = response.tipoPersonas;
        this.tipoGeneros = response.tipoGeneros;
        this.imgUrl = response.persona.foto;
        this.imgValida = true;
        this.persona = response.persona;
        // FOOTER
        this.usuario = this.principalService.getUsuarioStorage();
        this.fechaHora = this.initReloj();
        console.log('RESPONSE->edit', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->edit Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
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
      if (this.persona.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.persona);
        this.personaService.update(this.persona).subscribe({
          next: (response) => {
            this.persona = response.persona;
            this.changePersona.emit();
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
            console.log('RESPONSE->update', response);
            this.estado = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      } else {
        // SE GUARDA
        console.log('REQUEST->store', this.persona);
        this.personaService.store(this.persona).subscribe({
          next: (response) => {
            this.persona = response.persona;
            this.changePersona.emit();
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
            console.log('RESPONSE->store', response);
            this.estado = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->store Error en:', error.error);
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      }
      // SE NOTIFICA A VIEW-PRINCIPAL PARA QUE RECARGE EL STORAGE
      this.principalService.reload();
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
  }

  // GENERATE -> REPORT
  report() {
    alert('showReport');
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
        this.persona.foto = e.target.result;
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

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }

  /* VALIDADORES
  ---------------------------------------*/
  valIdRegional(): boolean { return this.persona.idRegional ? true : false }
  valIdTipoPersona(): boolean { return this.persona.idTipoPersona ? true : false }
  valIdTipoGenero(): boolean { return this.persona.idTipoGenero ? true : false }
  valDocumento() { const codigo = /^[\d-]{1,10}$/; return (codigo.test(this.persona.documento) ? true : false); }
  valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.persona.nombre) ? true : false); }
  valApePaterno() { const apePaterno = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (apePaterno.test(this.persona.apePaterno) ? true : false); }
  valApeMaterno() { const apeMaterno = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,50}$/; return (apeMaterno.test(this.persona.apeMaterno) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.persona.descripcion) ? true : false); }
  valDireccion() { const direccion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (direccion.test(this.persona.direccion) ? true : false); }
  valFono() { const fono = /^[\d +-]{1,20}$/; return (fono.test(this.persona.fono) ? true : false); }
  validate() { return (this.valDocumento() && this.valNombre() && this.valDescripcion() && this.valDireccion() && this.valFono() && this.imgValida && this.valIdTipoPersona() && this.valIdTipoGenero()); }
}




