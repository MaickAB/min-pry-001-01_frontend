/* ==================================
        SERVICE MINERAL COMPLEJO
================================== */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MineralComplejoService {
  private url = 'http://127.0.0.1:8000/api/codificador/recursoMaterial/mineral-complejo/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> LISTADO DE MINERALES
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
  }

  // OBTIENE -> DATA PARA EL EDIT
  public edit(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + id);
  }

  // GUARDA -> MINERAL
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // ACTUALIZA -> MINERAL
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> MINERAL
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}