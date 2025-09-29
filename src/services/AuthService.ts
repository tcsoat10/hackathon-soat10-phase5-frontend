import type { IHttpClient } from './HttpClient';
import type { SignInRequest, SignUpRequest, AuthResponse } from '../types';

// Interface for authentication service following Interface Segregation Principle
export interface IAuthService {
  signIn(credentials: SignInRequest): Promise<AuthResponse>;
  signUp(userData: SignUpRequest): Promise<AuthResponse>;
  signOut(): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
  cancelAllRequests(): void;
}

export class AuthService implements IAuthService {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async signIn(credentials: SignInRequest): Promise<AuthResponse> {
    try {
      const response = await this.httpClient.post<AuthResponse>('/api/v1/auth/signin', credentials);
      this.httpClient.setAuthToken(response.access_token);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await this.httpClient.post<AuthResponse>('/api/v1/auth/signup', userData);
      this.httpClient.setAuthToken(response.access_token);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  signOut(): void {
    this.httpClient.cancelAllRequests();
    this.httpClient.removeAuthToken();
  }

  cancelAllRequests(): void {
    this.httpClient.cancelAllRequests();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('Ocorreu um erro desconhecido durante a autenticação');
  }
}