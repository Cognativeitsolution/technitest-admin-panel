export type User = {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

export type AuthState = {
  user: User | null;
  roles: string[];
  permissions: string[];
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
