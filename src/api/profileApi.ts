import apiClient from "./apiClient";

import type {
  Profile,
  SaveOpenAiApiKeyRequest,
  UpdateProfileRequest,
} from "../types/profile";

export async function getProfile(
  userId: string
): Promise<Profile> {
  const response =
    await apiClient.get<Profile>(
      `/profile/${userId}`
    );

  return response.data;
}

export async function updateProfile(
  userId: string,
  request: UpdateProfileRequest
): Promise<Profile> {
  const response =
    await apiClient.put<Profile>(
      `/profile/${userId}`,
      request
    );

  return response.data;
}

export async function saveOpenAiApiKey(
  userId: string,
  apiKey: string
): Promise<void> {
  const request: SaveOpenAiApiKeyRequest = {
    apiKey,
  };

  await apiClient.put(
    `/profile/${userId}/api-key`,
    request
  );
}

export async function removeOpenAiApiKey(
  userId: string
): Promise<void> {
  await apiClient.delete(
    `/profile/${userId}/api-key`
  );
}