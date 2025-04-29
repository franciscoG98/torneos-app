export type Deporte = 'paddle' | 'paleta'

export interface CrearTorneoInput {
  nombre: string;
  deporte: Deporte;
  fechaInicio: Date;
  fechaFin: Date;
  cantidadCanchas: number;
  categorias: string[];
}
