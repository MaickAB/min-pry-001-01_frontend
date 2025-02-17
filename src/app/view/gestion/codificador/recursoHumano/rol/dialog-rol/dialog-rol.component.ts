/* ==================================
      CONTROLLER DIALOG ROL
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
import { TableModule } from 'primeng/table';
import { RolService } from '../../../../../../service/gestion/codificador/recursoHumano/Rol.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Permiso } from '../../../../../utility/models/utility/Permiso';
import { Rol } from '../../../../../utility/models/gestion/codificador/recursoHumano/Rol';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';

@Component({
  selector: 'app-dialog-rol',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, DropdownModule, TableModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-rol.component.html',
  styleUrl: './dialog-rol.component.css'
})

export class DialogRolComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  regionales!: Regional[];

  // BODY  
  permisos!: Permiso[];
  selected!: any[];
  rol!: Rol;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  activeIndex!: number;
  @Output() changeRol = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private principalService: PrincipalService,
    private messageService: MessageService,
    private rolService: RolService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.activeIndex = 0;
    console.log('REQUEST->create');
    this.rolService.create().subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY        
        this.permisos = response.permisos;
        this.selected = [];
        this.rol = { nombre: '', descripcion: '', permisos: [] };
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
    this.activeIndex = 0;
    console.log('REQUEST->edit', id);
    this.rolService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.regionales = response.regionales;
        // BODY                
        this.permisos = response.permisos;
        this.rol = response.rol;
        this.rol.permisos = response.rol.permisos.map((p: any) => ({ id: p.idPermiso }));
        this.updatePermisos();
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

  // STORE / UPDATE -> ROL
  save() {
    this.prepareData()
    if (this.validate()) {
      this.saving = true;
      if (this.rol.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.rol);
        this.rolService.update(this.rol).subscribe({
          next: (response) => {
            this.rol = response.rol;
            this.changeRol.emit();
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
        console.log('REQUEST->store', this.rol);
        this.rolService.store(this.rol).subscribe({
          next: (response) => {
            this.rol = response.rol;
            this.changeRol.emit();
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
      this.messageService.add({ severity: 'error', summary: 'ERROR REQUEST', detail: 'Datos Incorrectos...!!' });
      console.log('Datos Incorrectos...!!')
    }
  }

  // CLOSE -> VIEW
  cancel() {
    this.estado = false;
  }

  // --------------------------------------------- 

  // PREPARE -> DATA FOR BACKEND.
  prepareData() {
    this.rol.permisos = [];
    let grupos = [...new Set(this.selected.map(s => (s.idGrupo)))];
    for (let i = 0; i < grupos.length; i++) {
      this.rol.permisos.push({ id: grupos[i] })
      this.selected.forEach(s => {
        if (grupos[i] == s.idGrupo) {
          this.rol.permisos.push({ id: s.id })
        }
      });
    }
  }

  // UPDATE -> PERMISOS SELECCIONADOS
  updatePermisos() {
    this.selected = [];
    this.permisos.forEach(permiso => {
      if (permiso.opciones.length > 0) {
        permiso.opciones.forEach((opcion: any) => {
          this.rol.permisos?.forEach(rp => {
            if (opcion.id == rp.id) {
              this.selected.push(opcion);
            }
          })
        })
      }
    });
  }

  // INIT -> FECHA CON RELOJ
  private initReloj() {
    setInterval(() => {
      this.fechaHora = new Date(); // Actualiza la fecha y hora cada segundo
    }, 1000);
  }

  /* VALIDADORES
  ---------------------------------------*/
  valIdRegional(): boolean { return this.rol.idRegional ? true : false }
  valNombre() { const nombre = /^[a-zA-Z0-9._* -]{1,50}$/; return (nombre.test(this.rol.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.rol.descripcion) ? true : false); }
  validate() { return (this.valNombre() && this.valDescripcion()); }
}
