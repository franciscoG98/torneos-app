import { Partido, Zona } from "@/types/torneo";
import { generarPartidosEliminacion } from "@/lib/llaveEliminacion";

function labelPareja(p: { jugador1: string; jugador2: string }): string {
  return `${p.jugador1} - ${p.jugador2}`;
}

/**
 * Zona: todos contra todos. Por categoría: fase eliminatoria (1°/2° por zona + 3° rep. a potencia de 2).
 * ids numéricos secuenciales.
 */
export const generarPartidos = (bloques: { zonas: Zona[] }[]): Partido[] => {
  const partidos: Partido[] = [];
  let partidoId = 0;

  for (const { zonas } of bloques) {
    if (zonas.length === 0) continue;
    const categoriaId = zonas[0]!.categoriaId;

    for (const zona of zonas) {
      const nombreCategoria = zona.categoriaId;
      const nombreZona = zona.nombre;
      const { parejas } = zona;

      for (let i = 0; i < parejas.length; i++) {
        for (let j = i + 1; j < parejas.length; j++) {
          const a = parejas[i]!;
          const b = parejas[j]!;
          partidos.push({
            id: partidoId++,
            categoriaId: nombreCategoria,
            categoria: nombreCategoria,
            zonaId: zona.id,
            zona: nombreZona,
            fase: "zona",
            ronda: nombreZona,
            pareja1: labelPareja(a),
            pareja2: labelPareja(b),
            pareja1Id: a.id,
            pareja2Id: b.id,
          });
        }
      }
    }

    const nZona = partidos.filter(
      (p) => p.categoriaId === categoriaId && p.fase === "zona",
    ).length;
    const { partidos: ko, resumen, siguienteId } = generarPartidosEliminacion(
      categoriaId,
      categoriaId,
      zonas,
      partidoId,
    );
    partidoId = siguienteId;
    resumen.partidosZona = nZona;
    for (const k of ko) {
      partidos.push(k);
    }
  }

  return partidos;
};

export function conteoPartidosPorCategoria(
  partidos: Partido[],
  categoriaId: string,
): { zona: number; eliminacion: number } {
  let zona = 0;
  let eliminacion = 0;
  for (const p of partidos) {
    if (p.categoriaId !== categoriaId) continue;
    if (p.fase === "zona") zona++;
    else if (p.fase === "eliminacion") eliminacion++;
  }
  return { zona, eliminacion };
}
