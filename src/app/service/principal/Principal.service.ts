/* ==================================
        SERVICE PRINCIPAL
================================== */
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PrincipalService {
  private url = 'http://127.0.0.1:8000/api/principal/';
  public evento = new EventEmitter<void>();

  constructor(
    private route: Router,
    private httpClient: HttpClient) { }



  // GET -> ROLES Y PERMISOS DE BACK
  public getDataUser(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'dataUser');
  }

  // SAVE -> ROLES EN STORAGE
  public setRolesStorage(roles: any): void {
    const rolesString = JSON.stringify(roles);
    localStorage.setItem('roles', btoa(rolesString));
  }

  // GET -> ROLES DEL STORAGE
  public getRolesStorage(): any | null {
    const rolesString = localStorage.getItem('roles');
    return rolesString ? JSON.parse(atob(rolesString)) : null;
  }

  // SAVE -> USUARIO EN STORAGE
  public setUsuarioStorage(usuario: any): void {
    const usuarioString = JSON.stringify(usuario);
    localStorage.setItem('usuario', btoa(usuarioString));
  }

  // GET -> USUARIO DEL STORAGE
  public getUsuarioStorage(): any | null {
    const usuarioString = localStorage.getItem('usuario');
    return usuarioString ? JSON.parse(atob(usuarioString)) : null;
  }

  // SAVE -> ROL SELECCIONADO EN EL STORAGE
  public setRolSelectedStorage(rol: any): void {
    const rolString = JSON.stringify(rol);
    localStorage.setItem('rol', btoa(rolString));
  }
  // GET -> ROL SELECCIONADO DEL STORAGE
  public getRolSelectedStorage(): any | null {
    const rolString = localStorage.getItem('rol');
    return rolString ? (JSON.parse(atob(rolString))) : null;
  }

  // GET -> PERMISSIONS
  public getPermissionsStorage(idPermiso: any): any | null {
    const rol = this.getRolSelectedStorage();
    return rol.permisos.filter((permiso: any) => permiso.idGrupo === idPermiso);
  }

  // CLEAR -> STORAGE
  public deleteRolesStorage(): void {
    localStorage.removeItem('roles');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
  }

  // RELOAD -> VIEW PRINCIPAL
  public reload() {
    this.evento.emit();
  }

}
