import { create } from 'zustand';
import {
  setTokens,
  removeTokens,
  getAccessToken,
  getRefreshToken,
} from '../utils/secureStore';
import { UserProfileData as User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, accessToken, refreshToken) => {
    await setTokens(accessToken, refreshToken);
    set({
      user,
      token: accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await removeTokens();
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkAuthStatus: async () => {
    try {
      const storedAccessToken = await getAccessToken();
      const storedRefreshToken = await getRefreshToken();

      if (storedAccessToken && storedRefreshToken) {
        set({
          token: storedAccessToken,
          refreshToken: storedRefreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setUser: (user) => set({ user }),
}));