export interface Sucursal {
  id?: number,
  idRegional?: number,
  nombre: string,
  descripcion: string,
  direccion: string,
  fono: string,
  numLoteInicio: string,
  numLoteFin: string,
  foto: string,
  estado?: boolean
}