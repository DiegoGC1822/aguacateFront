import { createLot, deleteLot, uploadBulk } from "../../data/services/predictionService";
import { AppError } from "../errors";
import { PredictionResponse } from "../../types";

export const executeBatchProcessing = async (
  lotName: string,
  description: string,
  imageUris: string[]
): Promise<PredictionResponse[]> => {
  let lotId: number | null = null;

  try {
    // 1. Crear el lote
    lotId = await createLot(lotName, description);
  } catch (error: any) {
    throw new AppError("SERVER", error?.response?.data?.detail || "Error al crear el lote en el servidor");
  }

  try {
    // 2. Cargar las imágenes
    const classifications = await uploadBulk(lotId, imageUris);
    return classifications;
  } catch (error: any) {
    // 3. Rollback en caso de error en la carga masiva
    try {
      if (lotId) {
        await deleteLot(lotId);
      }
    } catch (deleteError) {
      console.error("Error durante el rollback de deleteLot:", deleteError);
    }
    throw new AppError("NETWORK", "Error al procesar el lote. Intenta de nuevo. (Rollback realizado)");
  }
};
