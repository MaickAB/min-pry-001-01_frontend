/* ==================================
        SERVICE TRANSFERENCIA
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {
  private url = environment.apiURL + 'registro/transito/transferencia/';

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

  // UPDATE
  public update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

  // DESTROY
  public destroy(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + 'destroy/' + id);
  }
}
