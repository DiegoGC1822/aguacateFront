import { create } from "zustand";
import {
  postPrediction,
  getPredictions,
} from "../../data/services/predictionService";
import { PredictionResponse, History } from "../../types";

interface PredictionState {
  prediction: PredictionResponse | null;
  history: History | null;
  loading: boolean;
  error: string | null;
  analyzeImage: (ImageUri: string) => Promise<void>;
  getHistory: () => Promise<void>;
}

export const usePrediction = create<PredictionState>((set) => ({
  prediction: null,
  history: null,
  loading: false,
  error: null,
  analyzeImage: async (ImageUri: string) => {
    set({ loading: true });
    try {
      const data = await postPrediction(ImageUri);
      set({ prediction: data, loading: false, error: null });
    } catch (error) {
      set({ error: "Error al analizar la imagen", loading: false });
    }
  },
  getHistory: async () => {
    set({ loading: true });
    try {
      const data = await getPredictions();
      set({ history: data, loading: false, error: null });
    } catch (error) {
      set({
        error: "Error al obtener el historial de predicciones",
        loading: false,
      });
    }
  },
}));
