"use client";

import { useTorneo } from "@/context/torneoContext";
import PasoDatosTorneo from "./components/PasoDatosTorneo";
import PasoCategorias from "./components/PasoCategorias";
import PasoFixture from "./components/PasoFixture";
import PasoZonas from "./components/PasoZonas";
import Link from "next/link";

export default function CrearTorneoPage() {
  const { state } = useTorneo();

  function renderPaso() {
    switch (state.step) {
      case 0:
        return <PasoDatosTorneo />;
      case 1:
        return <PasoCategorias />;
      case 2:
        return <PasoZonas />;
      case 3:
        return <PasoFixture />;
      default:
        return (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl my-8">¡Torneo creado!</h1>
            <Link
              className="underline text-lg text-blue-500 hover:no-underline"
              href='/torneos'
            >
              Inicio
            </Link>
          </div>
        );
    }
  }

  return (
    <div className="relative min-h-screen py-2">
      {renderPaso()}
    </div>
  );
}
