import { usePrediction } from "../../../presentation/viewmodel/usePrediction";
import { postPrediction } from "../../../data/services/predictionService";

// Mock de predictionService
jest.mock("../../../data/services/predictionService", () => ({
  postPrediction: jest.fn(),
}));

describe("usePrediction (Store Zustand / ViewModel de Predicciones)", () => {
  beforeEach(() => {
    usePrediction.setState({
      prediction: null,
      history: null,
      loading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  test("debe asignar prediction correctamente tras llamada exitosa", async () => {
    const mockResult = { id: 1, confidence: 98, predicted_category_display: "Saludable" };
    (postPrediction as jest.Mock).mockResolvedValue(mockResult);

    const promise = usePrediction.getState().analyzeImage("file://image.jpg");

    // Verificar que active el estado de carga
    expect(usePrediction.getState().loading).toBe(true);

    await promise;

    expect(postPrediction).toHaveBeenCalledWith("file://image.jpg");
    const state = usePrediction.getState();
    expect(state.loading).toBe(false);
    expect(state.prediction).toEqual(mockResult);
    expect(state.error).toBeNull();
  });
});
