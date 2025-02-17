export interface Permiso {
    id?: number,
    codigo: string,
    nombre: string,
    icono: string,
    url: string,
    idGrupo: number,
    opciones: Opcion[],
    estado?: boolean
}

export interface Opcion {
    id?: number,
    codigo: string,
    nombre: string,
    icono: string,
    url: string,
    idGrupo: number,
    estado?: boolean
}


