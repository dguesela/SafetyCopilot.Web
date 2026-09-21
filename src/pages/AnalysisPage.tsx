import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getProjectAnalysis,
} from "../api/analysisApi";

import {
  getProject,
} from "../api/projectApi";

import type {
  AnalysisSummary,
  RequirementComparison,
} from "../types/analysis";

import type {
  Project,
} from "../types/project";

type AnalysisTab =
  | "agreements"
  | "humanOnly"
  | "aiOnly";

export default function AnalysisPage() {
  const { projectId } =
    useParams();

  const [project, setProject] =
    useState<Project | null>(null);

  const [analysis, setAnalysis] =
    useState<AnalysisSummary | null>(
      null
    );

  const [activeTab, setActiveTab] =
    useState<AnalysisTab>(
      "agreements"
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadAnalysis() {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          projectResult,
          analysisResult,
        ] = await Promise.all([
          getProject(projectId),
          getProjectAnalysis(
            projectId
          ),
        ]);

        setProject(
          projectResult
        );

        setAnalysis(
          analysisResult
        );
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ??
            "Unable to load the analysis."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [projectId]);

  const activeRows =
    useMemo(() => {
      if (!analysis) {
        return [];
      }

      if (
        activeTab === "humanOnly"
      ) {
        return analysis.humanOnlyHazards;
      }

      if (
        activeTab === "aiOnly"
      ) {
        return analysis.aiOnlyHazards;
      }

      return analysis.agreements;
    }, [
      analysis,
      activeTab,
    ]);

  if (loading) {
    return (
      <div className="page-container">
        <p>
          Loading analysis...
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

  if (!project || !analysis) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          {error ??
            "Analysis is not available."}
        </div>

        <Link
          to={`/projects/${projectId}`}
          className="button button-secondary"
        >
          Back to Project
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>
            Human–AI Analysis
          </h1>

          <p className="page-subtitle">
            {project.name}
          </p>
        </div>

        <div className="form-actions">
          <Link
            to={`/projects/${projectId}/requirements`}
            className="button button-secondary"
          >
            Requirements
          </Link>

          <Link
            to={`/projects/${projectId}`}
            className="button button-secondary"
          >
            Back to Project
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <section className="analysis-overview">
        <div className="analysis-stat-card">
          <span>
            Total Requirements
          </span>

          <strong>
            {
              analysis.totalRequirements
            }
          </strong>
        </div>

        <div className="analysis-stat-card">
          <span>
            Agreement
          </span>

          <strong>
            {
              analysis.agreementCount
            }
          </strong>

          <small>
            {
              analysis.agreementPercentage.toFixed(
                1
              )
            }
            %
          </small>
        </div>

        <div className="analysis-stat-card">
          <span>
            Both Hazard
          </span>

          <strong>
            {
              analysis.hazardAgreementCount
            }
          </strong>
        </div>

        <div className="analysis-stat-card">
          <span>
            Both Not Hazard
          </span>

          <strong>
            {
              analysis.nonHazardAgreementCount
            }
          </strong>
        </div>

        <div className="analysis-stat-card">
          <span>
            Human Only Hazard
          </span>

          <strong>
            {
              analysis.humanOnlyHazardCount
            }
          </strong>
        </div>

        <div className="analysis-stat-card">
          <span>
            AI Only Hazard
          </span>

          <strong>
            {
              analysis.aiOnlyHazardCount
            }
          </strong>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>
              Classification Comparison
            </h2>

            <p>
              Compare areas of human–AI
              agreement and disagreement.
            </p>
          </div>
        </div>

        <div className="analysis-tabs">
          <button
            type="button"
            className={
              activeTab ===
              "agreements"
                ? "analysis-tab analysis-tab-active"
                : "analysis-tab"
            }
            onClick={() =>
              setActiveTab(
                "agreements"
              )
            }
          >
            Agreements
            <span>
              {
                analysis.agreementCount
              }
            </span>
          </button>

          <button
            type="button"
            className={
              activeTab ===
              "humanOnly"
                ? "analysis-tab analysis-tab-active"
                : "analysis-tab"
            }
            onClick={() =>
              setActiveTab(
                "humanOnly"
              )
            }
          >
            Human Only
            <span>
              {
                analysis.humanOnlyHazardCount
              }
            </span>
          </button>

          <button
            type="button"
            className={
              activeTab ===
              "aiOnly"
                ? "analysis-tab analysis-tab-active"
                : "analysis-tab"
            }
            onClick={() =>
              setActiveTab(
                "aiOnly"
              )
            }
          >
            AI Only
            <span>
              {
                analysis.aiOnlyHazardCount
              }
            </span>
          </button>
        </div>

        {activeRows.length === 0 ? (
          <div className="empty-state">
            <h3>
              No results in this category
            </h3>

            <p>
              There are currently no
              requirement comparisons
              matching this category.
            </p>
          </div>
        ) : (
          <div className="analysis-list">
            {activeRows.map(
              (row) => (
                <AnalysisRow
                  key={
                    row.requirementId
                  }
                  row={row}
                />
              )
            )}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>
              Interpretation
            </h2>

            <p>
              Basic descriptive results
              from the Human–AI
              classification comparison.
            </p>
          </div>
        </div>

        <div className="analysis-interpretation-grid">
          <div className="interpretation-card">
            <strong>
              Agreement Rate
            </strong>

            <span>
              {
                analysis.agreementPercentage.toFixed(
                  2
                )
              }
              %
            </span>

            <p>
              Percentage of requirements
              for which the human and AI
              produced the same binary
              classification.
            </p>
          </div>

          <div className="interpretation-card">
            <strong>
              Human-Only Hazards
            </strong>

            <span>
              {
                analysis.humanOnlyHazardCount
              }
            </span>

            <p>
              Requirements classified as
              Hazard by the human but Not
              Hazard by the AI.
            </p>
          </div>

          <div className="interpretation-card">
            <strong>
              AI-Only Hazards
            </strong>

            <span>
              {
                analysis.aiOnlyHazardCount
              }
            </span>

            <p>
              Requirements classified as
              Hazard by the AI but Not
              Hazard by the human.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

interface AnalysisRowProps {
  row: RequirementComparison;
}

function AnalysisRow({
  row,
}: AnalysisRowProps) {
  return (
    <article className="analysis-row">
      <div className="analysis-row-header">
        <div>
          <span className="analysis-requirement-label">
            Requirement
          </span>

          <h3>
            {row.requirementNumber ||
              "Unnumbered Requirement"}
          </h3>
        </div>

        <span
          className={
            row.isAgreement
              ? "comparison-badge comparison-agreement"
              : "comparison-badge comparison-disagreement"
          }
        >
          {formatCategory(
            row.comparisonCategory
          )}
        </span>
      </div>

      <div className="analysis-requirement-text">
        {row.requirementText}
      </div>

      <div className="analysis-classification-grid">
        <div className="analysis-classification-box">
          <span>
            Human
          </span>

          <strong
            className={
              row.humanIsHazard
                ? "classification-text-hazard"
                : "classification-text-safe"
            }
          >
            {row.humanIsHazard
              ? "Hazard"
              : "Not Hazard"}
          </strong>
        </div>

        <div className="analysis-classification-box">
          <span>
            AI
          </span>

          <strong
            className={
              row.aiIsHazard
                ? "classification-text-hazard"
                : "classification-text-safe"
            }
          >
            {row.aiIsHazard
              ? "Hazard"
              : "Not Hazard"}
          </strong>
        </div>
      </div>

      <div className="ai-analysis-details">
        <div className="ai-analysis-details-header">
          <strong>
            AI Assessment
          </strong>

          {row.aiConfidence !==
            null &&
            row.aiConfidence !==
              undefined && (
              <span>
                Confidence:{" "}
                {(
                  row.aiConfidence *
                  100
                ).toFixed(0)}
                %
              </span>
            )}
        </div>

        <p>
          {row.aiExplanation ||
            "No AI explanation was provided."}
        </p>

        {row.aiModelName && (
          <small>
            Model:{" "}
            {row.aiModelName}
          </small>
        )}
      </div>
    </article>
  );
}

function formatCategory(
  category: string
): string {
  switch (category) {
    case "AgreementHazard":
      return "Agreement: Hazard";

    case "AgreementNotHazard":
      return "Agreement: Not Hazard";

    case "HumanOnlyHazard":
      return "Human Only Hazard";

    case "AiOnlyHazard":
      return "AI Only Hazard";

    default:
      return category;
  }
}