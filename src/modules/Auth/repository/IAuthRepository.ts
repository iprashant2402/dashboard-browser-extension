import { AuthResponse, LoginRequest, SignupRequest, GoogleAuthRequest, User, UpdateProfileRequest } from '../types/User';

export interface IAuthRepository {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  signup(userData: SignupRequest): Promise<AuthResponse>;
  googleAuth(googleData: GoogleAuthRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<{ accessToken: string }>;
  getUserProfile(): Promise<User>;
  updateUserProfile(data: UpdateProfileRequest): Promise<User>;
  searchUsers(query: string): Promise<User[]>;
} 