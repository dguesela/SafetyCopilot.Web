import apiClient from "./apiClient";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

export async function register(
  request: RegisterRequest
): Promise<RegisterResponse> {
  const response =
    await apiClient.post<RegisterResponse>(
      "/auth/register",
      request
    );

  return response.data;
}

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  const response =
    await apiClient.post<LoginResponse>(
      "/auth/login",
      request
    );

  return response.data;
}