import axios, { AxiosInstance } from 'axios';
import { IAuthRepository } from './IAuthRepository';
import { AuthResponse, LoginRequest, SignupRequest, GoogleAuthRequest, User, UpdateProfileRequest } from '../types/User';

const API_ENDPOINTS_TO_SKIP_REFRESH = [
  '/api/auth/refresh',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
];

class AuthRepository implements IAuthRepository {
  private api: AxiosInstance;
  private baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'rm-platform': 'WEB',
        'rm-app-version': import.meta.env.VITE_APP_VERSION,
        'rm-os-version': '0.0.0',
      },
      withCredentials: true,
    });

    // Initialize device ID if not present
    this.initializeDeviceId();

    // Add request interceptor to include common headers
    this.api.interceptors.request.use((config) => {
      config.headers['rm-timestamp'] = Date.now().toString();
      config.headers['rm-request-id'] = crypto.randomUUID();
      
      // Add device ID
      const deviceId = localStorage.getItem('device_id');
      if (deviceId) {
        config.headers['rm-device-id'] = deviceId;
      }

      // Add auth token if available
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    });

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry && (
            !API_ENDPOINTS_TO_SKIP_REFRESH.includes(originalRequest.url)
        )) {
          originalRequest._retry = true;
          
          try {
            const refreshResponse = await this.refreshToken();
            localStorage.setItem('access_token', refreshResponse.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.reload();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private initializeDeviceId(): void {
    const existingDeviceId = localStorage.getItem('device_id');
    if (!existingDeviceId) {
      const deviceId = import.meta.env.VITE_DEVICE_ID || `device-${crypto.randomUUID()}`;
      localStorage.setItem('device_id', deviceId);
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post('/api/auth/login', credentials);
    const authData = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', authData.accessToken);
    localStorage.setItem('refresh_token', authData.refreshToken);
    
    return authData;
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await this.api.post('/api/auth/signup', userData);
    const authData = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', authData.accessToken);
    localStorage.setItem('refresh_token', authData.refreshToken);
    
    return authData;
  }

  async googleAuth(googleData: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await this.api.post('/api/auth/google', googleData);
    const authData = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', authData.accessToken);
    localStorage.setItem('refresh_token', authData.refreshToken);
    
    return authData;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/api/auth/logout');
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await this.api.post('/api/auth/refresh');
    return response.data;
  }

  async getUserProfile(): Promise<User> {
    const response = await this.api.get('/api/users/profile');
    return response.data;
  }

  async updateUserProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await this.api.patch('/api/users/profile', data);
    return response.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await this.api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const authRepository = new AuthRepository(); 