import apiClient from "./apiClient";

import type {
    ExperimentSession,
    CreateExperimentSessionRequest,
    RecordMeasurementRequest,
} from "../types/experiment";

export async function createExperimentSession(
    request: CreateExperimentSessionRequest
): Promise<ExperimentSession> {

    const response =
        await apiClient.post<ExperimentSession>(
            "/experiments/sessions",
            request
        );

    return response.data;
}

export async function completeExperimentSession(
    sessionId: string
): Promise<ExperimentSession> {

    const response =
        await apiClient.post<ExperimentSession>(
            `/experiments/sessions/${sessionId}/complete`
        );

    return response.data;
}

export async function recordMeasurement(
    sessionId: string,
    request: RecordMeasurementRequest
): Promise<void> {

    await apiClient.post(
        `/experiments/sessions/${sessionId}/measurements`,
        request
    );
}