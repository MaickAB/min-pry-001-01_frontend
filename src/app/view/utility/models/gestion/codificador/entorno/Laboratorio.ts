import { Regional } from "../recursoMaterial/Regional"

export interface Laboratorio {
  id?: number,
  idRegional?: number,
  codigo: string,
  nombre: string,
  descripcion: string,
  fono: string,
  regional?: Regional,
  estado?: boolean
}