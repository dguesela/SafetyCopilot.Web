export type ComparisonCategory =
  | "AgreementHazard"
  | "AgreementNotHazard"
  | "HumanOnlyHazard"
  | "AiOnlyHazard";

export interface RequirementComparison {
  requirementId: string;
  documentId: string;
  requirementNumber?: string | null;
  requirementText: string;

  humanIsHazard: boolean;
  aiIsHazard: boolean;

  isAgreement: boolean;

  comparisonCategory: ComparisonCategory;

  aiConfidence?: number | null;
  aiExplanation?: string | null;
  aiModelName?: string | null;
}

export interface AnalysisSummary {
  projectId: string;

  totalRequirements: number;

  agreementCount: number;
  hazardAgreementCount: number;
  nonHazardAgreementCount: number;

  humanOnlyHazardCount: number;
  aiOnlyHazardCount: number;

  agreementPercentage: number;

  agreements: RequirementComparison[];
  humanOnlyHazards: RequirementComparison[];
  aiOnlyHazards: RequirementComparison[];
}