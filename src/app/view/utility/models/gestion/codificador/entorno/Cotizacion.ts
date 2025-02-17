export interface Cotizacion {
    id?: number,
    fecha: string,
    observacion: string,
    cotizacionmineral: CotMineral[],
    cotizaciondivisa: CotDivisa[],
    estado?: boolean
}

export interface CotMineral {
    idMineral?: number,
    idUnidadMedida?: number,
    valorCotizacion: number
}

export interface CotDivisa {
    idDivisa?: number,
    valor: number
}


