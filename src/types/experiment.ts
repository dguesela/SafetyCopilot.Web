export type ExperimentCondition =
    | "HumanAlone"
    | "AIAlone"
    | "HumanAIRecommendations"
    | "HumanAIExplanations"
    | "HumanAIUncertainty";

export interface ExperimentSession {
    id: string;
    projectId: string;
    condition: ExperimentCondition;
    status: string;
    startedAtUtc: string;
    completedAtUtc?: string;
}

export interface CreateExperimentSessionRequest {
    projectId: string;
    condition: ExperimentCondition;
}

export interface RecordMeasurementRequest {
    measurementType: string;
    value: number;
    unit?: string;
}