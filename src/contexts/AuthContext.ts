import { createContext } from 'react';
import type { AuthResponse, SignInRequest, SignUpRequest } from '../types';

export interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInRequest) => Promise<void>;
  signUp: (userData: SignUpRequest) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);