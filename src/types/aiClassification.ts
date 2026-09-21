export interface AiClassificationDetails {
  requirementId: string;
  requirementNumber?: string | null;
  requirementText: string;
  isHazard: boolean;
  confidence?: number | null;
  explanation?: string | null;
  modelName?: string | null;
  classifiedAtUtc: string;
}

export interface AiClassificationResults {
  projectId: string;
  totalRequirements: number;
  hazardCount: number;
  notHazardCount: number;
  averageConfidence?: number | null;
  modelName?: string | null;
  results: AiClassificationDetails[];
}

export interface AiClassificationRunResponse {
  projectId: string;
  totalRequirements: number;
  classifiedRequirements: number;
  modelName: string;
}