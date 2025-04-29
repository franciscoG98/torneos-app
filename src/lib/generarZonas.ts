export const generarZonas = (cat, cantidadDeZonas, parejasPorZona) => {
  const parejasInscriptas = parejasPorZona * cantidadDeZonas
  const parejas = []

  for (let i = 0; i < parejasInscriptas; i++) {
    parejas.push({
      id: crypto.randomUUID(),
      jugador1: `jugador ${i}`,
      jugador2: `jugador ${i}`,
      categoria: cat
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
