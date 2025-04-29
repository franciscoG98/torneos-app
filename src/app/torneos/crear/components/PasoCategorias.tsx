"use client";

import React, { useState } from "react";
import { useTorneo } from "@/context/torneoContext";
import { Categoria } from "@/types/torneo";
import WizardBtn from "../ui/WizardBtn";

const PasoCategorias = () => {
  const { state, dispatch } = useTorneo();
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const opcionesPuntaje = state.torneo.deporte === "paddle"
    ? ["3 sets", "5 sets"] as const
    : ["sets 12", "sets 15", "puntos 20", "puntos 25", "puntos 30"] as const;

  const [tipoPuntaje, setTipoPuntaje] = useState<typeof opcionesPuntaje[number]>(opcionesPuntaje[0]);

  const handleAddCategoria = () => {
    if (!categoriaNombre) return;

    const newCategoria: Categoria = {
      id: Date.now().toString(),
      nombre: categoriaNombre,
      tipoPuntaje,
    };

    dispatch({
      type: "SET_CATEGORIAS",
      payload: [...state.categorias, newCategoria],
    });

    // Resetear el form
    setCategoriaNombre("");
    setTipoPuntaje(opcionesPuntaje[0]);
  };


  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: state.step - 1 });
  };

  const handleNext = () => {
    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  };

  return (
    <section className="flex flex-col mx-auto gap-6 w-94">
      <h2 className="text-4xl text-center font-bold mt-8">Crear Categorías</h2>

      <fieldset>
        <label htmlFor="categoriaNombre" className="block text-sm font-medium text-gray-700">
          Nombre de la Categoría
        </label>
        <input
          type="text"
          name="categoriaNombre"
          id="categoriaNombre"
          value={categoriaNombre}
          onChange={(e) => setCategoriaNombre(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </fieldset>

      <fieldset>
        <label htmlFor="tipoPuntaje" className="block text-sm font-medium text-gray-700">
          Tipo de Puntaje
        </label>
        <select
          name="tipoPuntaje"
          id="tipoPuntaje"
          value={tipoPuntaje}
          onChange={(e) => setTipoPuntaje(e.target.value as typeof opcionesPuntaje[number])}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        >
          {opcionesPuntaje.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </fieldset>


      {/* <NextBtn handleClick={handleAddCategoria} /> */}
      <div className="mt-4">
        <button
          onClick={handleAddCategoria}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Agregar Categoría
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Categorías Creadas</h3>
        <ul className="space-y-2">
          {state.categorias.map((categoria) => (
            <li key={categoria.id} className="p-2 bg-gray-100 rounded-md">
              {categoria.nombre} - {categoria.tipoPuntaje}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between">
        <WizardBtn handleClick={handleBack} back={true} text={"Anterior"} />
        <WizardBtn handleClick={handleNext} back={false} text={"Siguiente"} />
      </div>
    </section>
  );
};

export default PasoCategorias;
