import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  loginUseCase,
  registerUseCase,
  updateProfileUseCase,
  changePasswordUseCase,
} from "../../domain/authUseCase";

import {
  getUserProfile,
  logout as logoutService,
} from "../../data/services/authService";

interface AuthState {
  token: string | null;
  tokenRefresh: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  profile: {
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  setHydrated: () => void;

  login: (email: string, password: string) => Promise<void>;

  getProfile: () => Promise<void>;

  updateUserProfile: (first_name: string, last_name: string) => Promise<void>;

  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;

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
      tokenRefresh: null,
      isAuthenticated: false,
      isHydrated: false,
      profile: null,

      setHydrated: () => set({ isHydrated: true }),

      login: async (email, password): Promise<void> => {
        try {
          const { access, refresh } = await loginUseCase(email, password);

          set({
            token: access,
            tokenRefresh: refresh,
            isAuthenticated: true,
          });
        } catch (error: any) {
          throw error;
        }
      },

      getProfile: async () => {
        try {
          const profile = await getUserProfile();
          console.log("User profile:", profile);
          set({ profile });
        } catch (error: any) {
          throw error;
        }
      },

      updateUserProfile: async (first_name, last_name) => {
        try {
          const updatedProfile = await updateProfileUseCase(
            first_name,
            last_name,
          );
          set({ profile: updatedProfile });
        } catch (error: any) {
          throw error;
        }
      },

      updatePassword: async (currentPassword, newPassword) => {
        try {
          await changePasswordUseCase(currentPassword, newPassword);
        } catch (error: any) {
          throw error;
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
        } catch (error: any) {
          throw error;
        }
      },

      logout: async () => {
        await logoutService();

        set({
          token: null,
          tokenRefresh: null,
          isAuthenticated: false,
          profile: null,
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
