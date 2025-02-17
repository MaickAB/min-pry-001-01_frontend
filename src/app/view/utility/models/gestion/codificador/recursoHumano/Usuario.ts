export interface Usuario {
  id?: number,
  idRegional?: number,
  idPersona?: number,
  login: string,
  password: string,
  password_confirmation: string,
  email: string,
  fechaInicio: string,
  fechaFin: string,
  descripcion: string,
  roles?: UsuarioRol[];
  sucursales?: UsuarioSucursal[];
  estado?: boolean
}
export interface UsuarioRol {
  idRol: number
}
export interface UsuarioSucursal {
  idRegional: number
  idSucursal: number
}
