export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  documentCount: number;
  requirementCount: number;
}

export interface CreateProjectRequest {
  userId: string;
  name: string;
  description?: string | null;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string | null;
}