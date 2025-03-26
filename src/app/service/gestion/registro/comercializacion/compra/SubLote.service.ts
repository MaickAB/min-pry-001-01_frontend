/* ==================================
        SERVICE SUBLOTE
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubLoteService {
  private url = 'http://127.0.0.1:8000/api/registro/comercializacion/compra/subLote/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> LISTADO DE SUBLOTES
  public index(id: any): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index/' + id);
  }

  // GUARDA -> LOTE
  public store(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'store', data);
  }

  // ACTUALIZA -> SUBLOTE
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // ELIMINA -> SUBLOTE
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }

  // REPORT
  public report(id: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'report/' + id);
  }
}
