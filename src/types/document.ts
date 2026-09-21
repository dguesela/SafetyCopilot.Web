export interface RequirementDocument {
  id: string;
  projectId: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  uploadedAtUtc: string;
  processedAtUtc?: string | null;
  requirementCount: number;
}

export interface RequirementDocumentDetails {
  id: string;
  projectId: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  extractedText?: string | null;
  uploadedAtUtc: string;
  processedAtUtc?: string | null;
  requirementCount: number;
}

export interface RequirementExtractionResponse {
  documentId: string;
  fileName: string;
  extractedRequirementCount: number;
}