export interface Transferencia {
  id?: number,
  idRegionalOrigen?: number,
  idSucursalOrigen?: number,
  idUsuarioOrigen?: number,
  fechaHoraOrigen: string,
  descripcionOrigen: string,
  idRegionalDestino?: number,
  idSucursalDestino?: number,
  lotes: TransferenciaDetalle[],
  estado?: boolean
}
export interface TransferenciaDetalle {
  idLote?: number
}

