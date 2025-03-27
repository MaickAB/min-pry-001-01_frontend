/* ==================================
        SERVICE LOTE
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private url = environment.apiURL + 'registro/comercializacion/compra/lote/';

  constructor(
    private httpClient: HttpClient) { }

  // INDEX
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
  }

  // CREATE
  public create(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'create');
  }

  // STORE
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // EDIT
  public edit(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit/' + id);
  }

  // SHOW
  public show(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'show/' + id);
  }

  // UPDATE
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // DESTROY
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }

  // OBTIENE -> NUM DE LOTE
  public getNumLote(idSucursal: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'numLote/' + idSucursal);
  }

  // UPDATE-STATE
  public updateState(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'updateState', data);
  }

  // REPORT
  public report(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'report/' + id);
  }
}
