'use client'

import { useTorneo } from '@/context/torneoContext';
import { Pareja } from '@/types/torneo';
import TablaPartidos from './crear/components/TablaPartidos';

const Torneos = () => {
  const { state } = useTorneo();

  console.log(state);

  return (
    <main className='flex flex-col mx-auto gap-6 md:mx-32 my-12 justify-center'>
      <h1 className='text-center text-5xl font-bold capitalize'>{state.torneo.nombre ? state.torneo.nombre : 'Torneo'}</h1>

      {/* zonas */}
      <h2 className='text-center text-2xl font-bold capitalize'>Zonas</h2>
      {state.zonas.map((categoria, idx) => (
        <div key={idx} className='w-screen sm:w-4xl py-8'>
          <h4 className='text-center font-semibold text-2xl mb-2'>{categoria.zonas[0].categoriaId}</h4>

          {/* zonas */}
          <div className='flex flex-col sm:flex-row sm:flex-wrap sm:justify-around gap-4'>
            {/* TODO fix types categorias zonas parejas */}
            {categoria.zonas.map((zona) => (
              <div className='flex flex-col w-fit gap-2 mx-auto sm:w-full lg:flex-wrap' key={zona.id}>

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

      <h2 className='text-center text-2xl font-bold capitalize'>Partidos de zona</h2>
      <TablaPartidos />

    </main>
  )
}

export default Torneos