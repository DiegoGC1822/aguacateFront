import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginUseCase, registerUseCase } from "../../domain/authUseCase";

import { logout as logoutService } from "../../data/services/authService";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setHydrated: () => void;

  login: (email: string, password: string) => Promise<boolean>;

  register: (
    email: string,
    password: string,
    password2: string,
    first_name: string,
    last_name: string,
  ) => Promise<boolean>;

  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      login: async (email, password): Promise<boolean> => {
        try {
          const token = await loginUseCase(email, password);

          set({
            token,
            isAuthenticated: true,
          });

          return true;
        } catch (error: any) {
          console.error("Login error:", error);
          alert(error.message);
          return false;
        }
      },

      register: async (email, password, password2, first_name, last_name) => {
        try {
          await registerUseCase(
            email,
            password,
            password2,
            first_name,
            last_name,
          );
          alert("Registro exitoso. Ahora puedes iniciar sesión.");
          return true;
        } catch (error: any) {
          alert(error.message);
          return false;
        }
      },

      logout: async () => {
        await logoutService();

        set({
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
