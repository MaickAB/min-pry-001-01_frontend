/* ==================================
        SERVICE RECEPCION
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RecepcionService {
  private url = environment.apiURL + 'registro/transito/recepcion/';

  constructor(
    private httpClient: HttpClient) { }

  // INDEX
  public index(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'index');
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
