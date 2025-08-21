import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ACCESS_TOKEN_KEY } from "../modules/Notes/utils/contants";

const API_ENDPOINTS_TO_SKIP_REFRESH = [
    '/auth/refresh',
    '/auth/login',
    '/auth/signup',
    '/auth/logout',
  ];

class ApiManager {
    private api: AxiosInstance;
    private baseURL: string = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api`;

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
          const token = localStorage.getItem(ACCESS_TOKEN_KEY);
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
                localStorage.setItem(ACCESS_TOKEN_KEY, refreshResponse.accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.accessToken}`;
                return this.api(originalRequest);
              } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem(ACCESS_TOKEN_KEY);
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

      async refreshToken(): Promise<{ accessToken: string }> {
        const response = await this.api.post('/auth/refresh');
        return response.data;
      }

      async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.get(url, config);
      }

      async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.post(url, data, config);
      }

      async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.patch(url, data, config);
      }

      async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.delete(url, config);
      }

      async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.put(url, data, config);
      }
}

export const apiManager = new ApiManager();