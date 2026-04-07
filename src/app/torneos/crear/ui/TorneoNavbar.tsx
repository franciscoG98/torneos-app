"use client"

import React from "react"
import { useTorneo } from "@/context/torneoContext";
import { Button } from "@/components/ui/button"

const steps = [
  {
    step: 1,
    name: "PasoDatosTorneo",
  },
  {
    step: 2,
    name: "PasoCategorias",
  },
  {
    step: 3,
    name: "PasoZonas",
  },
  {
    step: 4,
    name: "PasoFixture",
  },
]

const TorneoNavbar = () => {
  const { state, dispatch } = useTorneo();

  console.log('state', state);

  const onChangeStep = (step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  }

  return (
    <nav className="flex justify-between">
      <div className="flex gap-4">
        {steps.map((step) => (
          <Button
            key={step.step}
            onClick={() => onChangeStep(step.step)}
            className={`text-lg ${state.step < step.step ? "text-gray-500" : "text-blue-500"}`}
          >
            {step.name}
          </Button>
        ))}
      </div>
    </nav>
  )
}

export default TorneoNavbar
