/* ==================================
        SERVICE CLIENTE
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = environment.apiURL + 'codificador/entorno/cliente/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> CLIENTES
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
  }

  // OBTIENE -> DATA PARA EL CREATE
  public create(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'create');
  }


  // GUARDA -> CLIENTE
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // OBTIENE -> DATA PARA EL EDIT
  public edit(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + id);
  }

  // ACTUALIZA -> CLIENTE
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> CLIENTE
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}


