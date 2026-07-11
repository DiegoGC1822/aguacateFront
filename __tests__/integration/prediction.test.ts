import { mock } from "../helpers/mockApi";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";

const resetPrediction = () =>
  usePrediction.setState({
    prediction: null,
    history: null,
    loading: false,
    error: null,
  });

const completed = {
  id: 31,
  status: "completed",
  predicted_category_display: "Saludable",
  confidence: 0.9423,
  raw_scores: { saludable: 0.94, antracnosis: 0.05, sarna: 0.01 },
  error_message: null,
};

describe("Integración Clasificación con polling (usePrediction.analyzeImage) — regresión Bug 2", () => {
  beforeEach(() => {
    resetPrediction();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    mock.reset();
  });

  test("Flujo async feliz: 202 + polling processing → completed", async () => {
    mock.onPost("/classifications/").reply(202, { id: 31, status: "pending" });
    mock.onGet("/classifications/31/").replyOnce(200, { id: 31, status: "processing" });
    mock.onGet("/classifications/31/").reply(200, completed);

    await usePrediction.getState().analyzeImage("file:///fake.jpg");

    // Estado intermedio tras el POST 202: pending.
    expect(usePrediction.getState().prediction?.status).toBe("pending");
    expect(usePrediction.getState().loading).toBe(true);

    // 1er poll → processing
    await jest.advanceTimersByTimeAsync(3000);
    expect(usePrediction.getState().prediction?.status).toBe("processing");

    // 2º poll → completed
    await jest.advanceTimersByTimeAsync(3000);

    const state = usePrediction.getState();
    expect(state.prediction?.status).toBe("completed");
    expect(state.prediction?.raw_scores?.saludable).toBeDefined();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test("Clasificación fallida: status failed con error_message y sin crash", async () => {
    mock.onPost("/classifications/").reply(202, { id: 31, status: "pending" });
    mock.onGet("/classifications/31/").reply(200, {
      id: 31,
      status: "failed",
      error_message: "No se pudo procesar la imagen",
    });

    await usePrediction.getState().analyzeImage("file:///fake.jpg");
    await jest.advanceTimersByTimeAsync(3000);

    const state = usePrediction.getState();
    expect(state.prediction?.status).toBe("failed");
    expect(state.prediction?.error_message).toBe("No se pudo procesar la imagen");
    expect(state.loading).toBe(false);
  });

  test("Timeout de polling: siempre processing → setea error y loading false", async () => {
    mock.onPost("/classifications/").reply(202, { id: 31, status: "pending" });
    mock.onGet("/classifications/31/").reply(200, { id: 31, status: "processing" });

    await usePrediction.getState().analyzeImage("file:///fake.jpg");

    // MAX_ATTEMPTS = 10, POLL_INTERVAL_MS = 3000 → avanzamos por encima del límite.
    for (let i = 0; i < 11; i++) {
      await jest.advanceTimersByTimeAsync(3000);
    }

    const state = usePrediction.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
    // No debe quedar colgado en processing indefinidamente.
    expect(state.prediction?.status).toBe("processing");
  });

  test("Historial: getHistory llena history con la longitud correcta", async () => {
    const history = [
      { ...completed, id: 1 },
      { ...completed, id: 2, predicted_category_display: "Sarna" },
      { ...completed, id: 3, predicted_category_display: "Antracnosis" },
    ];
    mock.onGet("/classifications/history/").reply(200, history);

    await usePrediction.getState().getHistory();

    const state = usePrediction.getState();
    expect(state.history).toHaveLength(3);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
