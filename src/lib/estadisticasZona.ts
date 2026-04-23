import type { Pareja, Partido } from "@/types/torneo";

export type FilaEstadisticaZona = {
  pareja: Pareja;
  /** Partidos ganados */
  pg: number;
  pf: number;
  pc: number;
  posicion: number;
};

/**
 * Cómputo por zona a partir de partidos con fase "zona" y resultado.
 * Desempate: PG, diferencia (PF−PC), PF.
 */
export function estadisticasZona(
  parejas: Pareja[],
  partidosZona: Partido[],
): FilaEstadisticaZona[] {
  const byId: Record<string, { pg: number; pf: number; pc: number }> = {};
  for (const p of parejas) {
    byId[p.id] = { pg: 0, pf: 0, pc: 0 };
  }

  for (const m of partidosZona) {
    if (m.fase !== "zona" || !m.pareja1Id || !m.pareja2Id) continue;
    const r = m.resultado;
    if (!r) continue;
    const a = m.pareja1Id;
    const b = m.pareja2Id;
    if (!byId[a] || !byId[b]) continue;

    const p1 = r.puntosPareja1;
    const p2 = r.puntosPareja2;
    if (r.ganadorId === a) {
      byId[a]!.pg += 1;
      byId[a]!.pf += p1;
      byId[a]!.pc += p2;
      byId[b]!.pf += p2;
      byId[b]!.pc += p1;
    } else if (r.ganadorId === b) {
      byId[b]!.pg += 1;
      byId[b]!.pf += p2;
      byId[b]!.pc += p1;
      byId[a]!.pf += p1;
      byId[a]!.pc += p2;
    } else {
      // Empate o ganador desconocido: sumar goles
      byId[a]!.pf += p1;
      byId[a]!.pc += p2;
      byId[b]!.pf += p2;
      byId[b]!.pc += p1;
    }
  }

  const filas: FilaEstadisticaZona[] = parejas.map((p) => {
    const s = byId[p.id]!;
    return { pareja: p, pg: s.pg, pf: s.pf, pc: s.pc, posicion: 0 };
  });

  filas.sort((x, y) => {
    if (y.pg !== x.pg) return y.pg - x.pg;
    const dx = y.pf - y.pc - (x.pf - x.pc);
    if (dx !== 0) return dx;
    return y.pf - x.pf;
  });

  filas.forEach((f, i) => {
    f.posicion = i + 1;
  });

  return filas;
}

/** Partidos de una zona (por id de zona) con fase zona. */
export function partidosDeZona(partidos: Partido[], zonaId: string): Partido[] {
  return partidos.filter((p) => p.fase === "zona" && p.zonaId === zonaId);
}
