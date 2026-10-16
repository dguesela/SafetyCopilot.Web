import apiClient from "./apiClient";

import type {
  AiClassificationResults,
  AiClassificationRunResponse
} from "../types/aiClassification";

export async function runAiClassification(
  projectId: string,
  userId: string
): Promise<AiClassificationRunResponse> {
  const response =
    await apiClient.post<AiClassificationRunResponse>(
      `/projects/${projectId}/ai-classification`,
      {
        userId
      }
    );

  return response.data;
}

export async function getAiClassificationResults(
  projectId: string,
  userId: string,
  options?: { signal?: AbortSignal; timeout?: number }
): Promise<AiClassificationResults> {
  const response =
    await apiClient.get<AiClassificationResults>(
      `/projects/${projectId}/ai-classifications`,
      {
        ...options,
        params: {
          userId
        }
      }
    );

  return response.data;
}
