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
