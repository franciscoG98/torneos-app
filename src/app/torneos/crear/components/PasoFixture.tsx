'use client'

import { useState } from 'react';
import { useTorneo } from '@/context/torneoContext';
import { Pareja } from '@/types/torneo';
import { conteoPartidosPorCategoria, generarPartidos } from '@/lib/generarPartidos';
import { isWizardStepComplete } from '@/lib/torneoWizardValidation';
import WizardBtn from "../ui/WizardBtn";
import TablaPartidos from './TablaPartidos';
import TablaPosicionesZona from './TablaPosicionesZona';

const PasoFixture = () => {
  const { state, dispatch } = useTorneo();
  const zonas = state.zonas;
  const partidos = state.partidos;

  const [loading, setLoading] = useState(false);

  const handleGenerarFixture = async () => {
    setLoading(true);

    try {
      const generados = generarPartidos(state.zonas);
      dispatch({
        type: 'SET_PARTIDOS',
        payload: generados,
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
    if (!isWizardStepComplete(3, state)) return;
    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  };

  const nextDisabled = !isWizardStepComplete(3, state);

  return (
    // TODO changing md:mx-32 for sm:mx-32 looks great
    <section className="flex flex-col mx-auto gap-6 md:mx-32 items-center">
      <h2 className="text-4xl text-center font-bold mt-8">Previsualizar Fixture</h2>

      <h3 className="text-3xl text-center font-semibold">Zonas</h3>
      {zonas.map((categoria, idx) => {
        const catId = categoria.zonas[0]?.categoriaId;
        const conteo = catId ? conteoPartidosPorCategoria(partidos, catId) : null;
        return (
        <div key={idx} className='w-screen sm:w-full'>
          <h4 className='text-center font-semibold text-2xl mb-1'>{catId ?? '—'}</h4>
          {conteo && conteo.zona + conteo.eliminacion > 0 ? (
            <p className="text-center text-sm text-neutral-600 mb-2">
              Zona: {conteo.zona} partidos · Eliminación: {conteo.eliminacion} partidos
            </p>
          ) : null}

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
                <TablaPosicionesZona
                  parejas={zona.parejas}
                  zonaId={zona.id}
                  partidos={partidos}
                />
              </div>
            ))}
          </div>
        </div>
        );
      })}

      <button onClick={handleGenerarFixture} disabled={loading} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        {loading ? 'Generando...' : 'Generar Fixture'}
      </button>

      {partidos.length > 0 ? (
        <div className="w-full max-w-6xl">
          <h3 className="text-center text-xl font-semibold my-2">Listado de Partidos</h3>
          <TablaPartidos />
        </div>
      ) : null}

      <div className="flex justify-between gap-4">
        <WizardBtn handleClick={handleBack} back={true} text={"Anterior"} />
        <WizardBtn handleClick={handleNext} back={false} text={"Siguiente"} disabled={nextDisabled} />
      </div>
    </section >
  );
};

export default PasoFixture;
