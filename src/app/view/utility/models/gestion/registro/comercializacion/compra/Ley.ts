export interface Ley {
  id?: number,
  idLote?: number,
  idSolicitante?: number,
  idLaboratorio?: number,
  detalles: [
    idMineral: number,
    idUnidadMedidaLey: string,
    valor: string,
  ]
  estado?: boolean
}

