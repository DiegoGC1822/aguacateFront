import { loginUseCase } from "../../domain/authUseCase";
import { login } from "../../data/services/authService";

// Mock del servicio de autenticación
jest.mock("../../data/services/authService", () => ({
  login: jest.fn(),
}));

describe("authUseCase - Casos de Uso de Autenticación", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe lanzar error si el email está vacío", async () => {
    await expect(loginUseCase("", "123456")).rejects.toThrow("Ingrese email");
    expect(login).not.toHaveBeenCalled();
  });

  test("debe llamar a login con datos correctos", async () => {
    const mockResponse = { access: "access_token", refresh: "refresh_token" };
    (login as jest.Mock).mockResolvedValue(mockResponse);

    const result = await loginUseCase("test@test.com", "123456");

    expect(login).toHaveBeenCalledWith("test@test.com", "123456");
    expect(result).toEqual(mockResponse);
  });
});
