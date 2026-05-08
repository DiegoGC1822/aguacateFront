import axios from "axios";

const api = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const filename = `image_${Date.now()}.jpg`;

export const postPrediction = async (imageUri: string) => {
  const formData = new FormData();
  formData.append("imagen", {
    uri: imageUri,
    name: filename,
    type: "image/jpeg",
  } as any);

  const response = await axios.post(`${api}/predecir`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
