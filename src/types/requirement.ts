export interface Requirement {
  id: string;
  documentId: string;
  requirementNumber?: string | null;
  requirementText: string;
  sequenceNumber: number;

  humanIsHazard?: boolean | null;
  humanClassifiedAtUtc?: string | null;

  hasAiClassification: boolean;
}

export interface HumanClassificationRequest {
  userId: string;
  isHazard: boolean;
}

export interface HumanClassificationResponse {
  requirementId: string;
  userId: string;
  isHazard: boolean;
  classifiedAtUtc: string;
}

export interface ClassificationProgress {
  totalRequirements: number;
  classifiedRequirements: number;
  remainingRequirements: number;
  isComplete: boolean;
  percentComplete: number;
}

export interface RunAiClassificationRequest {
  userId: string;
}

export interface AiClassificationRunResponse {
  projectId: string;
  totalRequirements: number;
  classifiedRequirements: number;
  modelName: string;
}