import { create } from "zustand";
import {
  postPrediction,
  getPredictions,
  getPredictionById,
} from "../../data/services/predictionService";
import { PredictionResponse, History } from "../../types";
import { isAppError } from "../../domain/errors";

interface PredictionState {
  prediction: PredictionResponse | null;
  history: History | null;
  loading: boolean;
  error: string | null;
  analyzeImage: (ImageUri: string) => Promise<void>;
  getHistory: () => Promise<void>;
}

let pollingInterval: ReturnType<typeof setInterval> | null = null;
let pollingAttempts = 0;
const MAX_ATTEMPTS = 10;
const POLL_INTERVAL_MS = 3000;

const isFinalStatus = (status: string) =>
  status !== "pending" && status !== "processing";

export const usePrediction = create<PredictionState>((set) => ({
  prediction: null,
  history: null,
  loading: false,
  error: null,

  analyzeImage: async (ImageUri: string) => {
    stopPolling();
    set({ loading: true, error: null, prediction: null });
    try {
      const data = await postPrediction(ImageUri);
      set({ prediction: data });

      if (isFinalStatus(data.status)) {
        set({ loading: false });
      } else {
        startPolling(data.id, set);
      }
    } catch (error: any) {
      if (isAppError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: error.response?.data?.detail || error.message || "Error al analizar la imagen", loading: false });
      }
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

function startPolling(
  id: number,
  set: (partial: Partial<PredictionState>) => void
) {
  pollingAttempts = 0;

  pollingInterval = setInterval(async () => {
    pollingAttempts += 1;

    try {
      const data = await getPredictionById(id);
      set({ prediction: data });

      if (isFinalStatus(data.status)) {
        stopPolling();
        set({ loading: false });
      } else if (pollingAttempts >= MAX_ATTEMPTS) {
        stopPolling();
        set({
          loading: false,
          error: "El análisis está tardando demasiado. Intentá de nuevo.",
        });
      }
    } catch (error) {
      stopPolling();
      set({ error: "Error al consultar el análisis", loading: false });
    }
  }, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  pollingAttempts = 0;
}