export interface Profile {
  id: string;
  email: string;
  displayName?: string | null;
  hasOpenAiApiKey: boolean;
}

export interface UpdateProfileRequest {
  displayName?: string | null;
}

export interface SaveOpenAiApiKeyRequest {
  apiKey: string;
}