export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  token: string | chrome.identity.GetAuthTokenResult;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
} 