export const generarPartidos = (torneo) => {
  const partidos = []
  let partidoIndex = 0

  // Recorrer categorias
  for (const categoria in torneo) {
    // Recorrer cada zona de la categoría
    for (const zona of torneo[categoria].zonas) {
      const nombreCategoria = zona.categoriaId
      const nombreZona = zona.nombre
      const parejas = zona.parejas

      // Generar todas las combinaciones posibles de partidos
      for (let i = 0; i < parejas.length; i++) {
        for (let j = i + 1; j < parejas.length; j++) {
          // Crear un objeto de partido individual
          partidos.push({
            id: partidoIndex++,
            categoria: nombreCategoria,
            zona: nombreZona,
            pareja1: `${parejas[i].jugador1} - ${parejas[i].jugador2}`,
            pareja2: `${parejas[j].jugador1} - ${parejas[j].jugador2}`,
          })
        }
      }
    }
  }

  return partidos
}