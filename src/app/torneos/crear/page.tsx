"use client";

import { useTorneo } from "@/context/torneoContext";
import PasoDatosTorneo from "./components/PasoDatosTorneo";
import PasoCategorias from "./components/PasoCategorias";
import PasoFixture from "./components/PasoFixture";
import PasoZonas from "./components/PasoZonas";
import PasoTorneoCreado from "./components/PasoTorneoCreado";

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
        return <PasoTorneoCreado />;
    }
  }

  return (
    <div className="relative min-h-screen py-2">
      {renderPaso()}
    </div>
  );
}
