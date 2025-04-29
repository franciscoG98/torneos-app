'use client';

import { useState } from 'react';
import { useTorneo } from '@/context/torneoContext';
import { Categoria } from '@/types/torneo';
import WizardBtn from '../ui/WizardBtn';
import { generarZonas } from '@/lib/generarZonas';

export default function PasoZonas() {
  const { state, dispatch } = useTorneo();

  const [configuraciones, setConfiguraciones] = useState<Record<string, { zonas: number; parejasPorZona: number, categoria: Categoria }>>({});

  function handleChange(name: string, field: 'zonas' | 'parejasPorZona', value: number) {
    setConfiguraciones(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value,
      },
    }));
  }

  const generarParejas = () => {
    const data = configuraciones

    const aux = []

    Object.keys(data).map((key, idx) => {
      aux[idx] = data[key];
      aux[idx].categoria = key;
    });

    let zonas = []

    for (let i = 0; i < aux.length; i++) {
      const newZona = generarZonas(aux[i].categoria, aux[i].zonas, aux[i].parejasPorZona)

      zonas.push(newZona)
    }

    dispatch({ type: 'SET_ZONAS', payload: zonas });
    alert('Zonas generadas correctamente!');
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: state.step - 1 });
  };

  const handleNext = () => {
    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  };

  return (
    <section className="flex flex-col mx-auto gap-6 md:mx-32 items-center">
      <h2 className="text-4xl text-center font-bold mt-6">Configurar Zonas</h2>

      {/* configurar parejas y zonas por categoria */}
      <div className='flex flex-wrap gap-4 justify-center'>
        {state.categorias.map(categoria => (
          <div key={categoria.id} className="m-4 border p-4 rounded">
            <h3 className="text-xl text-center capitalize font-semibold mb-4">{categoria.nombre}</h3>

            <div className="flex gap-4 mb-4">
              <div>
                <label className="block mb-1">Cantidad de zonas</label>
                <input
                  type="number"
                  min={1}
                  value={configuraciones[categoria.nombre]?.zonas || ''}
                  onChange={(e) => handleChange(categoria.nombre, 'zonas', Number(e.target.value))}
                  className="border p-2 rounded w-32"
                />
              </div>

              <div>
                <label className="block mb-1">Parejas por zona</label>
                <input
                  type="number"
                  min={1}
                  value={configuraciones[categoria.nombre]?.parejasPorZona || ''}
                  onChange={(e) => handleChange(categoria.nombre, 'parejasPorZona', Number(e.target.value))}
                  className="border p-2 rounded w-32"
                />
              </div>
            </div>

            {configuraciones[categoria.nombre] && (
              <p className="text-gray-700">
                {configuraciones[categoria.nombre].zonas} zonas de {configuraciones[categoria.nombre].parejasPorZona} parejas
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={generarParejas}
        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded"
      >
        Generar Zonas
      </button>
      {/* configurar parejas y zonas por categoria */}

      <h3 className='text-center font-semibold text-4xl'>Preview Zonas</h3>

      <div className='flex flex-col gap-4 justify-center'>
        {state.zonas.map((zona, idx) => (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4' key={idx}>

            {zona.zonas.map(zona => (
              <div className='border p-2 w-72' key={zona.id}>
                <h4 className='p-2 text-lg bg-gray-700 text-white font-semibold'>{zona.categoriaId} - {zona.nombre}</h4>

                <ul>
                  {zona.parejas.map(pareja => (
                    <li className='p-2 border-b mx-1' key={pareja.id}>{pareja.jugador1} - {pareja.jugador2}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <WizardBtn handleClick={handleBack} back={true} text={"Anterior"} />
        <WizardBtn handleClick={handleNext} back={false} text={"Siguiente"} />
      </div>
    </section>
  );
}
