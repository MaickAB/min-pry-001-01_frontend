/* ==================================
        SERVICE COMUN
================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ComunService {

  // GET -> FECHA ACTUAL
  public getFechaHora() {
    return new Date();
  }

  // OBTIENE -> NÚMERO DE LOTE CON FORMATO
  public formatNumLote(numLote: number) {
    let numLoteFormated
    if (numLote < 10000)
      numLoteFormated = '0' + numLote;
    else
      if (numLote < 1000)
        numLoteFormated = '00' + numLote;
      else
        if (numLote < 100)
          numLoteFormated = '000' + numLote;
        else
          if (numLote < 10)
            numLoteFormated = '0000' + numLote;
          else
            numLoteFormated = numLote;
    return numLoteFormated;
  }
}
