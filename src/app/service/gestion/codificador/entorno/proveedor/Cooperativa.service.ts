/* ==================================
        SERVICE COOPERATIVA
================================== */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CooperativaService {

  private url = environment.apiURL + 'codificador/entorno/cooperativa/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> COOPERATIVAS
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
  }

  // OBTIENE -> DATA PARA EL CREATE
  public create(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'create');
  }

  // GUARDA -> COOPERATIVA
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // SHOW
  public show(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'show/' + id);
  }

  // OBTIENE -> DATA PARA EL EDIT
  public edit(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + id);
  }

  // ACTUALIZA -> COOPERATIVA
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> COOPERATIVA
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}


