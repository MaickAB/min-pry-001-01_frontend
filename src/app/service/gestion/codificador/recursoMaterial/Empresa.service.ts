/* ==================================
        SERVICE EMPRESA
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../../../view/utility/models/gestion/codificador/recursoMaterial/Empresa';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private url = environment.apiURL + 'codificador/recursoMaterial/empresa/';

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
