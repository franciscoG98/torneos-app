"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { torneoReducer, initialState } from "@/reducers/torneoReducer";
import { TorneoState, TorneoAction } from "@/types/torneo";

interface TorneoProviderProps {
  children: ReactNode;
}

const TorneoContext = createContext<{
  state: TorneoState;
  dispatch: React.Dispatch<TorneoAction>;
} | undefined>(undefined);

export const TorneoProvider = ({ children }: TorneoProviderProps) => {
  const [state, dispatch] = useReducer(torneoReducer, initialState);

  return (
    <TorneoContext.Provider value={{ state, dispatch }}>
      {children}
    </TorneoContext.Provider>
  );
};

export const useTorneo = () => {
  const context = useContext(TorneoContext);
  if (!context) {
    throw new Error("useTorneo must be used within a TorneoProvider");
  }
  return context;
};
