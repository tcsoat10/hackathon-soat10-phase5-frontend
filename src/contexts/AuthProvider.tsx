import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';
import type { IAuthService } from '../services/AuthService';
import type { AuthResponse, SignInRequest, SignUpRequest } from '../types';

interface AuthProviderProps {
  children: ReactNode;
  authService: IAuthService;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, authService }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = () => {
      console.log('Checking auth on app load...');
      const isAuth = authService.isAuthenticated();
      console.log('isAuthenticated:', isAuth);
      
      if (isAuth) {
        const token = authService.getToken();
        console.log('Found token:', !!token);
        if (token) {
          // Decode JWT token to get user info
          const decoded = decodeJWT(token);
          if (decoded && decoded.person) {
            setUser({
              id: decoded.person.customer_id,
              name: decoded.person.name,
              email: decoded.person.email
            });
          } else {
            // Fallback user object
            setUser({ id: '1', name: 'User', email: 'user@example.com' });
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [authService]);

  // Helper function to decode JWT token
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const signIn = async (credentials: SignInRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.signIn(credentials);
      console.log('SignIn response:', response);

      if (response.access_token) {
        const decoded = decodeJWT(response.access_token);
        console.log('Decoded JWT:', decoded);
        
        if (decoded && decoded.person) {
          setUser({
            id: decoded.person.customer_id,
            name: decoded.person.name,
            email: decoded.person.email
          });
        } else {
          setUser({ 
            id: '1', 
            name: credentials.username, 
            email: credentials.username + '@example.com' 
          });
        }
      }
      console.log('User set in context');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: SignUpRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.signUp(userData);

      if (response.access_token) {
        const decoded = decodeJWT(response.access_token);
        
        if (decoded && decoded.person) {
          setUser({
            id: decoded.person.customer_id,
            name: decoded.person.name,
            email: decoded.person.email
          });
        } else {
          setUser({ 
            id: '1', 
            name: userData.person.name, 
            email: userData.person.email 
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = (): void => {
    authService.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

