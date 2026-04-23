'use client';

import Link from 'next/link';
import { useTorneo } from '@/context/torneoContext';
import { Pareja } from '@/types/torneo';
import WizardBtn from '../ui/WizardBtn';
import TablaPartidos from './TablaPartidos';
import { Button } from '@/components/ui/button';

function formatFecha(d: Date) {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function PasoTorneoCreado() {
  const { state, dispatch } = useTorneo();
  const { torneo, zonas } = state;

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: state.step - 1 });
  };

  const handleDescargarA4 = () => {
    window.print();
  };

  return (
    <section className="torneo-a4-resumen flex flex-col mx-auto gap-8 md:mx-32 pb-16">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mt-6">¡Torneo creado!</h1>
        <p className="mt-3 text-lg font-semibold">{torneo.nombre || 'Torneo'}</p>
        <p className="text-muted-foreground text-sm mt-1">
          {formatFecha(torneo.fechaInicio)} — {formatFecha(torneo.fechaFin)}
          {torneo.cantidadCanchas > 0 && (
            <span className="block sm:inline sm:before:content-['_·_']">
              {torneo.cantidadCanchas} canchas
            </span>
          )}
        </p>
      </header>

      <div className="no-print flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
        <Button type="button" size="lg" onClick={handleDescargarA4}>
          Descargar / imprimir (A4)
        </Button>
        <p className="text-center text-sm text-muted-foreground max-w-md">
          Se abre la impresión del navegador: elegí «Guardar como PDF» y tamaño A4.
        </p>
      </div>

      <div className="torneo-a4-body flex flex-col gap-10">
        <div className="torneo-a4-section">
          <h2 className="text-2xl font-bold text-center border-b pb-2">Zonas</h2>
          {zonas.map((bloque, idx) => (
            <div key={idx} className="mt-6 w-full">
              <h3 className="text-center font-semibold text-xl mb-3">
                {bloque.zonas[0]?.categoriaId ?? 'Categoría'}
              </h3>
              <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-around gap-6">
                {bloque.zonas.map((zona) => (
                  <div className="torneo-a4-zona flex flex-col gap-2 w-full max-w-xl mx-auto" key={zona.id}>
                    <h4 className="font-semibold text-lg">{zona.nombre}</h4>
                    <table className="border w-full text-sm">
                      <thead>
                        <tr>
                          <td className="border p-1 font-bold w-10" />
                          {zona.parejas.map((pareja: Pareja) => (
                            <th className="border p-1 font-normal" key={pareja.id} scope="col">
                              <span className="whitespace-nowrap">{pareja.jugador1}</span>
                              <br />
                              <span className="whitespace-nowrap">{pareja.jugador2}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {zona.parejas.map((pareja: Pareja, rowIdx: number) => (
                          <tr key={pareja.id}>
                            <th className="border p-1 font-normal text-left" scope="row">
                              <span className="whitespace-nowrap">{pareja.jugador1}</span>
                              <br />
                              <span className="whitespace-nowrap">{pareja.jugador2}</span>
                            </th>
                            {zona.parejas.map((rivalPareja: Pareja, colIdx: number) => (
                              <td
                                key={`${pareja.id}-${rivalPareja.id}`}
                                className={`border p-1 text-center min-w-[2rem] ${
                                  rowIdx === colIdx ? 'bg-muted' : ''
                                }`}
                              />
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
        </div>

        <div className="torneo-a4-section print-page-break-before">
          <h2 className="text-2xl font-bold text-center border-b pb-2">Fixture</h2>
          <div className="mt-4">
            <TablaPartidos soloLectura />
          </div>
        </div>
      </div>

      <div className="no-print flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
        <WizardBtn handleClick={handleBack} back text="Anterior" />
        <Link
          className="text-primary underline underline-offset-4 hover:no-underline font-medium"
          href="/torneos"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
