import { authResponse } from "../../types";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    throw error;
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
    throw error;
  }
};

export const updateUserProfile = async (
  first_name?: string,
  last_name?: string,
  password?: string,
) => {
  try {
    const data: any = {};

    if (first_name) {
      data.first_name = first_name;
    }

    if (last_name) {
      data.last_name = last_name;
    }

    if (password) {
      data.password = password;
    }

    const response = await api.patch("/auth/profile/", data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error.message);
    throw error;
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
    console.error("Error changing password:", error.message);
    throw error;
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
    console.log("Registering user with data:", {
      email,
      password,
      password2,
      first_name,
      last_name,
    });
    const response = await api.post("/auth/register/", {
      email,
      password,
      password2,
      first_name,
      last_name,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error during registration:", error.message);
    throw error;
  }
};

export const refreshToken = async (
  refreshToken: string,
): Promise<authResponse> => {
  try {
    const response = await api.post("/auth/refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error refreshing token:", error.message);
    throw error;
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
