/* ==================================
        SERVICE SUCURSAL
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private url = environment.apiURL + 'codificador/recursoMaterial/sucursal/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> LISTADO DE SUCURSALES
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
  }

  // OBTIENE -> LISTADO DE SUCURSALES POR CRITERIO
  public indexByCriterio(criterio: any): Observable<any> {
    return this.httpClient.get<any>(this.url + 'search/' + criterio);
  }

  // OBTIENE -> DATA PARA EL CREATE
  public create(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'create/');
  }

  // GUARDA -> SUCURSAL
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // OBTIENE -> DATA PARA EL EDIT
  public edit(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + id);
  }

  // ACTUALIZA -> SUCURSAL
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> SUCURSAL
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}