import type { Partido, Zona } from "@/types/torneo";

export function nextPowerOfTwo(n: number): number {
  if (n <= 1) return 1;
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/** Equipos que entran a una ronda de eliminación (potencia de 2). */
export function nombreRondaEliminacion(equiposEnEstaRonda: number): string {
  if (equiposEnEstaRonda >= 16) return "Octavos de final";
  if (equiposEnEstaRonda === 8) return "Cuartos de final";
  if (equiposEnEstaRonda === 4) return "Semifinal";
  if (equiposEnEstaRonda === 2) return "Final";
  return "Eliminación";
}

export type ResumenElminacionCategoria = {
  partidosZona: number;
  partidosEliminacion: number;
  clasificados: number;
  cuposTerceros: number;
  equiposEnLlave: number;
};

/**
 * Cruces: primera ronda 1° vs 2° emparejado por orden de zona inversa (1°A vs 2° última…),
 * mezclado con 3° rep. en cola (labels); posteriores: Gan. #a vs Gan. #b.
 */
export function generarPartidosEliminacion(
  categoriaId: string,
  categoriaLabel: string,
  zonas: Zona[],
  idInicio: number,
): { partidos: Partido[]; resumen: ResumenElminacionCategoria; siguienteId: number } {
  const Z = zonas.length;
  if (Z < 1) {
    return {
      partidos: [],
      resumen: {
        partidosZona: 0,
        partidosEliminacion: 0,
        clasificados: 0,
        cuposTerceros: 0,
        equiposEnLlave: 0,
      },
      siguienteId: idInicio,
    };
  }

  const base = 2 * Z;
  const N = nextPowerOfTwo(base);
  const cuposTerceros = N - base;

  const labels: string[] = [];
  for (const z of zonas) {
    labels.push(`1° ${z.nombre}`);
    labels.push(`2° ${z.nombre}`);
  }
  for (let i = 0; i < cuposTerceros; i++) {
    labels.push(`3° (mejor ${i + 1})`);
  }

  const partidos: Partido[] = [];
  let idCounter = idInicio;
  const idANumGan: Map<string | number, number> = new Map();

  // Primera ronda: labels[i] vs labels[N-1-i]
  const primeraRonda: { id: string | number }[] = [];
  const equipos0 = N;
  const nPartidos0 = N / 2;
  for (let i = 0; i < nPartidos0; i++) {
    const id = idCounter++;
    const p1 = labels[i]!;
    const p2 = labels[N - 1 - i]!;
    partidos.push({
      id,
      categoriaId,
      categoria: categoriaLabel,
      fase: "eliminacion",
      ronda: nombreRondaEliminacion(equipos0),
      pareja1: p1,
      pareja2: p2,
      partidoAnterior1Id: undefined,
      partidoAnterior2Id: undefined,
    });
    const idx = partidos.length;
    idANumGan.set(id, idx);
    primeraRonda.push({ id });
  }

  let actual = primeraRonda.map((p) => p.id);
  let ronda = 1;

  while (actual.length > 1) {
    const equiposAhora = N / 2 ** ronda;
    const rondaLabel = nombreRondaEliminacion(equiposAhora);
    const siguiente: (string | number)[] = [];
    for (let j = 0; j < actual.length; j += 2) {
      const idA = actual[j]!;
      const idB = actual[j + 1]!;
      const id = idCounter++;
      const nA = idANumGan.get(idA) ?? 0;
      const nB = idANumGan.get(idB) ?? 0;
      partidos.push({
        id,
        categoriaId,
        categoria: categoriaLabel,
        fase: "eliminacion",
        ronda: rondaLabel,
        pareja1: `Gan. #${nA}`,
        pareja2: `Gan. #${nB}`,
        partidoAnterior1Id: idA,
        partidoAnterior2Id: idB,
      });
      idANumGan.set(id, partidos.length);
      siguiente.push(id);
    }
    actual = siguiente;
    ronda++;
  }

  return {
    partidos,
    resumen: {
      partidosZona: 0,
      partidosEliminacion: partidos.length,
      clasificados: base,
      cuposTerceros,
      equiposEnLlave: N,
    },
    siguienteId: idCounter,
  };
}
