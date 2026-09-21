import apiClient from "./apiClient";

import type {
  RequirementDocument,
  RequirementDocumentDetails,
  RequirementExtractionResponse,
} from "../types/document";

export async function getProjectDocuments(
  projectId: string
): Promise<RequirementDocument[]> {
  const response =
    await apiClient.get<
      RequirementDocument[]
    >(
      `/projects/${projectId}/documents`
    );

  return response.data;
}

export async function getDocument(
  documentId: string
): Promise<RequirementDocumentDetails> {
  const response =
    await apiClient.get<
      RequirementDocumentDetails
    >(
      `/documents/${documentId}`
    );

  return response.data;
}

export async function uploadDocument(
  projectId: string,
  file: File
): Promise<RequirementDocument> {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await apiClient.post<
      RequirementDocument
    >(
      `/projects/${projectId}/documents`,
      formData
    );

  return response.data;
}

export async function extractRequirements(
  documentId: string
): Promise<RequirementExtractionResponse> {
  const response =
    await apiClient.post<
      RequirementExtractionResponse
    >(
      `/documents/${documentId}/extract-requirements`
    );

  return response.data;
}

export async function deleteDocument(
  documentId: string
): Promise<void> {
  await apiClient.delete(
    `/documents/${documentId}`
  );
}

export function getDocumentPdfUrl(
  documentId: string
): string {
  return (
    `https://localhost:7014/api/documents/` +
    `${documentId}/pdf`
  );
}