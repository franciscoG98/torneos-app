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

/** Fila de CSV Pareja, Delantero, Zaguero (carga de inscripciones). */
export interface CsvParejaFila {
  numero: number;
  delantero: string;
  zaguero: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  tipoPuntaje: "3 sets" | "5 sets" | "sets 12" | "sets 15" | "puntos 20" | "puntos 25" | "puntos 30";
  zonas: Zona[];
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
  parejas: Pareja[];
}

export type PartidoFase = "zona" | "eliminacion";

export interface Partido {
  id: string | number;
  categoriaId?: string;
  zonaId?: string;
  categoria?: string;
  zona?: string;
  pareja1: string;
  pareja2: string;
  fase: PartidoFase;
  /** En zona: nombre de la zona; en eliminación: ronda (ver `nombreRondaEliminacion`). */
  ronda: string;
  // cancha asignada (1, 2, 3, etc.)
  cancha?: number;
  horario?: string;
  pareja1Id?: string;
  pareja2Id?: string;
  /** Partidos de zona previos a este, para cruce KO con placeholders. */
  partidoAnterior1Id?: string | number;
  partidoAnterior2Id?: string | number;
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
  /** Parejas leídas del CSV (nombres); alimenta la generación de zonas. */
  parejasCsv: CsvParejaFila[];
  zonas: { zonas: Zona[] }[];
  partidos: Partido[];
  ranking: Ranking[];
  step: number;
}

export type TorneoAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_TORNEO"; payload: Partial<Torneo> }
  | { type: "SET_CATEGORIAS"; payload: Categoria[] }
  | { type: "SET_PAREJAS"; payload: Pareja[] }
  | { type: "SET_PAREJAS_CSV"; payload: CsvParejaFila[] }
  | { type: "SET_ZONAS"; payload: { zonas: Zona[] }[] }
  | { type: "SET_PARTIDOS"; payload: Partido[] }
  | { type: "UPDATE_PARTIDO"; payload: { id: Partido["id"]; patch: Partial<Partido> } }
  | { type: "SET_RANKING"; payload: Ranking[] };
