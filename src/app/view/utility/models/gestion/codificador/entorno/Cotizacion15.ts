export interface Cotizacion15 {
    id?: number,
    fecha: string,
    observacion: string,
    cotizacionmineral: CotMineral[],
    estado?: boolean
}

export interface CotMineral {
    idMineral?: number,
    idUnidadMedida?: number,
    valorCotizacion: number
    valorRegalia: number
}