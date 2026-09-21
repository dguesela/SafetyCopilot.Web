export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string | null;
}

export interface RegisterResponse {
  id: string;
  email: string;
  displayName?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string | null;
}

export interface LoginResponse {
  id: string;
  email: string;
  displayName?: string | null;
}