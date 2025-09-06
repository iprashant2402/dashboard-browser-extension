import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authRepository } from '../repository/AuthRepository';
import { LoginRequest, SignupRequest, GoogleAuthRequest, UpdateProfileRequest, User } from '../types/User';
import { AxiosError } from 'axios';
import { useBatchSync } from '../../Notes/hooks/useBatchSync';
import { ACCESS_TOKEN_KEY, PAGES_QUERY_KEYS } from '../../Notes/utils/contants';
import { setUserProfileLocalStorage } from '../../../utils/helpers';
import { AnalyticsTracker } from '../../../analytics/AnalyticsTracker';

// Query keys
export const AUTH_QUERY_KEYS = {
  user: ['auth', 'user'] as const,
  profile: ['auth', 'profile'] as const,
};

export const USER_PROFILE_STORAGE_KEY = 'user_profile';

const setAnalyticsUser = (user: User) => {
  AnalyticsTracker.setUser({
    id: user.id,
    email: user.email,
    f_name: user.firstName,
    l_name: user.lastName,
  });
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: batchSync } = useBatchSync();

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);

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
    retry: (failureCount, error: AxiosError) => {
      // Don't retry if it's an auth error
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authRepository.login(credentials),
    onSuccess: (data) => {
      setUserProfileLocalStorage(data.user);
      setAnalyticsUser(data.user);
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
      batchSync();
      AnalyticsTracker.track('Login - Success');
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (userData: SignupRequest) => authRepository.signup(userData),
    onSuccess: (data) => {
      setUserProfileLocalStorage(data.user);
      setAnalyticsUser(data.user);
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      batchSync();
      AnalyticsTracker.track('Signup - Success');
    },
  });

  // Google auth mutation
  const googleAuthMutation = useMutation({
    mutationFn: (googleData: GoogleAuthRequest) => authRepository.googleAuth(googleData),
    onSuccess: (data) => {
      setUserProfileLocalStorage(data.user);
      setAnalyticsUser(data.user);
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEYS.allPages });
      AnalyticsTracker.track('Login - Success');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
      window.location.reload();
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => authRepository.updateUserProfile(data),
    onSuccess: (updatedUser) => {
      setUserProfileLocalStorage(updatedUser);
      setAnalyticsUser(updatedUser);
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