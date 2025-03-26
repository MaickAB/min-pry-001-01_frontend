/* ==================================
        SERVICE AUTH
================================== */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../../view/utility/models/gestion/codificador/recursoHumano/Usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://127.0.0.1:8000/api/auth/';

  constructor(
    private httpClient: HttpClient,
    private route: Router,) { }

  // REGISTRA -> NUEVO USUARIO
  public register(usuarioRequest: Usuario): Observable<any> {
    console.log('REQUEST->Service', usuarioRequest);
    return this.httpClient.post<any>(this.url + 'register', usuarioRequest).pipe(
      map(response => console.log('RESPONSE->Service', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('RESPONSE->Service', error);
        return new Observable((observer) => { observer.error('Sin Respuesta del Servidor...!!!') });
      }))
  }

  // VERIFICA -> CREDENCIALES USER
  public login(credencial: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'login', credencial).pipe(
      map(response => {
        if (response.access_token) {
          this.setToken(response.access_token);
          this.setUsuario(response.usuario);
          this.setRoles(response.roles);
          this.setRolSelected(response.roles[0]);
        };
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }))
  }

  // CIERRA SESIÓN
  public logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('roles');
    localStorage.removeItem('rol');
    return this.httpClient.post<any>(this.url + 'logout', {}, { headers }).pipe(
      map(response => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }


  // VERIFY -> USER AUTENTICADO
  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token)
      return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  // SAVE -> TOKEN
  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // GET -> TOKEN
  private getToken(): string | null {
    return localStorage.getItem('token')
  }

  // SAVE -> USUARIO EN STORAGE
  public setUsuario(usuario: any): void {
    const usuarioString = JSON.stringify(usuario);
    localStorage.setItem('usuario', btoa(usuarioString));
  }

  // SAVE -> ROLES EN STORAGE
  public setRoles(roles: any): void {
    const rolesString = JSON.stringify(roles);
    localStorage.setItem('roles', btoa(rolesString));
  }

  // SAVE -> ROL SELECCIONADO EN EL STORAGE
  public setRolSelected(rol: any): void {
    const rolString = JSON.stringify(rol);
    localStorage.setItem('rol', btoa(rolString));
  }

  // GET -> USUARIO DEL STORAGE
  // public getUsuario(): any | null {
  //   const usuarioString = localStorage.getItem('usuario');
  //   return usuarioString ? JSON.parse(atob(usuarioString)) : null;
  // }
}