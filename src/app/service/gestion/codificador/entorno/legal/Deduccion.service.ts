/* ==================================
        SERVICE DEDUCCIÓN
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeduccionService {
  private url = 'http://127.0.0.1:8000/api/codificador/entorno/legal/deduccion/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> DEDUCCIONES
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
  }

  // GUARDA -> DEDUCCION
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // OBTIENE -> DATA PARA EL EDIT
  public edit(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + id);
  }

  // ACTUALIZA -> DEDUCCIÓN
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> DEDUCCIÓN
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}

