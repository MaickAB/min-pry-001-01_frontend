/* ==================================
        SERVICE EMPRESA
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../../../view/utility/models/gestion/codificador/recursoMaterial/Empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private url = 'http://127.0.0.1:8000/api/codificador/recursoMaterial/empresa/';

  constructor(
    private httpClient: HttpClient) { }

  // OBTIENE -> EMPRESA
  public edit(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'edit');
  }

  // ACTUALIZA -> EMPRESA
  public update(data: Empresa): Observable<any> {
    return this.httpClient.put<any>(this.url + 'update', data);
  }

}
