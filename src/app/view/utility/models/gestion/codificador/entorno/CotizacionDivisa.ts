export interface CotizacionDivisa {
    id?: number,
    fecha: string,
    observacion: string,
    valores: Valor[],
    estado?: boolean
}

export interface Valor {
    idDivisa?: number,
    valor: number
}


