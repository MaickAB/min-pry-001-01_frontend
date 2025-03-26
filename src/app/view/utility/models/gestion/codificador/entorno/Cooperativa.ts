import { Regional } from "../recursoMaterial/Regional";

export interface Cooperativa {
    id?: number,
    idRegional?: number,
    codigo: string,
    nombre: string,
    descripcion: string,
    regional?: Regional;
    estado?: boolean
}