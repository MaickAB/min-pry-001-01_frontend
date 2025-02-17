/* ==================================
        SERVICE COSTO
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CostoService {
  private url = 'http://127.0.0.1:8000/api/registro/comercializacion/compra/costo/';

  constructor(
    private httpClient: HttpClient) { }

  // INDEX
  public index(idLote: any): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index/' + idLote);
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

  // UPDATE
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }
}
