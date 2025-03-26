/* ==================================
        SERVICE WELCOME
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class WelcomeService {

  constructor(private httpClient: HttpClient) { }


  // OBTIENE -> DATOS PARA EL HOME
  getDatosHome(): Observable<any> {
    console.log('REQUEST->', '...');
    return this.httpClient.get('http://127.0.0.1:8000/api/welcome/getDatosHome');
  }

  // OBTIENE -> DATOS PARA LOS SERVICIOS
  getDatosService(): Observable<any> {
    console.log('REQUEST->', '...');
    return this.httpClient.get('http://127.0.0.1:8000/api/welcome/getDatosService');
  }

  // OBTIENE -> DATOS PARA EL CONOCENOS
  getDatosAbout(): Observable<any> {
    console.log('REQUEST->', '...');
    return this.httpClient.get('http://127.0.0.1:8000/api/welcome/getDatosAbout');
  }

  // OBTIENE -> CANTIDAD USERS
  public getCountUsers(): Observable<any> {
    console.log('REQUEST->welcome');
    return this.httpClient.get('http://127.0.0.1:8000/api/welcome/countUsers');
  }
}