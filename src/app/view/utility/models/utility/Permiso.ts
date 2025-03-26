export interface Permiso {
    id?: string,
    codigo: string,
    nombre: string,
    icono: string,
    url: string,
    idGrupo: number,
    opciones: Opcion[],
    estado?: boolean
}

export interface Opcion {
    id?: string,
    codigo: string,
    nombre: string,
    icono: string,
    url: string,
    idGrupo: number,
    estado?: boolean
}


