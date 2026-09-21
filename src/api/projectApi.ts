import apiClient from "./apiClient";

import type {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from "../types/project";

export async function getProjects(
  userId: string
): Promise<Project[]> {
  const response =
    await apiClient.get<Project[]>(
      "/projects",
      {
        params: {
          userId,
        },
      }
    );

  return response.data;
}

export async function getProject(
  projectId: string
): Promise<Project> {
  const response =
    await apiClient.get<Project>(
      `/projects/${projectId}`
    );

  return response.data;
}

export async function createProject(
  request: CreateProjectRequest
): Promise<Project> {
  console.log(
    "Create project request:",
    request
  );

  const response =
    await apiClient.post<Project>(
      "/projects",
      request
    );

  return response.data;
}

export async function updateProject(
  projectId: string,
  request: UpdateProjectRequest
): Promise<Project> {
  const response =
    await apiClient.put<Project>(
      `/projects/${projectId}`,
      request
    );

  return response.data;
}

export async function deleteProject(
  projectId: string
): Promise<void> {
  await apiClient.delete(
    `/projects/${projectId}`
  );
}