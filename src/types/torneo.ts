import { Deporte } from "./wizard";

export interface Torneo {
  id?: string;
  nombre: string;
  deporte: Deporte;
  fechaInicio: Date;
  fechaFin: Date;
  cantidadCanchas: number;
  estado: "borrador" | "activo" | "finalizado";
}

export interface Categoria {
  id: string;
  nombre: string;
  tipoPuntaje: "3 sets" | "5 sets" | "sets 12" | "sets 15" | "puntos 20" | "puntos 25" | "puntos 30";

}

export interface Pareja {
  id: string;
  jugador1: string;
  jugador2: string;
  jugadorSuplente?: string;
  categoriaId: string;
}

export interface Zona {
  id: string;
  nombre: string;
  categoriaId: string;
  parejas: string[];
}

export interface Partido {
  id: string;
  categoriaId: string;
  zonaId?: string;
  // cancha asignada (1, 2, 3, etc.)
  cancha?: number;
  horario?: string;
  pareja1Id: string;
  pareja2Id: string;
  // TODO check puntos
  resultado?: {
    ganadorId: string;
    puntosPareja1: number;
    puntosPareja2: number;
  };
}

export interface Ranking {
  jugador: string;
  categoriaId: string;
  puntos: number;
}

export interface TorneoState {
  torneo: Torneo;
  categorias: Categoria[];
  parejas: Pareja[];
  zonas: Zona[];
  partidos: Partido[];
  ranking: Ranking[];
  step: number;
}

export type TorneoAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_TORNEO"; payload: Partial<Torneo> }
  | { type: "SET_CATEGORIAS"; payload: Categoria[] }
  | { type: "SET_PAREJAS"; payload: Pareja[] }
  | { type: "SET_ZONAS"; payload: Zona[] }
  | { type: "SET_PARTIDOS"; payload: Partido[] }
  | { type: "SET_RANKING"; payload: Ranking[] };
