/* ==================================
        SERVICE PRINCIPAL
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PrincipalService {
  private url = 'http://127.0.0.1:8000/api/principal/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> ROLES Y PERMISOS
  public getRoles(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'roles');
  }

  // GUARDA -> ROLES EN STORAGE
  public setRolesStorage(roles: any): void {
    const rolesString = JSON.stringify(roles);
    localStorage.setItem('roles', btoa(rolesString));

  }

  // GUARDA -> USUARIO EN STORAGE
  public setUsuarioStorage(usuario: any): void {
    const usuarioString = JSON.stringify(usuario);
    localStorage.setItem('usuario', btoa(usuarioString));
  }
  // OBTIENE -> ROLES DEL STORAGE
  public getRolesStorage(): any | null {
    const rolesString = localStorage.getItem('roles');
    return rolesString ? JSON.parse(atob(rolesString)) : null;
  }

  // OBTIENE -> USUARIO DEL STORAGE
  public getUsuarioStorage(): any | null {
    const usuarioString = localStorage.getItem('usuario');
    return usuarioString ? JSON.parse(atob(usuarioString)) : null;
  }

  // GUARDA -> ROL SELECCIONADO EN EL STORAGE
  public setRolSelectedStorage(rol: any): void {
    const rolString = JSON.stringify(rol);
    localStorage.setItem('rol', btoa(rolString));
  }
  // OBTIENE -> ROL SELECCIONADO DEL STORAGE
  public getRolSelectedStorage(): any | null {
    const rolString = localStorage.getItem('rol');
    return rolString ? JSON.parse(atob(rolString)) : null;
  }

  // ELIMINA -> ROLES DEL STORAGE
  public deleteRolesStorage(): void {
    localStorage.removeItem('roles');
    localStorage.removeItem('usuario');
  }
}
