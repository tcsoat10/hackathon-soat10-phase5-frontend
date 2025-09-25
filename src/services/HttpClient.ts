import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base HTTP client interface following Dependency Inversion Principle
export interface IHttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  setAuthToken(token: string): void;
  removeAuthToken(): void;
  downloadFile(url: string, config?: AxiosRequestConfig): Promise<Blob>;
}

export class HttpClient implements IHttpClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    // Use explicit param, otherwise get from env
    const envBase = baseURL ?? import.meta.env.VITE_API_BASE_URL ?? '/';
    
    // For development: always use '/' to enable Vite proxy
    // For production: use envBase (should be '/' to use Vercel proxy)
    const isDev = import.meta.env.MODE === 'development' || import.meta.env.DEV === true;
    const effectiveBaseURL = isDev ? '/' : envBase;

    // Debug logging (remove in production if needed)
    console.log('HttpClient config:', {
      mode: import.meta.env.MODE,
      isDev,
      envBase,
      effectiveBaseURL,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      BACKEND_URL: import.meta.env.BACKEND_URL,
    });

    this.client = axios.create({
      baseURL: effectiveBaseURL,
      timeout: 60000 * 5, // 5 minutes 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
    delete this.client.defaults.headers.common['Authorization'];
  }

  async downloadFile(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    const response = await this.client.get(url, {
      ...config,
      responseType: 'blob',
    });
    return response.data;
  }
}