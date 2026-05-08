import { create } from "zustand";
import * as ImagePicker from "expo-image-picker";

interface ImageState {
  image: string | null;
  pickImage: () => Promise<void>;
}

export const useImageUpload = create<ImageState>((set) => ({
  image: null,
  pickImage: async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (!result.canceled) {
      set({ image: result.assets[0].uri });
    }
  },
}));
