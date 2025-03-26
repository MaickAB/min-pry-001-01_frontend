/* ==================================
        SERVICE COMUN
================================== */
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ComunService {

  constructor(private sanitizer: DomSanitizer) { }

  // GET -> FECHA ACTUAL
  public getFechaHora() {
    return new Date();
  }

  // GET -> NÚMERO DE LOTE CON FORMATO
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

  // PREPARE -> REPORT PDF
  public formatPDF(reportBase64: any) {
    const pdfData = atob(reportBase64); // Decodifica la cadena base64
    const byteArray = new Uint8Array(pdfData.length);
    for (let i = 0; i < pdfData.length; i++) {
      byteArray[i] = pdfData.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
  }

}
