import { useImageUpload } from "../../../presentation/viewmodel/useImageUpload";
import * as ImagePicker from "expo-image-picker";

describe("useImageUpload (Store Zustand / ViewModel de Carga de Imágenes)", () => {
  beforeEach(() => {
    useImageUpload.setState({
      image: null,
    });
    jest.clearAllMocks();
  });

  test("debe asignar la imagen si la selección no es cancelada", async () => {
    const mockResult = {
      canceled: false,
      assets: [{ uri: "file://selected-image.jpg" }],
    };
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

    await useImageUpload.getState().pickImage();

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: "images",
      quality: 1,
    });
    expect(useImageUpload.getState().image).toBe("file://selected-image.jpg");
  });

  test("resetImage debe limpiar el URI de la imagen", () => {
    useImageUpload.setState({ image: "file://some-image.jpg" });
    useImageUpload.getState().resetImage();
    expect(useImageUpload.getState().image).toBeNull();
  });
});
