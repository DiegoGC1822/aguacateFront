import {
  validateNameField,
  validateEmailField,
  validatePasswordRules,
  validateRegisterForm,
  registerUseCase,
} from "../../domain/registerUseCase";
import { register } from "../../data/services/authService";

// Mock del servicio de registro
jest.mock("../../data/services/authService", () => ({
  register: jest.fn(),
}));

describe("registerUseCase - Validaciones y Registro", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateNameField", () => {
    test("debe rechazar nombres vacíos o menores de 4 caracteres", () => {
      expect(validateNameField("")).toEqual({ hasValue: false, hasMinLength: false, isValid: false });
      expect(validateNameField("abc")).toEqual({ hasValue: true, hasMinLength: false, isValid: false });
    });

    test("debe aceptar nombres de 4 o más caracteres", () => {
      expect(validateNameField("Juan")).toEqual({ hasValue: true, hasMinLength: true, isValid: true });
    });
  });

  describe("validateEmailField", () => {
    test("debe rechazar emails vacíos o con formato inválido", () => {
      expect(validateEmailField("")).toEqual({ hasValue: false, hasValidFormat: false, isValid: false });
      expect(validateEmailField("invalid-email")).toEqual({ hasValue: true, hasValidFormat: false, isValid: false });
    });

    test("debe aceptar emails con formato correcto", () => {
      expect(validateEmailField("test@test.com")).toEqual({ hasValue: true, hasValidFormat: true, isValid: true });
    });
  });

  describe("validatePasswordRules", () => {
    test("debe evaluar fortaleza y coincidencia de contraseña", () => {
      // Menos de 8 caracteres
      expect(validatePasswordRules("Ab1", "Ab1")).toMatchObject({ hasMinLength: false, isValid: false });
      // Sin mayúscula
      expect(validatePasswordRules("abcde123", "abcde123")).toMatchObject({ hasUppercase: false, isValid: false });
      // Sin número
      expect(validatePasswordRules("Abcdefgh", "Abcdefgh")).toMatchObject({ hasNumber: false, isValid: false });
      // No coinciden
      expect(validatePasswordRules("Abcdefg1", "Abcdefg2")).toMatchObject({ passwordsMatch: false, isValid: false });
      // Todo correcto
      expect(validatePasswordRules("Abcdefg1", "Abcdefg1")).toEqual({
        hasMinLength: true,
        hasUppercase: true,
        hasNumber: true,
        passwordsMatch: true,
        isValid: true,
      });
    });
  });

  describe("validateRegisterForm", () => {
    test("debe devolver formulario válido si todos los campos son correctos", () => {
      const result = validateRegisterForm("juan@test.com", "Juan1234", "Juan1234", "Juan", "Perez");
      expect(result.isFormValid).toBe(true);
    });

    test("debe devolver formulario inválido si algún campo falla", () => {
      const result = validateRegisterForm("invalid-email", "Juan1234", "Juan1234", "Juan", "Perez");
      expect(result.isFormValid).toBe(false);
    });
  });

  describe("registerUseCase (Acción Asíncrona)", () => {
    test("debe lanzar error de validación correspondiente si falla alguna regla", async () => {
      await expect(
        registerUseCase("", "Juan1234", "Juan1234", "Juan", "Perez")
      ).rejects.toThrow("Ingrese email");

      await expect(
        registerUseCase("juan@test.com", "123", "123", "Juan", "Perez")
      ).rejects.toThrow("La contraseña debe tener al menos 8 caracteres");

      expect(register).not.toHaveBeenCalled();
    });

    test("debe llamar a register si los datos son válidos", async () => {
      const mockUser = { id: 1, email: "juan@test.com" };
      (register as jest.Mock).mockResolvedValue(mockUser);

      const result = await registerUseCase("juan@test.com", "Juan1234", "Juan1234", "Juan", "Perez");

      expect(register).toHaveBeenCalledWith("juan@test.com", "Juan1234", "Juan1234", "Juan", "Perez");
      expect(result).toEqual(mockUser);
    });
  });
});
