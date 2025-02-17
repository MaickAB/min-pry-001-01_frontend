export interface Persona {
  id?: number,
  idRegional?: number,
  idTipoPersona?: number,
  idTipoGenero?: number,
  documento: string,
  nombre: string,
  apePaterno: string,
  apeMaterno: string,
  direccion: string,
  fono: string,
  foto: string,
  descripcion: string,
  asignacion?: string,
  estado?: boolean
}