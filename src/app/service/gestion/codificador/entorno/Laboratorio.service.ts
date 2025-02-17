/* ==================================
        SERVICE LABORATORIO
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {

  private url = 'http://127.0.0.1:8000/api/codificador/entorno/laboratorio/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> LABORATORIOS
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
  }

  // OBTIENE -> DATA PARA EL CREATE
  public create(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'create');
  }

  // GUARDA -> LABORATORIO
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // OBTIENE -> DATA PARA EL EDIT
  public edit(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + id);
  }

  // ACTUALIZA -> LABORATORIO
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> LABORATORIO
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}


