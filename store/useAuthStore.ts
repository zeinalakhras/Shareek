import { create } from 'zustand';
import {
  setRefreshToken as persistRefreshToken,
  removeRefreshToken,
} from '../utils/secureStore';
import type { AuthUser, CurrentUser } from '../api/auth/types';


interface AuthState {
  user: AuthUser | null;
  profile: CurrentUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  isCompletingSetup: boolean;
  isLoading: boolean;

  setSession: (
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
    isCompletingSetup?: boolean
  ) => Promise<void>;
  setTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: CurrentUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setCompletingSetup: (isCompletingSetup: boolean) => void;
  clearSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  accessToken: null,
  isAuthenticated: false,
  isCompletingSetup: false,
  isLoading: true,

 
  setSession: async (user, accessToken, refreshToken, isCompletingSetup = false) => {
    await persistRefreshToken(refreshToken);
    set({ user, accessToken, isAuthenticated: true, isCompletingSetup, isLoading: false });
  },

  setTokens: async (accessToken, refreshToken) => {
    if (refreshToken) {
      await persistRefreshToken(refreshToken);
    }
    set({ accessToken, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  setProfile: (profile) => set({ profile }),

  setLoading: (isLoading) => set({ isLoading }),

  setCompletingSetup: (isCompletingSetup) => set({ isCompletingSetup }),

  clearSession: async () => {
    await removeRefreshToken();
    set({
      user: null,
      profile: null,
      accessToken: null,
      isAuthenticated: false,
      isCompletingSetup: false,
      isLoading: false,
    });
  },
}));
