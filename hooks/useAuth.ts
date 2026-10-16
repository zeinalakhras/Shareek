import { useCallback } from 'react';
import * as authApi from '@/api/auth/authApi';
import type {
  AuthUser,
  CredentialsRequest,
  CurrentUser,
  VerifyOtpRequest,
} from '@/api/auth/types';
import { useAuthStore } from '@/store/useAuthStore';
import { getRefreshToken } from '@/utils/secureStore';

const profileToAuthUser = (profile: CurrentUser): AuthUser => ({
  id: profile.id,
  full_name: profile.full_name,
  email: profile.email,
  profile_image: profile.profile_image,
  created_at: profile.stats?.member_since ?? '',
});

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCompletingSetup = useAuthStore((state) => state.isCompletingSetup);
  const isLoading = useAuthStore((state) => state.isLoading);

  const bootstrap = useCallback(async () => {
    const {
      setLoading,
      clearSession,
      setTokens,
      setProfile,
      setUser,
    } = useAuthStore.getState();

    setLoading(true);

    try {
      const storedRefreshToken = await getRefreshToken();
      if (!storedRefreshToken) {
        await clearSession();
        return;
      }

      const { data: tokens } = await authApi.refreshToken({
        refresh_token: storedRefreshToken,
      });
      await setTokens(tokens.access_token, tokens.refresh_token);

      try {
        const { data: me } = await authApi.getCurrentUser();
        setProfile(me);
        setUser(profileToAuthUser(me));
      } catch {
      }
    } catch {
      await clearSession();
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: CredentialsRequest) => {
    const { data } = await authApi.login(credentials);

    await useAuthStore
      .getState()
      .setSession(data.user, data.access_token, data.refresh_token);

    try {
      const { data: me } = await authApi.getCurrentUser();
      useAuthStore.getState().setProfile(me);
    } catch {
    }

    return data.user;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: me } = await authApi.getCurrentUser();
    const store = useAuthStore.getState();
    store.setProfile(me);
    store.setUser(profileToAuthUser(me));
    return me;
  }, []);

  const verifyEmailOtp = useCallback(async (body: VerifyOtpRequest) => {
    const { data } = await authApi.verifyOtp(body);
    await useAuthStore
      .getState()
      .setSession(data.user, data.access_token, data.refresh_token, true);

    try {
      const { data: me } = await authApi.getCurrentUser();
      useAuthStore.getState().setProfile(me);
    } catch {
    }

    return data.user;
  }, []);

  const completeSetup = useCallback(() => {
    useAuthStore.getState().setCompletingSetup(false);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = await getRefreshToken();

    try {
      if (refreshToken) {
        await authApi.logout({ refresh_token: refreshToken });
      }
    } catch {
    } finally {
      await useAuthStore.getState().clearSession();
    }
  }, []);

  return {
    user,
    profile,
    isAuthenticated,
    isCompletingSetup,
    isLoading,
    bootstrap,
    login,
    logout,
    refreshProfile,
    completeSetup,
    register: authApi.register,
    verifyEmailOtp,
    verifyResetOtp: authApi.verifyResetOtp,
    resendOtp: authApi.resendOtp,
    requestPasswordReset: authApi.forgotPassword,
    confirmPasswordReset: authApi.resetPassword,
  };
};