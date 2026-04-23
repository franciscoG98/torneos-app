import { Torneo, TorneoState } from "@/types/torneo";

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function fechaValida(d: unknown): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime()) && d.getTime() !== 0;
}

/** Valida datos del torneo (paso 0), útil con estado global o borrador antes de guardar. */
export function isTorneoDatosComplete(torneo: Pick<Torneo, "nombre" | "cantidadCanchas" | "fechaInicio" | "fechaFin">): boolean {
  const { nombre, cantidadCanchas, fechaInicio, fechaFin } = torneo;
  if (!nombre.trim() || cantidadCanchas < 1) return false;
  if (!fechaValida(fechaInicio) || !fechaValida(fechaFin)) return false;
  return startOfDay(fechaFin) >= startOfDay(fechaInicio);
}

/** Paso índice alineado con `page.tsx` / reducer: 0 datos, 1 categorías, 2 zonas, 3 fixture, ≥4 resumen. */
export function isWizardStepComplete(step: number, state: TorneoState): boolean {
  switch (step) {
    case 0:
      return isTorneoDatosComplete(state.torneo);
    case 1:
      return state.categorias.length > 0;
    case 2:
      if (state.categorias.length === 0) return false;
      if (state.zonas.length !== state.categorias.length) return false;
      return state.zonas.every((entry) => Array.isArray(entry.zonas) && entry.zonas.length > 0);
    case 3:
      return state.partidos.length > 0;
    default:
      return false;
  }
}

/**
 * Mismo paso o hacia atrás: siempre permitido (los datos siguen en el estado).
 * Hacia adelante o saltar: todos los pasos anteriores al destino deben estar completos.
 */
export function canNavigateToWizardStep(
  currentStep: number,
  targetStep: number,
  state: TorneoState,
): boolean {
  if (targetStep < 0) return false;
  if (targetStep <= currentStep) return true;
  for (let i = 0; i < targetStep; i++) {
    if (!isWizardStepComplete(i, state)) return false;
  }
  return true;
}
