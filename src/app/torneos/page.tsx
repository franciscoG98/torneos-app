'use client'

import { useTorneo } from '@/context/torneoContext';
import { Partido } from '@/types/torneo';

const Torneos = () => {
  const { state, dispatch } = useTorneo();

  console.log(state);

  return (
    <main className='flex flex-col mx-auto gap-6 md:mx-32 my-12 justify-center'>
      <h1 className='text-center text-5xl font-bold capitalize'>{state.torneo.nombre ? state.torneo.nombre : 'Torneo'}</h1>

      {/* zonas */}
      <h2 className='text-center text-2xl font-bold capitalize'>Zonas</h2>
      {state.zonas.map((categoria, idx) => (
        <div key={idx} className='w-screen sm:w-full py-8'>
          <h4 className='text-center font-semibold text-2xl mb-2'>{categoria.zonas[0].categoriaId}</h4>

          {/* zonas */}
          <div className='flex flex-col sm:flex-row sm:flex-wrap sm:justify-around gap-4'>
            {/* TODO fix types categorias zonas parejas */}
            {categoria.zonas.map((zona) => (
              <div className='flex flex-col w-fit gap-2 sm:w-[460px] mx-auto' key={zona.id}>

                {/* single zona */}
                <h5 className='font-semibold text-xl'>{zona.nombre}</h5>
                <table className="border w-fit sm:w-full">
                  <thead>
                    <tr>
                      <td className="border p-1 sm:p-2 font-bold"></td>
                      {zona.parejas.map((pareja: Pareja) => (
                        <th className="border p-1 sm:p-2" key={pareja.id} scope="col">
                          <span className='text-xs sm:text-sm text-red-500 whitespace-nowrap'>{pareja.jugador1}</span>
                          <br />
                          <span className='text-xs sm:text-sm text-red-500 whitespace-nowrap'>{pareja.jugador2}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {zona.parejas.map((pareja: Pareja, rowIdx: number) => (
                      <tr key={pareja.id}>
                        <th className="border p-1 sm:p-2" scope="row">
                          <span className='text-xs sm:text-sm text-blue-500 whitespace-nowrap'>{pareja.jugador1}</span>
                          <br />
                          <span className='text-xs sm:text-sm text-blue-500 whitespace-nowrap'>{pareja.jugador2}</span>
                        </th>

                        {/* celdas de resultados */}
                        {zona.parejas.map((rivalPareja: Pareja, colIdx: number) => (
                          <td
                            key={rivalPareja.id}
                            className={`border p-1 sm:p-2 text-center ${rowIdx === colIdx ? 'bg-gray-400' : ''}`}
                          ></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* listado partidos */}
      <h2 className='text-center text-2xl font-bold capitalize'>Partidos de zona</h2>
      <table className="mx-2 md:w-[700px] sm:mx-auto  flex flex-col border rounded">
        <thead className="bg-gray-700 text-white">
          <tr className="flex justify-around gap-2 py-2 items-center font-medium">
            <th className="flex whitespace-nowrap sm:p-1 mx-2">#</th>
            <th className="flex whitespace-nowrap sm:p-1">Cat</th>
            <th className="flex whitespace-nowrap sm:p-1">Zona</th>
            <th className="flex whitespace-nowrap sm:p-1 w-48">Pareja 1</th>
            <th className="hidden sm:flex py-2 text-gray-700">Set a</th>
            <th className="hidden sm:flex py-2 text-gray-700">Set a</th>
            <th className="flex whitespace-nowrap sm:p-1 w-48">Pareja 2</th>
          </tr>
        </thead>

        <tbody>
          {state.partidos.map((partido: Partido, idx: number) => (
            <tr key={partido.id} className="flex px-2 py-4 sm:px-4 sm:py-2 gap-2 border-b border-slate-300">
              <td className="text-xs items-center w-2 sm:text-base flex whitespace-nowrap sm:p-1">{idx}</td>
              <td className="text-xs items-center sm:text-base flex whitespace-nowrap sm:p-1 ml-2 sm:ml-8">{partido.categoria}</td>
              <td className="text-xs items-center sm:text-base flex whitespace-nowrap sm:p-1 ml-2">{partido.zona}</td>
              <td className="text-xs items-center sm:text-base flex whitespace-break-spaces sm:whitespace-nowrap sm:p-1 w-48">{partido.pareja1.replaceAll("- ", "\n")}</td>
              <td className="text-xs items-center sm:text-base hidden sm:flex whitespace-nowrap py-2 px-8 border"></td>
              <td className="text-xs items-center sm:text-base hidden sm:flex whitespace-nowrap py-2 px-8 border"></td>
              <td className="text-xs items-center sm:text-base flex whitespace-break-spaces sm:whitespace-nowrap sm:p-1 w-48">{partido.pareja2.replaceAll("- ", "\n")}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </main>
  )
}

export default Torneos