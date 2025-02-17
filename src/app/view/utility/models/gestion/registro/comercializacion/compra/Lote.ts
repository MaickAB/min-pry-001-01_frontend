export interface Lote {
  id?: number,
  idRegional?: number,
  idSucursal?: number,
  idUsuario?: number,
  idCooperativa?: number,
  idSocio?: number,
  idMineral?: number,
  idMoliendero?: number | null,
  numLote: string,
  sacos: string,
  pesoBruto: string,
  humedad: number,
  tara: number,
  fechaHora?: Date,
  estado?: boolean
}
