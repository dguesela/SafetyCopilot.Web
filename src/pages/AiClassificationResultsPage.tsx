import { isAxiosError } from "axios";

import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getAiClassificationResults
} from "../api/aiClassificationApi";

import "./AiClassificationResultsPage.css";

import { useAuth } from "../contexts/AuthContext";

import type {
  AiClassificationDetails,
  AiClassificationResults
} from "../types/aiClassification";

type FilterType =
  | "all"
  | "hazard"
  | "not-hazard"
  | "low-confidence";

export default function AiClassificationResultsPage() {
  const {
    projectId
  } = useParams();

  const navigate =
    useNavigate();

  const { user, initializing } = useAuth();
  const userId = user?.id;

  const [
    data,
    setData
  ] =
    useState<AiClassificationResults | null>(
      null
    );

  const [
    loading,
    setLoading
  ] =
    useState(true);

  const [
    error,
    setError
  ] =
    useState<string | null>(
      null
    );

  const [
    filter,
    setFilter
  ] =
    useState<FilterType>(
      "all"
    );

  useEffect(
    () => {
      if (initializing) {
        return;
      }

      let cancelled = false;
      void loadResults();

      async function loadResults() {
        setData(null);

        if (!projectId || !userId) {
          setError(
            !projectId
              ? "Project ID was not provided."
              : "The current user could not be identified."
          );
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError(null);

          const result = await getAiClassificationResults(projectId, userId);

          if (!cancelled) {
            setData(result);
          }
        } catch (err: unknown) {
          console.error(err);

          if (!cancelled) {
            const message = isAxiosError(err)
              ? err.response?.data?.message
              : undefined;
            setError(
              typeof message === "string"
                ? message
                : "Unable to load AI classification results."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }

      return () => {
        cancelled = true;
      };
    },
    [
      projectId,
      userId,
      initializing
    ]
  );

  const filteredResults =
    useMemo(
      () => {
        if (!data) {
          return [];
        }

        switch (filter) {
          case "hazard":
            return data.results.filter(
              item =>
                item.isHazard
            );

          case "not-hazard":
            return data.results.filter(
              item =>
                !item.isHazard
            );

          case "low-confidence":
            return data.results.filter(
              item =>
                item.confidence != null &&
                item.confidence < 0.7
            );

          default:
            return data.results;
        }
      },
      [
        data,
        filter
      ]
    );

  function formatConfidence(
    value?: number | null
  ) {
    if (value == null) {
      return "N/A";
    }

    return `${Math.round(
      value * 100
    )}%`;
  }

  function handleRunAnalysis() {
    if (!projectId) {
      return;
    }

    navigate(
      `/projects/${projectId}/analysis`
    );
  }

  if (initializing || loading) {
    return (
      <div className="page-container ai-results-page">
        <div className="ai-results-panel">
          Loading AI classification results...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container ai-results-page">
        <div className="ai-results-panel">
          <h2>
            Unable to load AI results
          </h2>

          <p>
            {error}
          </p>

          {projectId && (
            <Link
              to={`/projects/${projectId}/requirements`}
              className="button button-secondary"
            >
              Back to Requirements
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="page-container ai-results-page">
      <div className="page-header">
        <div>
          <Link
            to={`/projects/${projectId}/requirements`}
            className="back-link"
          >
            <ArrowLeft
              size={18}
            />

            Back to Requirements
          </Link>

          <h1>
            AI Classification Results
          </h1>

          <p>
            Review the AI's independent hazard
            classifications before running the
            Human–AI comparative analysis.
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <SummaryCard
          icon={
            <Brain
              size={22}
            />
          }
          label="AI Classified"
          value={
            data.results.length
          }
        />

        <SummaryCard
          icon={
            <ShieldAlert
              size={22}
            />
          }
          label="AI Hazard"
          value={
            data.hazardCount
          }
        />

        <SummaryCard
          icon={
            <ShieldCheck
              size={22}
            />
          }
          label="AI Not Hazard"
          value={
            data.notHazardCount
          }
        />

        <SummaryCard
          icon={
            <Sparkles
              size={22}
            />
          }
          label="Average Confidence"
          value={
            formatConfidence(
              data.averageConfidence
            )
          }
        />
      </div>

      <div className="ai-results-panel">
        <div className="ai-results-toolbar">
          <div>
            <h2>
              Classification Results
            </h2>

            <p>
              Model:{" "}
              <strong>
                {data.modelName ??
                  "Unknown"}
              </strong>
            </p>
          </div>

          <div className="filter-buttons" role="group" aria-label="Filter classifications">
            <button
              type="button"
              className={
                filter === "all"
                  ? "button button-primary"
                  : "button button-secondary"
              }
              aria-pressed={filter === "all"}
              onClick={() =>
                setFilter(
                  "all"
                )
              }
            >
              All
            </button>

            <button
              type="button"
              className={
                filter === "hazard"
                  ? "button button-primary"
                  : "button button-secondary"
              }
              aria-pressed={filter === "hazard"}
              onClick={() =>
                setFilter(
                  "hazard"
                )
              }
            >
              Hazard
            </button>

            <button
              type="button"
              className={
                filter === "not-hazard"
                  ? "button button-primary"
                  : "button button-secondary"
              }
              aria-pressed={filter === "not-hazard"}
              onClick={() =>
                setFilter(
                  "not-hazard"
                )
              }
            >
              Not Hazard
            </button>

            <button
              type="button"
              className={
                filter === "low-confidence"
                  ? "button button-primary"
                  : "button button-secondary"
              }
              aria-pressed={filter === "low-confidence"}
              onClick={() =>
                setFilter(
                  "low-confidence"
                )
              }
            >
              Low Confidence (&lt;70%)
            </button>
          </div>
        </div>

        <p className="ai-results-count" role="status">
          Showing {filteredResults.length} of {data.results.length} classifications
        </p>

        {data.results.length === 0 ? (
          <div className="empty-state">
            <Brain
              size={42}
            />

            <h3>
              No AI classifications yet
            </h3>

            <p>
              Run AI classification from the
              requirements page first.
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="empty-state" role="status">
            <ShieldCheck size={36} aria-hidden="true" />
            <h3>No matching classifications</h3>
            <p>There are no results for this filter.</p>
            <button type="button" className="button button-secondary" onClick={() => setFilter("all")}>
              Show all results
            </button>
          </div>
        ) : (
          <div className="requirements-list">
            {filteredResults.map(
              (
                result
              ) => (
                <AiResultCard
                  key={
                    result.requirementId
                  }
                  result={
                    result
                  }
                  index={
                    data.results.findIndex(item => item.requirementId === result.requirementId)
                  }
                  formatConfidence={
                    formatConfidence
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {data.results.length > 0 && (
        <div className="analysis-action-card">
          <div>
            <CheckCircle2
              size={28}
            />

            <div>
              <h2>
                Compare Human and AI Classifications
              </h2>

              <p>
                Review the results above. When
                ready, proceed to the comparative
                analysis between the human and AI
                classifications.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={
              handleRunAnalysis
            }
          >
            Run Comparative Analysis
          </button>
        </div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value:
    | number
    | string;
}

function SummaryCard({
  icon,
  label,
  value
}: SummaryCardProps) {
  return (
    <div className="stat-card ai-summary-card">
      <div className="summary-icon">
        {icon}
      </div>

      <div>
        <div className="stat-label">
          {label}
        </div>

        <div className="stat-value">
          {value}
        </div>
      </div>
    </div>
  );
}

interface AiResultCardProps {
  result: AiClassificationDetails;
  index: number;

  formatConfidence: (
    value?: number | null
  ) => string;
}

function AiResultCard({
  result,
  index,
  formatConfidence
}: AiResultCardProps) {
  return (
    <div className="requirement-list-card ai-result-card">
      <div className="requirement-list-header">
        <div>
          <span className="requirement-sequence">
            Requirement{" "}
            {index + 1}
          </span>

          <h3>
            {result.requirementNumber ??
              "Requirement"}
          </h3>
        </div>

        <span
          className={
            result.isHazard
              ? "classification-badge ai-badge-hazard"
              : "classification-badge ai-badge-safe"
          }
        >
          {result.isHazard
            ? "Hazard"
            : "Not Hazard"}
        </span>
      </div>

      <div className="requirement-text-box">
        {result.requirementText}
      </div>

      <div className="ai-result-details">
        <div className="ai-detail-item">
          <span className="detail-label">
            AI Classification
          </span>

          <strong>
            {result.isHazard
              ? "Hazard"
              : "Not Hazard"}
          </strong>
        </div>

        <div className="ai-detail-item">
          <span className="detail-label">
            Confidence
          </span>

          <strong>
            {formatConfidence(
              result.confidence
            )}
          </strong>
        </div>

        <div className="ai-detail-item">
          <span className="detail-label">
            Model
          </span>

          <strong>
            {result.modelName ??
              "Unknown"}
          </strong>
        </div>
      </div>

      <div className="ai-explanation">
        <span className="detail-label">
          <Sparkles size={15} aria-hidden="true" /> AI Explanation
        </span>

        <p>
          {result.explanation ??
            "No explanation was provided."}
        </p>
      </div>
    </div>
  );
}
