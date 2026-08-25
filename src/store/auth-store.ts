import { create } from "zustand";

import { authStorage } from "@/lib/auth-storage";
import { authService } from "@/services/auth.service";
import type { AuthState, User } from "@/types/auth.types";

type AuthActions = {
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  initialize: async () => {
    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }
      set({ accessToken: token, refreshToken: authStorage.getRefreshToken() });
      const response = await authService.getMe();
      // Extract user from the nested response structure
      const rawUser = 
        (response as any)?.response?.data || 
        (response as any)?.data || 
        (response as any)?.user || 
        response;
      
      const user: User = {
        id: String(rawUser?.id || rawUser?._id || "admin"),
        fullName: String(rawUser?.fullName || rawUser?.full_name || rawUser?.username || "Admin User"),
        email: String(rawUser?.email || ""),
        avatar: rawUser?.avatar ? String(rawUser?.avatar) : undefined,
      };
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      authStorage.clear();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: (accessToken, refreshToken, user) => {
    authStorage.setTokens(accessToken, refreshToken);
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      authStorage.clear();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
