# Auth Module

This module provides authentication functionality for the dashboard application, including user login, signup, and profile management.

## Features

- ✅ Email/password authentication
- ✅ User signup with first name, last name, email, and password
- ✅ Automatic token refresh
- ✅ User profile display
- ✅ Logout functionality
- ✅ Integration with React Query for state management
- ✅ Responsive design for mobile and desktop
- 🔄 Google OAuth authentication (prepared but not implemented)

## Components

### AuthButton
Located in the footer bar next to the settings button. Shows:
- Person icon when not logged in
- User's initials/avatar when logged in
- Loading animation during authentication

### AuthDialog
Modal dialog that handles:
- Login form
- Signup form
- User profile display when authenticated
- Error handling and validation

## API Integration

The module integrates with the Insquoo backend API:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/google` - Google OAuth (ready for implementation)

### User Management Endpoints
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users

## Configuration

Set the API base URL via environment variable:
```env
VITE_API_BASE_URL=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

## Usage

The Auth module is automatically integrated into the application. Users can access authentication by clicking the person icon in the bottom-left corner (footer bar).

### For Developers

Import and use the `useAuth` hook:

```tsx
import { useAuth } from '../modules/Auth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    isLoggingIn 
  } = useAuth();

  // Use authentication state and methods
}
```

## State Management

The module uses React Query for:
- Caching user data
- Automatic background refetching
- Optimistic updates
- Error handling
- Loading states

## Token Management

- Access tokens are stored in localStorage
- Automatic token refresh on 401 responses
- Secure logout clears all stored tokens
- Device ID is generated and stored for API tracking

## Security Features

- Automatic token refresh
- Request/response interceptors for consistent API headers
- Secure token storage
- Error handling for authentication failures
- Device tracking for security audit trails 