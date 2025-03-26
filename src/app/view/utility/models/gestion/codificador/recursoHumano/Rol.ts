export interface Rol {
    id?: number,
    idRegional?: number,
    nombre: string,
    descripcion: string,
    permisos: Permiso[],
    estado?: boolean
}
interface Permiso {
    id?: string
}




