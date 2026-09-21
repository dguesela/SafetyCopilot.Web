import apiClient from "./apiClient";

import type {
  AiClassificationRunResponse,
  ClassificationProgress,
  HumanClassificationRequest,
  HumanClassificationResponse,
  Requirement,
  RunAiClassificationRequest,
} from "../types/requirement";

export async function getProjectRequirements(
  projectId: string
): Promise<Requirement[]> {
  const response =
    await apiClient.get<Requirement[]>(
      `/projects/${projectId}/requirements`
    );

  return response.data;
}

export async function getDocumentRequirements(
  documentId: string
): Promise<Requirement[]> {
  const response =
    await apiClient.get<Requirement[]>(
      `/documents/${documentId}/requirements`
    );

  return response.data;
}

export async function getRequirement(
  requirementId: string
): Promise<Requirement> {
  const response =
    await apiClient.get<Requirement>(
      `/requirements/${requirementId}`
    );

  return response.data;
}

export async function classifyRequirement(
  requirementId: string,
  request: HumanClassificationRequest
): Promise<HumanClassificationResponse> {
  const response =
    await apiClient.put<
      HumanClassificationResponse
    >(
      `/requirements/${requirementId}/human-classification`,
      request
    );

  return response.data;
}

export async function getClassificationProgress(
  projectId: string,
  userId: string
): Promise<ClassificationProgress> {
  const response =
    await apiClient.get<
      ClassificationProgress
    >(
      `/projects/${projectId}/classification-progress`,
      {
        params: {
          userId,
        },
      }
    );

  return response.data;
}

export async function runAiClassification(
  projectId: string,
  userId: string
): Promise<AiClassificationRunResponse> {
  const request: RunAiClassificationRequest = {
    userId,
  };

  const response =
    await apiClient.post<
      AiClassificationRunResponse
    >(
      `/projects/${projectId}/ai-classification`,
      request
    );

  return response.data;
}