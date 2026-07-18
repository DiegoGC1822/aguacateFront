import api from "../api/api";

const filename = `image_${Date.now()}.jpg`;

export const postPrediction = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: "image/jpeg",
    } as any);

    const response = await api.post("/classifications/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al analizar la imagen:", error);
    throw error;
  }
};

export const getPredictions = async () => {
  try {
    const response = await api.get("/classifications/history/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener el historial de predicciones:", error);
    throw error;
  }
};

export const getPredictionById = async (id: number) => {
  try {
    const response = await api.get(`/classifications/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error al consultar la clasificación:", error);
    throw error;
  }
};

export const createLot = async (lotName: string, description?: string) => {
  try {
    const response = await api.post("/classifications/lots/", {
      lot_name: lotName,
      description: description || "",
    });
    return response.data.id;
  } catch (error) {
    console.error("Error al crear el lote:", error);
    throw error;
  }
};

export const deleteLot = async (lotId: number) => {
  try {
    await api.delete(`/classifications/lots/${lotId}/`);
  } catch (error) {
    console.error("Error al eliminar el lote:", error);
    throw error;
  }
};

export const uploadBulk = async (lotId: number, imageUris: string[]) => {
  try {
    const formData = new FormData();
    formData.append("lot", String(lotId));

    imageUris.forEach((uri, index) => {
      formData.append("images", {
        uri: uri,
        name: `image_${lotId}_${Date.now()}_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    const response = await api.post("/classifications/bulk/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.classifications; // Assuming this array complies with PredictionResponse
  } catch (error) {
    console.error("Error en uploadBulk:", error);
    throw error;
  }
};

export const updateClassificationMetadata = async (
  id: number,
  treeCode: string,
  north: number,
  east: number
) => {
  try {
    const response = await api.patch(`/classifications/${id}/`, {
      tree_code: treeCode,
      north_coordinate: north,
      east_coordinate: east,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar metadatos:", error.response?.data);
    throw error;
  }
};
