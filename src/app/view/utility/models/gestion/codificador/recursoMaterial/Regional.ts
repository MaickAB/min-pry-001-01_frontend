import { Sucursal } from "./Sucursal";

export interface Regional {
  id?: number,
  nombre: string,
  sucursales: Sucursal[],
  estado?: boolean
}