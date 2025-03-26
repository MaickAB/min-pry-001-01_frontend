export interface Ley {
  id?: number,
  idLote?: number,
  idSolicitante?: number,
  idLaboratorio?: number | null,
  detalles: [
    idMineral: number,
    idUnidadMedidaLey: string,
    valor: string,
  ]
  estado?: boolean
}

