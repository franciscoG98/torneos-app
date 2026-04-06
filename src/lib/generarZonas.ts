import { Pareja, Zona } from "@/types/torneo"

export const generarZonas = (cat: string, cantidadDeZonas: number, parejasPorZona: number): { zonas: Zona[] } => {
  const parejasInscriptas = parejasPorZona * cantidadDeZonas
  const parejas: Pareja[] = []

  for (let i = 0; i < parejasInscriptas; i++) {
    parejas.push({
      id: crypto.randomUUID(),
      jugador1: `jugador ${i}`,
      jugador2: `jugador ${i}`,
      categoriaId: cat
    })
  }

  const zonas = []

  for (let i = 0; i < cantidadDeZonas; i++) {
    zonas.push({
      id: crypto.randomUUID(),
      nombre: 'Zona ' + i,
      categoriaId: cat,
      parejas: parejas.slice(0, parejasPorZona)
    })

    for (let j = 0; j < parejasPorZona; j++) {
      parejas.shift()
    }
  }

  return { zonas }
}
