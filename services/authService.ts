import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  try {
    const response = await api.post("/auth/login/", {
      email,
      password,
    });

    return response.data.access;
  } catch (error: any) {
    console.log("Error during login:", error.response?.data);
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
    console.error("Error during registration:", error.response?.data);
    throw error;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error: any) {
    console.error("Error during logout:", error.response?.data);
    throw error;
  }
};
