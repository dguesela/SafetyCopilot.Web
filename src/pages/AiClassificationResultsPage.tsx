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
      loadResults();
    },
    [
      projectId
    ]
  );

  async function loadResults() {
    if (!projectId) {
      setError(
        "Project ID was not provided."
      );

      setLoading(false);

      return;
    }

    /*
     * Change this key if your application
     * stores the user ID under another name.
     */
    const userId =
      localStorage.getItem(
        "userId"
      );

    if (!userId) {
      setError(
        "The current user could not be identified."
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result =
        await getAiClassificationResults(
          projectId,
          userId
        );

      setData(
        result
      );
    } catch (err: any) {
      console.error(
        err
      );

      const message =
        err?.response?.data?.message ??
        "Unable to load AI classification results.";

      setError(
        message
      );
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-card">
          Loading AI classification results...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-card">
          <h2>
            Unable to load AI results
          </h2>

          <p>
            {error}
          </p>

          {projectId && (
            <Link
              to={`/projects/${projectId}/requirements`}
              className="btn btn-secondary"
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
    <div className="page-container">
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

      <div className="summary-grid">
        <SummaryCard
          icon={
            <Brain
              size={22}
            />
          }
          label="AI Classified"
          value={
            data.totalRequirements
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

      <div className="page-card">
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

          <div className="filter-buttons">
            <button
              type="button"
              className={
                filter === "all"
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
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
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
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
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
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
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
              onClick={() =>
                setFilter(
                  "low-confidence"
                )
              }
            >
              Low Confidence
            </button>
          </div>
        </div>

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
        ) : (
          <div className="ai-results-list">
            {filteredResults.map(
              (
                result,
                index
              ) => (
                <AiResultCard
                  key={
                    result.requirementId
                  }
                  result={
                    result
                  }
                  index={
                    index
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
                AI Classification Complete
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
            className="btn btn-primary"
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
    <div className="summary-card">
      <div className="summary-icon">
        {icon}
      </div>

      <div>
        <div className="summary-label">
          {label}
        </div>

        <div className="summary-value">
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
    <div className="ai-result-card">
      <div className="ai-result-header">
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
              ? "classification-badge hazard"
              : "classification-badge not-hazard"
          }
        >
          {result.isHazard
            ? "Hazard"
            : "Not Hazard"}
        </span>
      </div>

      <div className="ai-result-requirement">
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
          AI Explanation
        </span>

        <p>
          {result.explanation ??
            "No explanation was provided."}
        </p>
      </div>
    </div>
  );
}