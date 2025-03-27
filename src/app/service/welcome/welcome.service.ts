/* ==================================
        SERVICE WELCOME
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class WelcomeService {
  private url = environment.apiURL + 'welcome/';

  constructor(private httpClient: HttpClient) { }


  // OBTIENE -> DATOS PARA EL HOME
  getDatosHome(): Observable<any> {
    console.log('REQUEST->', '...');
    return this.httpClient.get(this.url + 'getDatosHome');
  }

  // OBTIENE -> DATOS PARA LOS SERVICIOS
  getDatosService(): Observable<any> {
    console.log('REQUEST->', '...');
    return this.httpClient.get(this.url + 'getDatosService');
  }

  // OBTIENE -> DATOS PARA EL CONOCENOS
  getDatosAbout(): Observable<any> {
    console.log('REQUEST->', '...');
    return this.httpClient.get(this.url + 'getDatosAbout');
  }

  // OBTIENE -> CANTIDAD USERS
  public getCountUsers(): Observable<any> {
    console.log('REQUEST->welcome');
    return this.httpClient.get(this.url + 'countUsers');
  }
}