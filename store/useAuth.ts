import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  login as loginService,
  logout as logoutService,
  register as registerService,
} from "../services/authService";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setHydrated: () => void;

  login: (email: string, password: string) => Promise<void>;

  register: (
    email: string,
    password: string,
    password2: string,
    first_name: string,
    last_name: string,
  ) => Promise<void>;

  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      login: async (email, password) => {
        const token = await loginService(email, password);

        set({
          token,
          isAuthenticated: true,
        });
      },

      register: async (email, password, password2, first_name, last_name) => {
        const token = await registerService(
          email,
          password,
          password2,
          first_name,
          last_name,
        );

        set({
          token,
          isAuthenticated: true,
        });
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
