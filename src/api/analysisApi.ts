import apiClient from "./apiClient";

import type {
  AnalysisSummary,
} from "../types/analysis";

export async function getProjectAnalysis(
  projectId: string
): Promise<AnalysisSummary> {
  const response =
    await apiClient.get<AnalysisSummary>(
      `/projects/${projectId}/analysis`
    );

  return response.data;
}