"use client";

import { useState } from "react";
import { useTorneo } from "@/context/torneoContext";
import { CrearTorneoInput } from "@/types/wizard";
import { Torneo } from "@/types/torneo";
import { isTorneoDatosComplete } from "@/lib/torneoWizardValidation";
import WizardBtn from "../ui/WizardBtn";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function formatDateForInput(value: Date | string | undefined): string {
  if (value == null) return "";
  if (typeof value === "string") return value.slice(0, 10);
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function initialFormFromState(t: Torneo): CrearTorneoInput {
  const badDates =
    !t.fechaInicio ||
    !(t.fechaInicio instanceof Date) ||
    Number.isNaN(t.fechaInicio.getTime()) ||
    t.fechaInicio.getTime() === 0;
  const today = new Date();
  return {
    nombre: t.nombre,
    deporte: t.deporte as CrearTorneoInput["deporte"],
    fechaInicio: badDates ? today : t.fechaInicio,
    fechaFin: badDates ? today : t.fechaFin,
    cantidadCanchas: t.cantidadCanchas,
    categorias: [],
  };
}

const PasoDatosTorneo = () => {
  const { state, dispatch } = useTorneo();
  const [torneoData, setTorneoData] = useState(() => initialFormFromState(state.torneo));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "cantidadCanchas") {
      setTorneoData((prev) => ({ ...prev, cantidadCanchas: Number(value) || 0 }));
      return;
    }
    if (name === "fechaInicio" || name === "fechaFin") {
      setTorneoData((prev) => ({ ...prev, [name]: new Date(value + "T12:00:00") }));
      return;
    }
    setTorneoData((prev) => ({ ...prev, [name]: value }) as CrearTorneoInput);
  };

  const handleSubmit = () => {
    const payload = {
      nombre: torneoData.nombre,
      deporte: torneoData.deporte,
      fechaInicio: new Date(torneoData.fechaInicio),
      fechaFin: new Date(torneoData.fechaFin),
      cantidadCanchas: torneoData.cantidadCanchas,
      estado: "borrador" as const,
    };
    if (!isTorneoDatosComplete(payload)) {
      setError("Completá nombre, fechas válidas (fin no anterior al inicio) y al menos una cancha.");
      return;
    }
    setError(null);

    dispatch({
      type: "UPDATE_TORNEO",
      payload,
    });

    dispatch({ type: "SET_STEP", payload: state.step + 1 });
  };

  return (
    <section className="flex flex-col mx-8 sm:mx-auto gap-6 sm:w-94">
      <h2 className="text-4xl text-center font-bold mt-8">Datos del Torneo</h2>

      <Field className="flex flex-col">
        <FieldLabel htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Torneo</FieldLabel>
        <Input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Ejemplo: Torneo Patagonico"
          value={torneoData.nombre}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-md border-gray-300"
        />
      </Field>

      <Field className="flex flex-col">
        <FieldLabel htmlFor="deporte" className="block text-sm font-medium text-gray-700">Elige el deporte</FieldLabel>
        <RadioGroup defaultValue="pelota paleta" name="deporte" onValueChange={(value) => setTorneoData((prev) => ({ ...prev, deporte: value as CrearTorneoInput["deporte"] }))}>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="pelota paleta" id="pelota paleta" />
            <Label htmlFor="pelota paleta">Pelota Paleta</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="paddle" id="paddle" />
            <Label htmlFor="paddle">Paddle</Label>
          </div>
        </RadioGroup>
      </Field>

      <Field className="flex flex-col">
        {/* TODO fix tilde and max */}
        <FieldLabel htmlFor="cantidadCanchas">Numero de canchas disponibles</FieldLabel>
        <Input
          type="number"
          name="cantidadCanchas"
          min={1}
          max={8}
          id="cantidadCanchas"
          placeholder="Cantidad de canchas"
          value={torneoData.cantidadCanchas}
          onChange={handleChange}
          className="mt-1 py-2 px-4 border rounded-md border-gray-300 w-16"
        />
      </Field>

      {/* fechas */}
      <div className="flex justify-between">
        <Field className="flex flex-col">
          <FieldLabel htmlFor="fechaInicio">Fecha de inicio</FieldLabel>
          <Input
            type="date"
            name="fechaInicio"
            id="fechaInicio"
            value={formatDateForInput(torneoData.fechaInicio)}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md border-gray-300"
          />
        </Field>

        <Field className="flex flex-col">
          {/* TODO fix tilde */}
          <FieldLabel htmlFor="fechaFin">Fecha de finalizacion</FieldLabel>
          <Input
            type="date"
            name="fechaFin"
            id="fechaFin"
            value={formatDateForInput(torneoData.fechaFin)}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md border-gray-300"
          />
        </Field>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <WizardBtn handleClick={handleSubmit} back={false} text={"Siguiente"} />
    </section>
  );
};

export default PasoDatosTorneo;
