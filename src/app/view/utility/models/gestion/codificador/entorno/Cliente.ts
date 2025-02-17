export interface Cliente {
  id?: number,
  idRegional?: number,
  codigo: string,
  nombre: string,
  descripcion: string,
  fono: string,
  estado?: boolean
}