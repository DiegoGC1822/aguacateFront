import {
  validateUpdateProfileForm,
  validatePassword1,
  validatePassword2,
  validateChangePasswordForm,
  updateProfileUseCase,
  changePasswordUseCase,
} from "../../domain/UploadUseCase";
import { updateUserProfile, changePassword } from "../../data/services/authService";

// Mock de servicios de autenticación
jest.mock("../../data/services/authService", () => ({
  updateUserProfile: jest.fn(),
  changePassword: jest.fn(),
}));

describe("UploadUseCase - Actualización de Perfil y Contraseña", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUpdateProfileForm", () => {
    test("debe validar correctamente el formulario de actualización de perfil", () => {
      const invalid = validateUpdateProfileForm("abc", "Perez");
      expect(invalid.isFormValid).toBe(false);
      expect(invalid.firstName.hasMinLength).toBe(false);

      const valid = validateUpdateProfileForm("Juan", "Perez");
      expect(valid.isFormValid).toBe(true);
    });
  });

  describe("validatePassword1 (Contraseña Actual)", () => {
    test("debe verificar que no esté vacía", () => {
      expect(validatePassword1("")).toEqual({ hasValue: false, isValid: false });
      expect(validatePassword1("123")).toEqual({ hasValue: true, isValid: true });
    });
  });

  describe("validatePassword2 (Nueva Contraseña)", () => {
    test("debe verificar fortaleza de contraseña", () => {
      expect(validatePassword2("123", "123")).toMatchObject({ hasMinLength: false, isValid: false });
      expect(validatePassword2("Abcdefgh1", "123")).toMatchObject({ hasMinLength: true, hasUppercase: true, hasNumber: true, isValid: true });
    });
  });

  describe("validateChangePasswordForm", () => {
    test("debe validar formulario completo", () => {
      const invalid = validateChangePasswordForm("", "123");
      expect(invalid.isFormValid).toBe(false);

      const valid = validateChangePasswordForm("contrasenaActual", "Abcdefgh1");
      expect(valid.isFormValid).toBe(true);
    });
  });

  describe("updateProfileUseCase", () => {
    test("debe lanzar error de validación si los datos no cumplen requisitos", async () => {
      await expect(updateProfileUseCase("", "Perez")).rejects.toThrow("Ingrese su nombre");
      await expect(updateProfileUseCase("abc", "Perez")).rejects.toThrow("El nombre debe tener al menos 4 caracteres");
      expect(updateUserProfile).not.toHaveBeenCalled();
    });

    test("debe llamar a updateUserProfile si datos son válidos", async () => {
      const mockProfile = { first_name: "Juan", last_name: "Perez" };
      (updateUserProfile as jest.Mock).mockResolvedValue(mockProfile);

      const result = await updateProfileUseCase("Juan", "Perez");
      expect(updateUserProfile).toHaveBeenCalledWith("Juan", "Perez");
      expect(result).toEqual(mockProfile);
    });
  });

  describe("changePasswordUseCase", () => {
    test("debe lanzar error si no se cumplen requisitos", async () => {
      await expect(changePasswordUseCase("", "NuevaContrasena1")).rejects.toThrow("Ingrese su contraseña");
      await expect(changePasswordUseCase("Actual", "123")).rejects.toThrow("La contraseña debe tener al menos 8 caracteres");
      expect(changePassword).not.toHaveBeenCalled();
    });

    test("debe llamar a changePassword si datos son válidos", async () => {
      (changePassword as jest.Mock).mockResolvedValue({ status: "success" });

      const result = await changePasswordUseCase("ActualPassword", "NuevaContrasena1");
      expect(changePassword).toHaveBeenCalledWith("ActualPassword", "NuevaContrasena1");
      expect(result).toEqual({ status: "success" });
    });
  });
});
