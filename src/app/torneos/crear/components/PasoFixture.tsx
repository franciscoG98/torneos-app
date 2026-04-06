'use client'

import { useState, useEffect } from 'react';
import { useTorneo } from '@/context/torneoContext';
import { Partido, Zona, Pareja } from '@/types/torneo';
import { generarPartidos } from '@/lib/generarPartidos';
import WizardBtn from "../ui/WizardBtn";

const PasoFixture = () => {
  const { state, dispatch } = useTorneo();

  const [loading, setLoading] = useState(false);
  const [fixture, setFixture] = useState<Partido[] | null>(null);
  const [zonas, setZonas] = useState<{ zonas: Zona[] }[]>([]);

  useEffect(() => {
    setZonas(state.zonas)
  }, [state.zonas]);


  const handleGenerarFixture = async () => {
    setLoading(true);

    try {
      const partidos = generarPartidos(zonas)
      console.log('dumb partidos', partidos);
      setFixture(partidos)

      dispatch({
        type: 'SET_PARTIDOS',
        payload: partidos,
      });
    } catch (error) {
      console.error('Error al generar fixture:', error);
      alert('Ocurrió un error al generar el fixture.');
    }

    setLoading(false);
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: state.step - 1 });
  };

  const handleNext = () => {
    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  };

  return (
    // TODO changing md:mx-32 for sm:mx-32 looks great
    <section className="flex flex-col mx-auto gap-6 md:mx-32 items-center">
      <h2 className="text-4xl text-center font-bold mt-8">Previsualizar Fixture</h2>

      <h3 className="text-3xl text-center font-semibold">Zonas</h3>
      {zonas.map((categoria, idx) => (
        <div key={idx} className='w-screen sm:w-full'>
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

      <button onClick={handleGenerarFixture} disabled={loading} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        {loading ? 'Generando...' : 'Generar Fixture'}
      </button>

      {fixture && (
        <div>
          <h3 className='text-center text-xl font-semibold my-2'>Listado de Partidos</h3>

          <table className="min-w-full divide-y divide-gray-200 flex flex-col border rounded">
            <thead className="bg-gray-700 text-white">
              <tr className="flex justify-around py-2 items-center font-medium">
                <th className="flex whitespace-nowrap p-1 mr-4">#</th>
                <th className="flex whitespace-nowrap p-1">Cat</th>
                <th className="hidden sm:flex whitespace-nowrap p-1">Zona</th>
                <th className="flex whitespace-nowrap p-1 w-48">Pareja 1</th>
                <th className="hidden sm:flex py-2 text-gray-700">Set a</th>
                <th className="hidden sm:flex py-2 text-gray-700">Set a</th>
                <th className="flex whitespace-nowrap p-1 w-48">Pareja 2</th>
              </tr>
            </thead>
            <tbody>
              {fixture.map((partido: Partido, idx: number) => (
                <tr key={partido.id} className="flex justify-around px-4 py-2 gap-2 border-b border-slate-300">
                  <td className="flex whitespace-nowrap p-1">{idx}</td>
                  <td className="flex whitespace-nowrap p-1 ml-8">{partido.categoria}</td>
                  <td className="hidden sm:flex whitespace-nowrap p-1 ml-4">{partido.zona}</td>
                  <td className="flex whitespace-nowrap p-1 w-48">{partido.pareja1}</td>
                  <td className="hidden sm:flex whitespace-nowrap py-2 px-8 border"></td>
                  <td className="hidden sm:flex whitespace-nowrap py-2 px-8 border"></td>
                  <td className="flex whitespace-nowrap p-1 w-48">{partido.pareja2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between gap-4">
        <WizardBtn handleClick={handleBack} back={true} text={"Anterior"} />
        <WizardBtn handleClick={handleNext} back={false} text={"Siguiente"} />
      </div>
    </section >
  );
};

export default PasoFixture;
