/* ==================================
        SERVICE PERSONA
================================== */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private url = environment.apiURL + 'codificador/recursoHumano/persona/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> LISTADO DE PERSONAS
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
  }

  // OBTIENE -> LISTADO DE PERSONAS POR CRITERIO
  public search(criterio: any): Observable<any> {
    return this.httpClient.get<any>(this.url + 'search/' + criterio);
  }

  // OBTIENE -> DATA PARA EL CREATE
  public create(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'create');
  }

  // GUARDA -> PERSONA
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // OBTIENE -> DATA PARA EL EDIT
  public edit(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + id);
  }


  // ACTUALIZA -> PERSONA
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> PERSONA
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}
