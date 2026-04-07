import { TorneoState, TorneoAction } from "@/types/torneo";

export const initialState: TorneoState = {
  torneo: {
    nombre: "",
    deporte: "paddle",
    fechaInicio: new Date(0),
    fechaFin: new Date(0),
    cantidadCanchas: 1,
    estado: "borrador",
  },
  categorias: [],
  parejas: [],
  zonas: [],
  partidos: [],
  ranking: [],
  step: 0,
};

export const torneoReducer = (state: TorneoState, action: TorneoAction): TorneoState => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };

    case "UPDATE_TORNEO":
      return { ...state, torneo: { ...state.torneo, ...action.payload } };

    case "SET_CATEGORIAS":
      return { ...state, categorias: action.payload };

    case "SET_PAREJAS":
      return { ...state, parejas: action.payload };

    case "SET_ZONAS":
      return { ...state, zonas: action.payload };

    case "SET_PARTIDOS":
      return { ...state, partidos: action.payload };

    case "SET_RANKING":
      return { ...state, ranking: action.payload };

    default:
      return state;
  }
};
