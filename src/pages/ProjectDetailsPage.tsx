import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getProject,
} from "../api/projectApi";

import {
  getProjectDocuments,
} from "../api/documentApi";

import {
  getClassificationProgress,
} from "../api/requirementApi";

import {
  useAuth,
} from "../contexts/AuthContext";

import type {
  Project,
} from "../types/project";

import type {
  RequirementDocument,
} from "../types/document";

import type {
  ClassificationProgress,
} from "../types/requirement";

export default function ProjectDetailsPage() {
  const {
    projectId,
  } = useParams();

  const {
    user,
  } = useAuth();

  const [project, setProject] =
    useState<Project | null>(null);

  const [documents, setDocuments] =
    useState<RequirementDocument[]>([]);

  const [progress, setProgress] =
    useState<ClassificationProgress | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      if (!projectId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          projectResult,
          documentResult,
          progressResult,
        ] = await Promise.all([
          getProject(projectId),
          getProjectDocuments(projectId),
          getClassificationProgress(
            projectId,
            user.id
          ),
        ]);

        setProject(projectResult);
        setDocuments(documentResult);
        setProgress(progressResult);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load project details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId, user]);

  if (loading) {
    return (
      <div className="page-container">
        <p>
          Loading project...
        </p>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          Project ID is missing.
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          {error ??
            "Project not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>
            {project.name}
          </h1>

          <p className="page-subtitle">
            {project.description ||
              "No project description."}
          </p>
        </div>

        <div className="form-actions">
          <Link
            to={`/projects/${project.id}/upload`}
            className="button button-primary"
          >
            Upload PDF
          </Link>

          <Link
            to="/projects"
            className="button button-secondary"
          >
            Back to Projects
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-label">
            Documents
          </span>

          <strong className="stat-value">
            {project.documentCount}
          </strong>

          <span className="stat-description">
            Uploaded requirement PDFs
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Requirements
          </span>

          <strong className="stat-value">
            {project.requirementCount}
          </strong>

          <span className="stat-description">
            Extracted requirements
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Human Classified
          </span>

          <strong className="stat-value">
            {progress?.classifiedRequirements ??
              0}
          </strong>

          <span className="stat-description">
            Completed classifications
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Progress
          </span>

          <strong className="stat-value">
            {progress
              ? `${progress.percentComplete.toFixed(
                  0
                )}%`
              : "0%"}
          </strong>

          <span className="stat-description">
            Human classification phase
          </span>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>
              Classification Workflow
            </h2>

            <p>
              Human classification must
              be completed before AI
              classification.
            </p>
          </div>
        </div>

        <div className="project-workflow-actions">
          <Link
            to={`/projects/${project.id}/requirements`}
            className="button button-primary"
          >
            {progress?.isComplete
              ? "Review Human Classifications"
              : "Continue Human Classification"}
          </Link>

          <Link
            to={`/projects/${project.id}/analysis`}
            className="button button-secondary"
          >
            View Analysis
          </Link>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>
              Requirement Documents
            </h2>

            <p>
              PDFs uploaded to this
              project.
            </p>
          </div>

          <Link
            to={`/projects/${project.id}/upload`}
            className="section-link"
          >
            Upload document
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="empty-state">
            <h3>
              No documents uploaded
            </h3>

            <p>
              Upload a PDF containing
              software requirements to
              begin the study.
            </p>

            <Link
              to={`/projects/${project.id}/upload`}
              className="button button-primary"
            >
              Upload PDF
            </Link>
          </div>
        ) : (
          <div className="document-list">
            {documents.map(
              (document) => (
                <div
                  key={document.id}
                  className="document-row"
                >
                  <div className="document-row-main">
                    <strong>
                      {document.fileName}
                    </strong>

                    <span>
                      {
                        document.requirementCount
                      }{" "}
                      requirements
                    </span>
                  </div>

                  <div className="document-row-meta">
                    <span>
                      {formatFileSize(
                        document.fileSizeBytes
                      )}
                    </span>

                    <span>
                      {new Date(
                        document.uploadedAtUtc
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function formatFileSize(
  bytes: number
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}