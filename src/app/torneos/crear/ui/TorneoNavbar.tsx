"use client"

import React from "react"
import { useTorneo } from "@/context/torneoContext";
import { Button } from "@/components/ui/button"

import { canNavigateToWizardStep } from "@/lib/torneoWizardValidation";

const steps = [
  { step: 0, name: "Datos" },
  { step: 1, name: "Categorías" },
  { step: 2, name: "Zonas" },
  { step: 3, name: "Fixture" },
  { step: 4, name: "Listo" },
];

const TorneoNavbar = () => {
  const { state, dispatch } = useTorneo();

  const onChangeStep = (targetStep: number) => {
    if (!canNavigateToWizardStep(state.step, targetStep, state)) return;
    dispatch({ type: "SET_STEP", payload: targetStep });
  };

  return (
    <nav className="flex justify-between mx-auto w-xl">
      {steps.map((step) => {
        const allowed = canNavigateToWizardStep(state.step, step.step, state);
        return (
          <Button
            key={step.step}
            variant="outline"
            onClick={() => onChangeStep(step.step)}
            className={`
            text-md border-none 
            ${state.step === step.step
              ? "text-blue-600 font-semibold"
              : allowed
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400"
            }`}
            disabled={!allowed}
          >
            {step.name}
          </Button>
        );
      })}
    </nav>
  );
};

export default TorneoNavbar
