export interface Cotizacion15 {
    id?: number,
    fecha: string,
    observacion: string,
    cotizacion_mineral: CotMineral[],
    estado?: boolean
}

export interface CotMineral {
    idMineral?: number,
    idUnidadMedida?: number,
    valorCotizacion: number
    valorRegalia: number
}