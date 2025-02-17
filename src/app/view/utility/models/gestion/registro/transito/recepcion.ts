export interface Recepcion {
  id?: number,
  idRegionalOrigen?: number,
  idSucursalOrigen?: number,
  idUsuarioOrigen?: number,
  fechaHoraOrigen: string,
  descripcionOrigen: string,
  idRegionalDestino?: number,
  idSucursalDestino?: number,
  idUsuarioDestino?: number | null,
  fechaHoraDestino: string,
  descripcionDestino: string,
  lotes: RecepcionDetalle[],
  estado?: boolean
}
export interface RecepcionDetalle {
  idLote?: number,
  estadoTransferencia: string,
  estadoRecepcion: string
}

