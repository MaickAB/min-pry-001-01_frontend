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
import { Rol } from '../../../../../utility/models/gestion/codificador/recursoHumano/Rol';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { Regional } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Regional';
import { Router } from '@angular/router';

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
  permissions!: any[];
  regionales!: Regional[];

  // BODY  
  permisos!: any[];
  selected!: any[][];
  rol!: Rol;

  // FOOTER
  usuario!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  activeIndex!: number;
  @Output() changeRol = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private rolService: RolService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    this.activeIndex = 0;
    console.log('REQUEST->create');
    this.rolService.create().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('04.02');
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
    this.activeIndex = 0;
    console.log('REQUEST->edit', id);
    this.rolService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('04.02');
        this.regionales = response.regionales;
        // BODY                
        this.permisos = response.permisos;
        this.rol = response.rol;
        this.updateData();
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
            if (error.status === 401) this.route.navigateByUrl('principal');
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
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      }
      // SE NOTIFICA A VIEW-PRINCIPAL PARA QUE RECARGE EL STORAGE
      this.principalService.reload();
    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR REQUEST', detail: 'Datos Incorrectos...!!' });
      console.log('Datos Incorrectos...!!')
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

  // PREPARE -> DATA FOR BACKEND.
  prepareData() {
    let permisos: any = [];
    let opciones: any = [];
    let subOpciones: any = [];
    Object.values(this.selected).forEach(arr => {
      arr.forEach(opc => {
        // SE COMPLETA LA SELECCIÓN
        permisos.push(opc.id.substring(0, 2));
        opciones.push(opc.id.substring(0, 5));
        subOpciones.push(opc.id);
      });
    });
    // SE UNE LOS TES ARRAY A UNO SOLO Y SE LO CARGA AL ROL-PERMISOS
    let arrayPermisos = [...new Set([...permisos, ...opciones, ...subOpciones])];
    this.rol.permisos = [];
    arrayPermisos.forEach(per => {
      this.rol.permisos.push({ 'id': per });
    })
  }

  // UPDATE -> PERMISOS SELECCIONADOS
  updateData() {
    this.selected = [];
    let auxSelected = this.rol.permisos.map((p: any) => ({ id: p.idPermiso }));
    let permisos = auxSelected.filter((p: any) => p.id.length == 2);
    let opciones = auxSelected.filter((p: any) => p.id.length == 5);
    let subOpciones = auxSelected.filter((p: any) => p.id.length > 5);

    // SE CARGA SOLO LOS PEMISOS DE NIVEL 01 PERMITIDOS
    let auxPermisos = this.permisos.filter(per =>
      permisos.some(p => p.id === per.id)
    );

    auxPermisos.forEach(permiso => {
      permiso.opciones.forEach((opcion: any) => {
        let opc: any = [];
        opcion.opciones.forEach((subOpcion: any) => {
          subOpciones.forEach((subOpc: any) => {
            if (subOpcion.id == subOpc.id) {
              opc.push(subOpcion);
            }
          });
        });
        this.selected[opcion.id] = opc;
      });
    }
    );
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
  valIdRegional(): boolean { return this.rol.idRegional ? true : false }
  valNombre() { const nombre = /^[a-zA-Z0-9._* -]{1,50}$/; return (nombre.test(this.rol.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.rol.descripcion) ? true : false); }
  validate() { return (this.valNombre() && this.valDescripcion()); }
}
