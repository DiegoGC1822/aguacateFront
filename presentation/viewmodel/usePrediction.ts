import { create } from "zustand";
import {
  postPrediction,
  getPredictions,
  getPredictionById,
  updateClassificationMetadata,
} from "../../data/services/predictionService";
import { PredictionResponse, History, BatchImage } from "../../types";
import { isAppError, AppError } from "../../domain/errors";
import { executeBatchProcessing } from "../../domain/useCases/batchUseCase";

// ---------------------------------------------------------------------------
// Tipos internos del Store
// ---------------------------------------------------------------------------

interface PredictionState {
  // --- Estado de predicción individual ---
  prediction: PredictionResponse | null;
  history: History | null;
  loading: boolean;
  error: string | null;
  analyzeImage: (ImageUri: string) => Promise<void>;
  getHistory: () => Promise<void>;

  // --- Estado del lote ---
  batchName: string;
  batchDescription: string;
  batchImages: BatchImage[];
  isAnalyzingBatch: boolean;

  // --- Acciones del lote ---
  setBatchConfig: (name: string, description: string) => void;
  addBatchImage: (uri: string) => void;
  removeBatchImage: (id: string) => void;
  updateImageMetadata: (
    id: string,
    metadata: { treeId?: string; coorNorte?: string; coorEste?: string }
  ) => void;
  clearBatch: () => void;
  executeBatchAnalysis: () => Promise<void>;
  updateClassificationOnServer: (
    imageId: string,
    treeId: string,
    coorNorte: string,
    coorEste: string
  ) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Polling helpers (predicción individual)
// ---------------------------------------------------------------------------

let pollingInterval: ReturnType<typeof setInterval> | null = null;
let pollingAttempts = 0;
const MAX_ATTEMPTS = 10;
const POLL_INTERVAL_MS = 3000;

const isFinalStatus = (status: string) =>
  status !== "pending" && status !== "processing";

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const usePrediction = create<PredictionState>((set, get) => ({
  // ===================== Estado individual =====================
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
        set({
          error:
            error.response?.data?.detail ||
            error.message ||
            "Error al analizar la imagen",
          loading: false,
        });
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

  // ===================== Estado del lote =====================
  batchName: "",
  batchDescription: "",
  batchImages: [],
  isAnalyzingBatch: false,

  // ===================== Acciones del lote =====================

  setBatchConfig: (name: string, description: string) => {
    set({ batchName: name, batchDescription: description });
  },

  addBatchImage: (uri: string) => {
    const newImage: BatchImage = {
      id: Date.now().toString(),
      uri,
      treeId: "",
      coorNorte: "",
      coorEste: "",
    };
    set((state) => ({ batchImages: [...state.batchImages, newImage] }));
  },

  removeBatchImage: (id: string) => {
    set((state) => ({
      batchImages: state.batchImages.filter((img) => img.id !== id),
    }));
  },

  updateImageMetadata: (
    id: string,
    metadata: { treeId?: string; coorNorte?: string; coorEste?: string }
  ) => {
    set((state) => ({
      batchImages: state.batchImages.map((img) =>
        img.id === id ? { ...img, ...metadata } : img
      ),
    }));
  },

  clearBatch: () => {
    set({
      batchName: "",
      batchDescription: "",
      batchImages: [],
      isAnalyzingBatch: false,
    });
  },

  executeBatchAnalysis: async () => {
    set({ isAnalyzingBatch: true, error: null });

    try {
      const { batchName, batchDescription, batchImages } = get();
      const imageUris = batchImages.map((img) => img.uri);
      
      const classifications = await executeBatchProcessing(batchName, batchDescription, imageUris);

      // Mapear los resultados preservando la URI local.
      // Se asume que classifications vuelve en el mismo orden o podemos inyectarlo posicionalmente
      const analyzedImages = batchImages.map((img, index) => ({
        ...img,
        prediction: classifications[index],
      }));

      set({ batchImages: analyzedImages, isAnalyzingBatch: false });
    } catch (error: any) {
      if (isAppError(error)) {
        set({ error: error.message, isAnalyzingBatch: false });
      } else {
        set({ error: "Error inesperado al analizar el lote", isAnalyzingBatch: false });
      }
      throw error;
    }
  },

  updateClassificationOnServer: async (
    imageId: string,
    treeId: string,
    coorNorte: string,
    coorEste: string
  ) => {
    const state = get();
    const image = state.batchImages.find((img) => img.id === imageId);

    if (!image || !image.prediction) return;

    try {
      const parsedNorte = parseFloat(coorNorte) || 0;
      const parsedEste = parseFloat(coorEste) || 0;

      await updateClassificationMetadata(image.prediction.id, treeId, parsedNorte, parsedEste);

      // Actualización optimista o posterior en el store
      set((prev) => ({
        batchImages: prev.batchImages.map((img) =>
          img.id === imageId ? { ...img, treeId, coorNorte, coorEste } : img
        ),
      }));
    } catch (error) {
      console.error("Error al actualizar la metadata:", error);
      throw error; // Se relanza para la UI
    }
  },
}));

// ---------------------------------------------------------------------------
// Funciones de polling (fuera del store para evitar dependencias circulares)
// ---------------------------------------------------------------------------

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