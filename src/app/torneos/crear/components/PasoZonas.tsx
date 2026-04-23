'use client';

import { useState, useRef } from 'react';
import { useTorneo } from '@/context/torneoContext';
import WizardBtn from '../ui/WizardBtn';
import { isWizardStepComplete } from '@/lib/torneoWizardValidation';
import { parseParejasCsv, construirBloquesZonas } from '@/lib/parejasZonasWizard';
import { CsvParejaFila } from '@/types/torneo';

const EJEMPLO_CSV = '/parejas.csv';

export default function PasoZonas() {
  const { state, dispatch } = useTorneo();
  const { parejasCsv, categorias } = state;

  const [configuraciones, setConfiguraciones] = useState<Record<string, { zonas: number; parejasPorZona: number }>>({});
  const [cargandoEjemplo, setCargandoEjemplo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(name: string, field: 'zonas' | 'parejasPorZona', value: number) {
    setConfiguraciones((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value,
      },
    }));
  }

  const aplicarCsvYOpcionalZonas = (filas: CsvParejaFila[]) => {
    dispatch({ type: 'SET_PAREJAS_CSV', payload: filas });
    if (categorias.length > 0) {
      const puedeCerrar = categorias.every((c) => {
        const cfg = configuraciones[c.nombre];
        return cfg && cfg.zonas >= 1 && cfg.parejasPorZona >= 1;
      });
      if (puedeCerrar) {
        const r = construirBloquesZonas(categorias, configuraciones, filas);
        if (!('error' in r) && r.bloques) {
          dispatch({ type: 'SET_ZONAS', payload: r.bloques });
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const contenido = event.target?.result as string;
      const filas = parseParejasCsv(contenido);
      aplicarCsvYOpcionalZonas(filas);
      const msg =
        filas.length > 0
          ? `${filas.length} parejas cargadas desde CSV.`
          : 'No se leyeron filas (revisá el formato: Pareja, Delantero, Zaguero).';
      alert(
        filas.length > 0
          ? `${msg} ${
              categorias.length > 0
                ? 'Revisá que cada categoría tenga zonas y ppz, y usá "Generar Zonas" si hace falta.'
                : ''
            }`
          : msg
      );
    };
    reader.readAsText(file, 'UTF-8');
  };

  const cargarEjemplo = async () => {
    setCargandoEjemplo(true);
    try {
      const res = await fetch(EJEMPLO_CSV);
      if (!res.ok) {
        throw new Error(String(res.status));
      }
      const text = await res.text();
      const filas = parseParejasCsv(text);
      aplicarCsvYOpcionalZonas(filas);
      alert(
        filas.length > 0
          ? `${filas.length} filas del ejemplo (public/parejas.csv). Completá zonas y "Generar Zonas" si aún no creaste el fixture.`
          : 'No se pudo leer el ejemplo.'
      );
    } catch {
      alert('No se pudo descargar el CSV de ejemplo.');
    } finally {
      setCargandoEjemplo(false);
    }
  };

  const generarParejas = () => {
    if (categorias.length === 0) {
      alert('Añadí al menos una categoría primero.');
      return;
    }
    if (parejasCsv.length === 0) {
      if (!confirm('No hay CSV cargado. ¿Generar con nombres placeholder?')) {
        return;
      }
    }

    const r = construirBloquesZonas(categorias, configuraciones, parejasCsv);
    if ('error' in r) {
      alert(r.error);
      return;
    }

    dispatch({ type: 'SET_ZONAS', payload: r.bloques });
    alert('Zonas generadas correctamente.');
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: state.step - 1 });
  };

  const handleNext = () => {
    if (!isWizardStepComplete(2, state)) return;
    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  };

  const nextDisabled = !isWizardStepComplete(2, state);

  return (
    <section className="flex flex-col mx-auto gap-6 md:mx-32 items-center">
      <h2 className="text-4xl text-center font-bold mt-6">Configurar Zonas</h2>

      {/* Upload CSV */}
      <div className="border p-4 rounded bg-gray-50 w-full max-w-md">
        <h3 className="font-semibold mb-2">Cargar Parejas desde CSV</h3>
        <p className="text-sm text-gray-600 mb-2">
          Formato: Pareja, Delantero, Zaguero (separado por tab o coma). UTF-8, una fila de encabezado.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="button"
          onClick={cargarEjemplo}
          disabled={cargandoEjemplo}
          className="mt-3 w-full text-sm text-blue-700 underline disabled:opacity-50"
        >
          {cargandoEjemplo ? 'Cargando...' : 'Cargar ejemplo (parejas del proyecto)'}
        </button>
        {parejasCsv.length > 0 && (
          <p className="text-sm text-green-600 mt-2">
            {parejasCsv.length} filas de nombres en memoria
          </p>
        )}
      </div>

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
                {configuraciones[categoria.nombre]!.zonas} zonas de {configuraciones[categoria.nombre]!.parejasPorZona} parejas
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
        <WizardBtn handleClick={handleNext} back={false} text={"Siguiente"} disabled={nextDisabled} />
      </div>
    </section>
  );
}
