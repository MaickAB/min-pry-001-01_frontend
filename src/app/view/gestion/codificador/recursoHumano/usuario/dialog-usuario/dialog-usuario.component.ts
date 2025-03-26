/* ==================================
    CONTROLLER DIALOG USUARIO
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { Rol } from '../../../../../utility/models/gestion/codificador/recursoHumano/Rol';
import { TableModule } from 'primeng/table';
import { Sucursal } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Sucursal';
import { DropdownModule } from 'primeng/dropdown';
import { Usuario } from '../../../../../utility/models/gestion/codificador/recursoHumano/Usuario';
import { UsuarioService } from '../../../../../../service/gestion/codificador/recursoHumano/Usuario.service';
import { Persona } from '../../../../../utility/models/gestion/codificador/recursoHumano/Persona';
import { PrincipalService } from '../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-usuario',
  standalone: true,
  imports: [ProgressSpinnerModule, TabViewModule, DropdownModule, CheckboxModule, TableModule, PasswordModule, CommonModule, DialogModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  templateUrl: './dialog-usuario.component.html',
  styleUrl: './dialog-usuario.component.css'
})
export class DialogUsuarioComponent {

  /* ATTRIBUTES
  -------------------------*/
  // HEADER
  permissions!: any[];
  personas!: Persona[];

  // BODY
  personaSelected!: Persona;
  sucursales!: Sucursal[];
  sucursalesSelected!: Sucursal[];
  roles!: Rol[];
  rolesSelected!: Rol[];
  imgUrl!: string;
  imgValida!: boolean;
  usuario!: Usuario;

  // FOOTER
  user!: any;
  fechaHora!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;
  saving!: boolean;
  disabled!: boolean;
  activeIndex!: number;
  @Output() changeUsuario = new EventEmitter();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private usuarioService: UsuarioService) {
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.estado = true;
    this.loading = true;
    this.saving = false;
    this.disabled = false;
    this.activeIndex = 0;
    console.log('REQUEST->create');
    this.usuarioService.create().subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('04.03');
        this.personas = response.personas;
        // BODY
        this.personaSelected = { documento: '', nombre: '', apePaterno: '', apeMaterno: '', direccion: '', fono: '', foto: '', descripcion: '' };
        this.roles = response.roles;
        this.rolesSelected = [];
        this.sucursales = response.sucursales;
        this.sucursalesSelected = [];
        this.imgUrl = '/img/userDefecto.png';
        this.imgValida = false;
        this.usuario = { login: '', password: '', password_confirmation: '', email: '', fechaInicio: '', fechaFin: '', descripcion: '' };
        // FOOTER
        this.user = this.principalService.getUsuarioStorage();
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
    this.usuarioService.edit(id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('04.03');
        this.personas = response.personas;
        // BODY
        this.roles = response.roles;
        this.sucursales = response.sucursales;
        this.imgUrl = response.usuario.persona.foto;
        this.imgValida = true;
        this.usuario = response.usuario;
        this.updateData();
        // FOOTER
        this.user = this.principalService.getUsuarioStorage();
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
    this.prepareData();
    if (this.validate()) {
      this.saving = true;
      if (this.usuario.id) {
        // SE ACTUALIZA
        console.log('REQUEST->update', this.usuario);
        this.usuarioService.update(this.usuario).subscribe({
          next: (response) => {
            this.usuario = response.usuario;
            this.changeUsuario.emit();
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
        console.log('REQUEST->store', this.usuario);
        this.usuarioService.store(this.usuario).subscribe({
          next: (response) => {
            this.usuario = response.usuario;
            this.changeUsuario.emit();
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

  // CIERRA -> MODAL
  cancel() {
    this.estado = false;
  }

  // --------------------------------------------- 

  // PREPARE -> DATA FOR BACKEND.
  private prepareData() {
    this.usuario.idPersona = this.personaSelected.id;
    this.usuario.roles = this.rolesSelected.map(r => ({ idRol: r.id ?? 0 }));
    this.usuario.sucursales = this.sucursalesSelected.map(s => ({ idRegional: s.idRegional ?? 0, idSucursal: s.id ?? 0 }));
  }

  // UPDATE -> COMBOS SELECCIONADOS
  private updateData() {

    // SE ACTUALIZA LA PERSONA SELECCIONADA
    this.personas.forEach(p => {
      if (p.id == this.usuario.idPersona) {
        this.personaSelected = p;
      }
    });

    // SE ACTUALIZA LOS ROLES SELECCIONADOS
    this.rolesSelected = [];
    this.roles.forEach(rol => {
      this.usuario.roles?.forEach(r => {
        if (rol.id == r.idRol) {
          this.rolesSelected.push(rol);
        }
      })
    })

    // SE ACTUALIZA LAS SUCURSALES SELECCIONADAS
    this.sucursalesSelected = [];
    this.sucursales.forEach(sucursal => {
      this.usuario.sucursales?.forEach(s => {
        if (sucursal.id == s.idSucursal) {
          this.sucursalesSelected.push(sucursal);
        }
      })
    })
  }

  // GENERA -> LOGIN Y PASSWORD
  generarUser() {
    this.usuario.login = this.personaSelected.nombre.toLowerCase().trim().split(' ')[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      + '.'
      + this.personaSelected.apePaterno.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    this.usuario.email = this.usuario.login + '@minexa.com';
    this.usuario.password = 'minexa_' + this.personaSelected.documento.toLowerCase().trim();
  }

  // LOAD -> IMG
  loadImg() {
    this.imgUrl = this.personaSelected.foto;
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
  valPersona(): boolean { return this.personaSelected ? true : false }
  valFechaInicio() { const fecha = /^[\d/-]{1,10}$/; return (fecha.test(this.usuario.fechaInicio) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.usuario.descripcion) ? true : false); }
  valLogin() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.usuario.login) ? true : false); }
  valEmail() { const email = /^[\w._-]{1,50}@minexa.com$/; return (email.test(this.usuario.email) ? true : false); }
  // valPassword() { const password = /^[\w.-]{8,20}$/; return (password.test(this.usuario.password) ? true : false); }
  validate() {
    return (
      this.valPersona() &&
      this.valFechaInicio() &&
      this.valDescripcion() &&
      this.valLogin() &&
      this.valEmail()
    );
  }
}




