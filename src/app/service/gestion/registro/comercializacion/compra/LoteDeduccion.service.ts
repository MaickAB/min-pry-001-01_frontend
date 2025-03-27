/* ==================================
        SERVICE LOTE-DEDUCCION
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoteDeduccionService {
  private url = environment.apiURL + 'registro/comercializacion/compra/deduccion/';

  constructor(
    private httpClient: HttpClient) { }

  // INDEX
  public index(idLote: any): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index/' + idLote);
  }

  // CREATE
  public create(idLote: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'create/' + idLote);
  }

  // STORE
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // EDIT
  public edit(idLote: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + idLote);
  }

  // UPDATE
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }
}
