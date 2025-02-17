import { Socio } from "./Socio";

export interface CooperativaWithSocios {
    id?: number,
    codigo: string,
    nombre: string,
    descripcion: string,
    socios: Socio[],
    estado?: boolean
}