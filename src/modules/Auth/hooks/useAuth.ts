import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authRepository } from '../repository/AuthRepository';
import { LoginRequest, SignupRequest, GoogleAuthRequest, UpdateProfileRequest } from '../types/User';

// Query keys
export const AUTH_QUERY_KEYS = {
  user: ['auth', 'user'] as const,
  profile: ['auth', 'profile'] as const,
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('access_token');

  // Get user profile
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: () => authRepository.getUserProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authRepository.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (userData: SignupRequest) => authRepository.signup(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
    },
  });

  // Google auth mutation
  const googleAuthMutation = useMutation({
    mutationFn: (googleData: GoogleAuthRequest) => authRepository.googleAuth(googleData),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => authRepository.updateUserProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, updatedUser);
    },
  });

  return {
    // State
    user,
    isAuthenticated,
    isLoadingUser,
    userError,

    // Mutations
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    googleAuth: googleAuthMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,

    // Error states
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
    updateProfileError: updateProfileMutation.error,

    // Reset functions
    resetLoginError: loginMutation.reset,
    resetSignupError: signupMutation.reset,
  };
}; 