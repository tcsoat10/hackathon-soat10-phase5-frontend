// Types and interfaces for the application

export interface Person {
  cpf: string;
  name: string;
  email: string;
  birth_date: string;
}

export interface User {
  name: string;
  password: string;
}

export interface SignUpRequest {
  person: Person;
  user: User;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface VideoJob {
  id: string;
  job_ref: string;
  client_identification: string;
  status: string;
  created_at: string;
  updated_at: string;
  filename?: string;
  filetype?: string;
}

export interface ZipFileInfo {
  file_url: string;
  job_ref: string;
  client_identification: string;
}

export interface VideoUploadResponse {
  id: string;
  job_ref: string;
  filename: string;
  filetype: string;
  client_identification: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  message: string;
  status?: number;
}