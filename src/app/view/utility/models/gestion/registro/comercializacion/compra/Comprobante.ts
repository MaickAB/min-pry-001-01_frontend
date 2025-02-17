export interface comprobante {
  id?: number,
  numLote: string,
  idDivisa?: number,
  cotizacionDivisa?: number;
  idMineral: number,
  cotizacionMineral?: number;
  idCooperativa: number,
  idSocio: number,
  sacos: string,
  pesoBruto: string,
  tara: number,
  humedad: number,
  pesoNeto?: number,
  totalPagarSus: number,
  totalPagarBs?: number,
  regaliaSus?: number,
  regaliaBs?: number,
  deduccion?: number,
  descuento?: number,
  totalDescuento?: number,
  totalLiquidacion?: number,
  idSucursal: number,
  idUsuario: number,
  fechaHora: string,
  estado?: boolean
}
