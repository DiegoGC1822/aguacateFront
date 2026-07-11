import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { PaperProvider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import AddImageScreen from "../../app/(protected)/addImage";
import { useImageUpload } from "../../presentation/viewmodel/useImageUpload";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";

// El toast (Snackbar animado) no es parte de lo que probamos aquí; mockearlo
// evita animaciones con timers reales que hacen el test flaky bajo carga.
jest.mock("../../presentation/components/AppToast", () => ({
  __esModule: true,
  default: () => null,
}));

const renderScreen = () =>
  render(
    <PaperProvider>
      <AddImageScreen />
    </PaperProvider>,
  );

describe("Integración AddImage (selección de imagen → análisis → navegación)", () => {
  beforeEach(() => {
    useImageUpload.setState({ image: null });
    jest.clearAllMocks();
  });

  test("cargar imagen revela 'Analizar' y navega a /result disparando analyzeImage", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///fake.jpg" }],
    });

    // Sustituimos la acción real para no lanzar red/polling en un test de pantalla.
    const analyzeImage = jest.fn();
    usePrediction.setState({ analyzeImage });

    renderScreen();

    // Sin imagen no se muestra el botón Analizar.
    expect(screen.queryByTestId("btn-analizar")).toBeNull();

    fireEvent.press(screen.getByTestId("btn-cargar-imagen"));

    // La selección de imagen actualiza el store (viewmodel useImageUpload).
    await waitFor(() =>
      expect(useImageUpload.getState().image).toBe("file:///fake.jpg"),
    );

    // Tras cargar la imagen aparece el botón Analizar.
    const analizar = await screen.findByTestId("btn-analizar");
    fireEvent.press(analizar);

    expect(analyzeImage).toHaveBeenCalledWith("file:///fake.jpg");
    expect(router.push).toHaveBeenCalledWith("/result");
  });
});
