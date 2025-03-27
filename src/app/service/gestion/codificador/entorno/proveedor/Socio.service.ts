/* ==================================
        SERVICE SOCIO
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SocioService {

  private url = environment.apiURL + 'codificador/entorno/socio/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> SOCIOS
  public index(idCooperativa: any): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index/' + idCooperativa);
  }

  // GUARDA -> SOCIO
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // ACTUALIZA -> SOCIO
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> SOCIO
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}


