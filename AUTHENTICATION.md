# Authentication Implementation Guide

This document explains how authentication is implemented in the Next.js frontend and how to use it.

## Overview

The authentication system connects to the FastAPI backend (`/auth` endpoints) and provides:
- User registration (signup)
- User login
- JWT token management
- Protected routes
- User session management

## Architecture

### Files Created

1. **`lib/api.ts`** - API service layer
   - Handles all API calls to the backend
   - Manages JWT token storage in localStorage
   - Provides typed interfaces for requests/responses

2. **`contexts/AuthContext.tsx`** - Authentication context provider
   - Manages global authentication state
   - Provides `useAuth` hook for components
   - Handles login, signup, logout, and user data

3. **`hooks/useAuth.ts`** - Authentication hook
   - Convenience export of `useAuth` from AuthContext

4. **`components/ProtectedRoute.tsx`** - Route protection component
   - Wraps pages that require authentication
   - Redirects to login if not authenticated

5. **`components/Providers.tsx`** - Client-side providers wrapper
   - Wraps AuthProvider and Toaster for the app

### Files Updated

1. **`app/layout.tsx`** - Added Providers wrapper
2. **`components/Login.tsx`** - Connected to backend authentication
3. **`app/register/page.tsx`** - Updated to match backend schema (username, email, password)
4. **`components/UserHeader.tsx`** - Shows user info and logout functionality
5. **`app/dashboard/page.tsx`** - Example of protected route

## Usage

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Using Authentication in Components

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes

Wrap any page or component that requires authentication:

```tsx
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Login Flow

1. User enters username and password
2. `login()` function is called from `useAuth()`
3. Token is stored in localStorage
4. User data is fetched and stored in context
5. User is redirected to home page

### Signup Flow

1. User enters username, email, and password
2. `signup()` function is called from `useAuth()`
3. User is created in backend
4. User is automatically logged in
5. User is redirected to home page

### Logout Flow

1. `logout()` function is called
2. Token is removed from localStorage
3. User state is cleared
4. User is redirected to login page

## API Endpoints

The frontend connects to these backend endpoints:

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info
- `GET /auth/protected` - Example protected endpoint

## Token Management

- Tokens are stored in `localStorage` as `auth_token`
- Tokens are automatically included in API requests via Authorization header
- Tokens expire after 24 hours (configured in backend)
- Invalid/expired tokens trigger automatic logout

## Error Handling

All authentication functions throw errors that can be caught:

```tsx
try {
  await login({ username, password });
} catch (error: any) {
  console.error("Login failed:", error.message);
  // Show error to user
}
```

## Example: Complete Protected Page

```tsx
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.username}!</p>
        <p>Email: {user?.email}</p>
      </div>
    </ProtectedRoute>
  );
}
```

## Notes

- The backend uses `username` (not email) for login
- Passwords are hashed on the backend using bcrypt
- JWT tokens are used for session management
- All API calls include the token in the Authorization header automatically
