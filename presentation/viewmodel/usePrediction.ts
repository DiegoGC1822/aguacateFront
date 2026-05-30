import { create } from "zustand";
import { postPrediction } from "../../data/services/predictionService";
import { Prediction } from "../../types";

interface PredictionState {
  prediction: Prediction | null;
  loading: boolean;
  error: string | null;
  analyzeImage: (ImageUri: string) => Promise<void>;
}

export const usePrediction = create<PredictionState>((set) => ({
  prediction: null,
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
}));
