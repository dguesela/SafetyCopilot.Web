import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getProjects,
} from "../api/projectApi";

import {
  getProfile,
} from "../api/profileApi";

import {
  useAuth,
} from "../contexts/AuthContext";

import type {
  Project,
} from "../types/project";

export default function DashboardPage() {
  const { user } =
    useAuth();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [hasApiKey, setHasApiKey] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          projectResults,
          profileResult,
        ] = await Promise.all([
          getProjects(user.id),
          getProfile(user.id),
        ]);

        setProjects(
          projectResults
        );

        setHasApiKey(
          profileResult
            .hasOpenAiApiKey
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load the dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  const totalDocuments =
    projects.reduce(
      (total, project) =>
        total +
        project.documentCount,
      0
    );

  const totalRequirements =
    projects.reduce(
      (total, project) =>
        total +
        project.requirementCount,
      0
    );

  if (loading) {
    return (
      <div className="page-container">
        <p>
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>
            Dashboard
          </h1>

          <p className="page-subtitle">
            Welcome back
            {user?.displayName
              ? `, ${user.displayName}`
              : ""}
            .
          </p>
        </div>

        <Link
          to="/projects"
          className="button button-primary"
        >
          Manage Projects
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {!hasApiKey && (
        <div className="dashboard-warning">
          <div>
            <strong>
              OpenAI API key not configured
            </strong>

            <p>
              You can perform human
              classification now, but
              AI classification will
              require an OpenAI API
              key.
            </p>
          </div>

          <Link
            to="/profile"
            className="button button-secondary"
          >
            Configure API Key
          </Link>
        </div>
      )}

      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-label">
            Projects
          </span>

          <strong className="stat-value">
            {projects.length}
          </strong>

          <span className="stat-description">
            Research projects
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Documents
          </span>

          <strong className="stat-value">
            {totalDocuments}
          </strong>

          <span className="stat-description">
            Requirement PDFs
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Requirements
          </span>

          <strong className="stat-value">
            {totalRequirements}
          </strong>

          <span className="stat-description">
            Extracted requirements
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            AI Configuration
          </span>

          <strong
            className={
              hasApiKey
                ? "stat-status stat-status-ready"
                : "stat-status stat-status-warning"
            }
          >
            {hasApiKey
              ? "Ready"
              : "Not Configured"}
          </strong>

          <span className="stat-description">
            OpenAI classification
          </span>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>
              Research Workflow
            </h2>

            <p>
              SafetyCopilot separates
              human decisions from AI
              output before comparison.
            </p>
          </div>
        </div>

        <div className="workflow-grid">
          <div className="workflow-card">
            <span className="workflow-number">
              1
            </span>

            <h3>
              Create Project
            </h3>

            <p>
              Create a research
              project for the
              requirement set being
              evaluated.
            </p>
          </div>

          <div className="workflow-card">
            <span className="workflow-number">
              2
            </span>

            <h3>
              Upload Requirements
            </h3>

            <p>
              Upload a PDF and let
              SafetyCopilot extract
              individual software
              requirements.
            </p>
          </div>

          <div className="workflow-card">
            <span className="workflow-number">
              3
            </span>

            <h3>
              Human Classification
            </h3>

            <p>
              Classify each
              requirement independently
              as Hazard or Not Hazard.
            </p>
          </div>

          <div className="workflow-card">
            <span className="workflow-number">
              4
            </span>

            <h3>
              AI Classification
            </h3>

            <p>
              After the human phase
              is complete, run the
              independent AI
              classification.
            </p>
          </div>

          <div className="workflow-card">
            <span className="workflow-number">
              5
            </span>

            <h3>
              Compare Results
            </h3>

            <p>
              Examine agreement,
              human-only hazards and
              AI-only hazards.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>
              Recent Projects
            </h2>

            <p>
              Continue your current
              classification studies.
            </p>
          </div>

          <Link
            to="/projects"
            className="section-link"
          >
            View all projects
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <h3>
              No projects yet
            </h3>

            <p>
              Create your first
              project to begin a
              Human–AI hazard
              classification study.
            </p>

            <Link
              to="/projects"
              className="button button-primary"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="project-card-grid">
            {projects
              .slice(0, 6)
              .map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="dashboard-project-card"
                >
                  <div className="dashboard-project-card-header">
                    <h3>
                      {project.name}
                    </h3>

                    <span>
                      Open
                    </span>
                  </div>

                  <p>
                    {project.description ||
                      "No project description."}
                  </p>

                  <div className="dashboard-project-metrics">
                    <div>
                      <strong>
                        {
                          project.documentCount
                        }
                      </strong>

                      <span>
                        Documents
                      </span>
                    </div>

                    <div>
                      <strong>
                        {
                          project.requirementCount
                        }
                      </strong>

                      <span>
                        Requirements
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}