/* ==================================
        SERVICE AUTH
================================== */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
        };
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }))
  }

  // CIERRA SESIÓN
  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token)
      return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // GUARDA -> USUARIO EN STORAGE
  public setUsuario(usuario: any): void {
    const usuarioString = JSON.stringify(usuario);
    localStorage.setItem('usuario', btoa(usuarioString));
  }

  // OBTIENE -> USUARIO DEL STORAGE
  public getUsuario(): any | null {
    const usuarioString = localStorage.getItem('usuario');
    return usuarioString ? JSON.parse(atob(usuarioString)) : null;
  }

  private getToken(): string | null {
    return localStorage.getItem('token')
  }

}