import { CotMineral } from "../entorno/Cotizacion";

export interface Mineral {
  id?: number,
  idTipoMineral?: number;
  codigo: string,
  abreviatura: string,
  nombre: string,
  descripcion: string,
  foto: string,
  cotizacion?: CotMineral;
  cotizacion15?: CotMineral;
  minerales?: MineralComplejo[];
  estado?: boolean,
}
export interface MineralComplejo {
  idMineralComponente?: number;
}