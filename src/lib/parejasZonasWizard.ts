import { CsvParejaFila, Pareja, Zona } from "@/types/torneo";

export function parseParejasCsv(contenido: string): CsvParejaFila[] {
  const text = contenido.replace(/^\uFEFF/, "").trim();
  const lineas = text.split(/\r?\n/);
  const out: CsvParejaFila[] = [];

  for (let i = 1; i < lineas.length; i++) {
    const linea = lineas[i].trim();
    if (!linea) continue;
    const columnas = linea.split(/[\t,]/).map((c) => c.trim());
    if (columnas.length >= 3) {
      const num = parseInt(columnas[0]!, 10) || i;
      out.push({
        numero: num,
        delantero: columnas[1]!,
        zaguero: columnas[2]!,
      });
    }
  }
  return out;
}

function generarZonasCategoria(
  categoriaId: string,
  cantidadDeZonas: number,
  parejasPorZona: number,
  filasCsv: CsvParejaFila[]
): { zonas: Zona[] } {
  const parejasInscriptas = parejasPorZona * cantidadDeZonas;
  const parejas: Pareja[] = [];

  for (let i = 0; i < parejasInscriptas; i++) {
    const fila = filasCsv[i];
    parejas.push({
      id: crypto.randomUUID(),
      jugador1: fila?.delantero || `Delantero ${i + 1}`,
      jugador2: fila?.zaguero || `Zaguero ${i + 1}`,
      categoriaId,
    });
  }

  const zonas: Zona[] = [];
  for (let i = 0; i < cantidadDeZonas; i++) {
    zonas.push({
      id: crypto.randomUUID(),
      nombre: "Zona " + String.fromCharCode(65 + i),
      categoriaId,
      parejas: parejas.slice(0, parejasPorZona),
    });
    for (let j = 0; j < parejasPorZona; j++) {
      parejas.shift();
    }
  }

  return { zonas };
}

export type ZonasConfigFila = { zonas: number; parejasPorZona: number };

/**
 * Un bloque { zonas } por categoría, en el mismo orden que `categorias`.
 * Toma rebanadas consecutivas de `csv` para cada categoría (nº parejas = zonas × ppz).
 */
export function construirBloquesZonas(
  categorias: { nombre: string }[],
  configuraciones: Record<string, ZonasConfigFila | undefined>,
  csv: CsvParejaFila[]
): { bloques: { zonas: Zona[] }[] } | { error: string } {
  const bloques: { zonas: Zona[] }[] = [];
  let indice = 0;

  for (const cat of categorias) {
    const cfg = configuraciones[cat.nombre];
    if (!cfg || !cfg.zonas || !cfg.parejasPorZona) {
      return { error: `Falta configurar zonas para la categoría "${cat.nombre}".` };
    }
    const n = cfg.zonas * cfg.parejasPorZona;
    const trozo = csv.slice(indice, indice + n);
    indice += n;
    const bloque = generarZonasCategoria(cat.nombre, cfg.zonas, cfg.parejasPorZona, trozo);
    bloques.push(bloque);
  }

  return { bloques };
}
