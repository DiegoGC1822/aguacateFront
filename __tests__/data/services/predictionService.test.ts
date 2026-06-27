import {
  postPrediction,
  getPredictions,
} from "../../../data/services/predictionService";
import api from "../../../data/api/api";

// Mock del módulo api
jest.mock("../../../data/api/api", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe("predictionService - Servicio de Predicciones", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("postPrediction debe subir una imagen y retornar la predicción", async () => {
    const mockPrediction = {
      id: 1,
      confidence: 95.5,
      predicted_category_display: "Saludable",
      raw_scores: { saludable: 95.5, antracnosis: 2.0, sarna: 2.5 },
      error_message: null,
    };
    (api.post as jest.Mock).mockResolvedValue({ data: mockPrediction });

    const result = await postPrediction("file://path/to/image.jpg");

    expect(api.post).toHaveBeenCalledWith(
      "/classifications/",
      expect.any(FormData),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    expect(result).toEqual(mockPrediction);
  });

  test("getPredictions debe retornar el historial", async () => {
    const mockHistory = [
      {
        id: 1,
        confidence: 95.5,
        predicted_category_display: "Saludable",
        raw_scores: { saludable: 95.5, antracnosis: 2.0, sarna: 2.5 },
        error_message: null,
        image: "http://res.cloudinary.com/test.jpg",
        classified_at: "2026-06-27T00:00:00Z",
        status: "success",
      },
    ];
    (api.get as jest.Mock).mockResolvedValue({ data: mockHistory });

    const result = await getPredictions();

    expect(api.get).toHaveBeenCalledWith("/classifications/history/");
    expect(result).toEqual(mockHistory);
  });
});
