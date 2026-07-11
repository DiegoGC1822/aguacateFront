import { authResponse } from "../../types";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "../../domain/errors";

const mapAxiosError = (error: any): AppError => {
  const status: number | undefined = error.response?.status;
  const rawData = error.response?.data;
  if (!error.response) {
    return new AppError(
      "NETWORK",
      "Sin conexión. Verifica tu red e intenta de nuevo.",
    );
  }

  const serverMessage: string | undefined =
    typeof rawData === "string"
      ? rawData
      : rawData?.detail ||
      rawData?.message ||
      rawData?.non_field_errors?.[0] ||
      Object.values(rawData ?? {})?.[0]?.toString();

  switch (status) {
    case 400:
      return new AppError(
        "VALIDATION",
        serverMessage || "Los datos ingresados no son válidos.",
      );
    case 401:
      return new AppError(
        "AUTH",
        "Credenciales inválidas. Verifica tu email y contraseña.",
      );
    case 403:
      return new AppError(
        "AUTH",
        serverMessage || "No tienes permisos para realizar esta acción.",
      );
    case 404:
      return new AppError(
        "AUTH",
        serverMessage || "Usuario no encontrado.",
      );
    case 409:
      return new AppError(
        "AUTH",
        serverMessage || "Este email ya está registrado.",
      );
    default:
      if (status !== undefined && status >= 500) {
        return new AppError(
          "SERVER",
          serverMessage || "Error en el servidor. Intenta más tarde.",
        );
      }
      return new AppError(
        "SERVER",
        serverMessage || error.message || "Ha ocurrido un error inesperado.",
      );
  }
};


export const login = async (
  email: string,
  password: string,
): Promise<authResponse> => {
  try {
    const response = await api.post("/auth/login/", {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    console.log("Error during login:", error.response?.data || error.message);
    throw mapAxiosError(error);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile/");
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message,
    );
    throw mapAxiosError(error);
  }
};

export const updateUserProfile = async (
  first_name: string,
  last_name: string,
) => {
  try {
    const data: any = {};

    if (first_name) {
      data.first_name = first_name;
    }

    if (last_name) {
      data.last_name = last_name;
    }

    const response = await api.patch("/auth/profile/", data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error.response?.data || error.message);
    throw mapAxiosError(error);
  }
};

export const changePassword = async (
  current_password: string,
  new_password: string,
) => {
  try {
    const response = await api.post("/auth/change-password/", {
      current_password,
      new_password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error changing password:", error.response?.data || error.message);
    throw mapAxiosError(error);
  }
};

export const register = async (
  email: string,
  password: string,
  password2: string,
  first_name: string,
  last_name: string,
) => {
  try {
    const response = await api.post("/auth/register/", {
      email,
      password,
      password2,
      first_name,
      last_name,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw mapAxiosError(error);
  }
};

export const refreshToken = async (
  refreshToken: string,
): Promise<authResponse> => {
  try {
    const response = await api.post("/auth/token/refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    throw mapAxiosError(error);
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("auth-storage");
  } catch (error: any) {
    console.error("Error during logout:", error.message);
    throw error;
  }
};

