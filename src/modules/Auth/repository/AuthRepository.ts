import { IAuthRepository } from './IAuthRepository';
import { AuthResponse, LoginRequest, SignupRequest, GoogleAuthRequest, User, UpdateProfileRequest } from '../types/User';
import { apiManager } from '../../../utils/ApiManager';

class AuthRepository implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiManager.post<AuthResponse>('/auth/login', credentials);
    const authData = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', authData.accessToken);
    localStorage.setItem('refresh_token', authData.refreshToken);
    
    return authData;
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiManager.post<AuthResponse>('/auth/signup', userData);
    const authData = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', authData.accessToken);
    localStorage.setItem('refresh_token', authData.refreshToken);
    
    return authData;
  }

  async googleAuth(googleData: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await apiManager.post<AuthResponse>('/auth/google', googleData);
    const authData = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', authData.accessToken);
    localStorage.setItem('refresh_token', authData.refreshToken);
    
    return authData;
  }

  async logout(): Promise<void> {
    try {
      await apiManager.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getUserProfile(): Promise<User> {
    const response = await apiManager.get<User>('/users/profile');
    return response.data;
  }

  async updateUserProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiManager.patch<User>('/users/profile', data);
    return response.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await apiManager.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const authRepository = new AuthRepository(); 