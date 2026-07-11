import { create } from "zustand";
import * as ImagePicker from "expo-image-picker";
import { validateImageFormatUseCase } from "../../domain/useCases/imageUseCase";

interface ImageState {
  image: string | null;
  resetImage: () => void;
  pickImage: () => Promise<void>;
  takePhoto: () => Promise<void>;
}

export const useImageUpload = create<ImageState>((set) => ({
  image: null,
  resetImage: () => set({ image: null }),

  pickImage: async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      validateImageFormatUseCase(uri);
      set({ image: uri });
    }
  },

  takePhoto: async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permisos de cámara denegados");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 1,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      validateImageFormatUseCase(uri);
      set({ image: uri });
    }
  },
}));

