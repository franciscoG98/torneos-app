"use client";

import { useState, useEffect } from "react";
import { useTorneo } from "@/context/torneoContext";
import { CrearTorneoInput } from "@/types/wizard";
import WizardBtn from "../ui/WizardBtn";

function formatDateForInput(value: Date | string | undefined): string {
  if (value == null) return "";
  if (typeof value === "string") return value.slice(0, 10);
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const PasoDatosTorneo = () => {
  const { state, dispatch } = useTorneo();
  const [datesReady, setDatesReady] = useState(false);
  const [torneoData, setTorneoData] = useState<CrearTorneoInput>({
    nombre: state.torneo.nombre,
    deporte: state.torneo.deporte,
    fechaInicio: state.torneo.fechaInicio,
    fechaFin: state.torneo.fechaFin,
    cantidadCanchas: state.torneo.cantidadCanchas,
    categorias: [],
  });

  useEffect(() => {
    const today = new Date();
    setTorneoData((prev) => ({
      ...prev,
      fechaInicio: today,
      fechaFin: today,
    }));
    setDatesReady(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTorneoData({ ...torneoData, [name]: value });
  };

  const handleSubmit = () => {
    dispatch({
      type: "UPDATE_TORNEO",
      payload: {
        nombre: torneoData.nombre,
        deporte: torneoData.deporte,
        fechaInicio: new Date(torneoData.fechaInicio),
        fechaFin: new Date(torneoData.fechaFin),
        cantidadCanchas: torneoData.cantidadCanchas,
        estado: "borrador",
      },
    });

    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  };

  return (
    <section className="flex flex-col mx-8 sm:mx-auto gap-6 sm:w-94">
      <h2 className="text-4xl text-center font-bold mt-8">Datos del Torneo</h2>

      <fieldset className="flex flex-col">
        <label  htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Torneo</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Ejemplo: Torneo Patagonico"
          value={torneoData.nombre}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-md border-gray-300"
        />
      </fieldset>

      <fieldset className="flex flex-col">
        <label  htmlFor="deporte" className="block text-sm font-medium text-gray-700">Elige el deporte</label>
        <select
          name="deporte"
          id="deporte"
          value={torneoData.deporte}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-md border-gray-300"
        >
          <option value="paddle">Paddle</option>
          <option value="pelota paleta">Pelota Paleta</option>
        </select>
      </fieldset>

      <fieldset className="flex flex-col">
        {/* TODO fix tilde and max */}
        <label  htmlFor="cantidadCanchas">Numero de canchas disponibles</label>
        <input
          type="number"
          name="cantidadCanchas"
          min={1}
          id="cantidadCanchas"
          placeholder="Cantidad de canchas"
          value={torneoData.cantidadCanchas}
          onChange={handleChange}
          className="mt-1 py-2 px-4 border rounded-md border-gray-300 w-16"
        />
      </fieldset>

      {/* fechas */}
      <div className="flex justify-between">
        <fieldset className="flex flex-col">
          <label  htmlFor="fechaInicio">Fecha de inicio</label>
          <input
            type="date"
            name="fechaInicio"
            id="fechaInicio"
            value={datesReady ? formatDateForInput(torneoData.fechaInicio) : ""}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md border-gray-300"
          />
        </fieldset>

        <fieldset className="flex flex-col">
          {/* TODO fix tilde */}
          <label  htmlFor="fechaFin">Fecha de finalizacion</label>
          <input
            type="date"
            name="fechaFin"
            id="fechaFin"
            value={datesReady ? formatDateForInput(torneoData.fechaFin) : ""}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md border-gray-300"
          />
        </fieldset>
      </div>

      <WizardBtn handleClick={handleSubmit} back={false} text={"Siguiente"} />
    </section>
  );
};

export default PasoDatosTorneo;
