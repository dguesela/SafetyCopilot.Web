import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";


import {
  extractRequirements,
  getProjectDocuments,
} from "../api/documentApi";

import {
  getProject,
} from "../api/projectApi";

import {
  classifyRequirement,
  getClassificationProgress,
  getProjectRequirements,
  runAiClassification,
} from "../api/requirementApi";

import {
  useAuth,
} from "../contexts/AuthContext";

import { getAiClassificationResults } from "../api/aiClassificationApi";

import type {
  RequirementDocument,
} from "../types/document";

import type {
  Project,
} from "../types/project";

import type {
  ClassificationProgress,
  Requirement,
} from "../types/requirement";

export default function RequirementsPage() {
  const {
    projectId,
  } = useParams<{
    projectId: string;
  }>();

  const {
    user,
  } = useAuth();

  const [
    project,
    setProject,
  ] =
    useState<Project | null>(
      null
    );

  const [
    documents,
    setDocuments,
  ] =
    useState<
      RequirementDocument[]
    >([]);

  const [
    requirements,
    setRequirements,
  ] =
    useState<Requirement[]>(
      []
    );

  const [
    progress,
    setProgress,
  ] =
    useState<
      ClassificationProgress | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    extracting,
    setExtracting,
  ] =
    useState(false);

  const [
    savingId,
    setSavingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    runningAi,
    setRunningAi,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null
    );

  const navigate = useNavigate();

  const [randomizing, setRandomizing] = useState(false);
  const [aiTracking, setAiTracking] = useState<{
    projectId: string;
    userId: string;
    requirementIds: string[];
    previousTimestamps: Map<string, string>;
  } | null>(null);
  const [aiCompletedCount, setAiCompletedCount] = useState(0);
  const [aiProgressUnavailable, setAiProgressUnavailable] = useState(false);
  const aiTotalCount = aiTracking?.requirementIds.length ?? requirements.length;
  const aiPercent = aiTotalCount > 0
    ? Math.floor((aiCompletedCount / aiTotalCount) * 100)
    : 0;

  useEffect(() => {
    if (!runningAi || !aiTracking || aiTracking.projectId !== projectId) {
      return;
    }

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const tracking = aiTracking;

    async function pollProgress() {
      try {
        const snapshot = await getAiClassificationResults(
          tracking.projectId,
          tracking.userId,
          { signal: controller.signal, timeout: 10000 }
        );
        if (controller.signal.aborted) return;

        // Count only new or updated results for this run's requirements.
        const updatedIds = new Set(snapshot.results
          .filter(result => result.classifiedAtUtc &&
            result.classifiedAtUtc !== tracking.previousTimestamps.get(result.requirementId))
          .map(result => result.requirementId));
        const completed = tracking.requirementIds.filter(id => updatedIds.has(id)).length;
        setAiCompletedCount(current => Math.max(current, completed));
        setAiProgressUnavailable(false);
      } catch {
        if (!controller.signal.aborted) setAiProgressUnavailable(true);
      } finally {
        if (!controller.signal.aborted) {
          timer = setTimeout(pollProgress, 3000);
        }
      }
    }

    timer = setTimeout(pollProgress, 3000);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [runningAi, aiTracking, projectId]);

  useEffect(
    () => {
      if (
        !projectId ||
        !user
      ) {
        return;
      }

      void loadData();
    },
    [
      projectId,
      user,
    ]
  );

  async function loadData() {
    if (
      !projectId ||
      !user
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        projectData,
        documentsData,
        requirementsData,
        progressData,
      ] =
        await Promise.all([
          getProject(
            projectId
          ),

          getProjectDocuments(
            projectId
          ),

          getProjectRequirements(
            projectId
          ),

          getClassificationProgress(
            projectId,
            user.id
          ),
        ]);

      setProject(
        projectData
      );

      setDocuments(
        documentsData
      );

      setRequirements(
        [...requirementsData]
          .sort(
            (
              a,
              b
            ) =>
              a.sequenceNumber -
              b.sequenceNumber
          )
      );

      setProgress(
        progressData
      );
    } catch (
      err: any
    ) {
      console.error(
        "Load requirements error:",
        err
      );

      console.error(
        "Server response:",
        err?.response?.data
      );

      setError(
        getErrorMessage(
          err,
          "Unable to load the project requirements."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleExtractRequirements(
    documentId: string
  ) {
    try {
      setExtracting(true);
      setError(null);
      setMessage(null);

      const result =
        await extractRequirements(
          documentId
        );

      setMessage(
        `${result.extractedRequirementCount} ` +
          `requirement(s) were extracted ` +
          `from ${result.fileName}.`
      );

      /*
       * Reload documents, requirements
       * and progress. The newly created
       * tblRequirement records should
       * now appear on this page.
       */
      await loadData();
    } catch (
      err: any
    ) {
      console.error(
        "Extract requirements error:",
        err
      );

      console.error(
        "Server response:",
        err?.response?.data
      );

      setError(
        getErrorMessage(
          err,
          "Unable to extract requirements from the document."
        )
      );
    } finally {
      setExtracting(false);
    }
  }

  async function handleClassification(
    requirementId: string,
    isHazard: boolean
  ) {
    if (
      !user ||
      !projectId
    ) {
      return;
    }

    try {
      setSavingId(
        requirementId
      );

      setError(null);
      setMessage(null);

      const result =
        await classifyRequirement(
          requirementId,
          {
            userId:
              user.id,

            isHazard,
          }
        );

      setRequirements(
        (current) =>
          current.map(
            (
              requirement
            ) =>
              requirement.id ===
              requirementId
                ? {
                    ...requirement,

                    humanIsHazard:
                      result.isHazard,

                    humanClassifiedAtUtc:
                      result.classifiedAtUtc,
                  }
                : requirement
          )
      );

      const updatedProgress =
        await getClassificationProgress(
          projectId,
          user.id
        );

      setProgress(
        updatedProgress
      );
    } catch (
      err: any
    ) {
      console.error(
        "Classification error:",
        err
      );

      console.error(
        "Server response:",
        err?.response?.data
      );

      setError(
        getErrorMessage(
          err,
          "Unable to save the human classification."
        )
      );
    } finally {
      setSavingId(null);
    }
  }

  async function handleRandomizeClassifications() {
    if (!user || !projectId || randomizing || savingId || runningAi) {
      return;
    }

    setRandomizing(true);
    setError(null);
    setMessage(null);

    let savedCount = 0;
    let failedCount = 0;

    try {
      for (const requirement of requirements) {
        try {
          const result = await classifyRequirement(requirement.id, {
            userId: user.id,
            isHazard: Math.random() < 0.5,
          });

          setRequirements((current) =>
            current.map((item) =>
              item.id === requirement.id
                ? {
                    ...item,
                    humanIsHazard: result.isHazard,
                    humanClassifiedAtUtc: result.classifiedAtUtc,
                  }
                : item
            )
          );
          savedCount += 1;
        } catch {
          failedCount += 1;
        }
      }

      if (failedCount > 0) {
        setError(
          `Random classifications saved for ${savedCount} requirement(s). ` +
            `${failedCount} requirement(s) could not be saved. Please try again.`
        );
      } else {
        setMessage(`Random classifications saved for all ${savedCount} requirement(s).`);
      }

      setProgress(await getClassificationProgress(projectId, user.id));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Classifications were processed, but progress could not be refreshed. Please reload the page."));
    } finally {
      setRandomizing(false);
    }
  }

  async function handleRunAi() {
    if (runningAi || randomizing || savingId !== null) return;
    if (
      !projectId ||
      !user
    ) {
      return;
    }

    if (
      !progress?.isComplete
    ) {
      setError(
        "Complete the human classification phase before running AI classification."
      );

      return;
    }

    try {
      setRunningAi(true);
      setError(null);
      setMessage(null);
      setAiTracking(null);
      setAiCompletedCount(0);
      setAiProgressUnavailable(false);

      try {
        const existing = await getAiClassificationResults(projectId, user.id, { timeout: 10000 });
        setAiTracking({
          projectId,
          userId: user.id,
          requirementIds: requirements.map(requirement => requirement.id),
          previousTimestamps: new Map(existing.results.map(result => [result.requirementId, result.classifiedAtUtc])),
        });
      } catch {
        // Classification can still run if the results endpoint is unavailable.
        setAiProgressUnavailable(true);
      }

      const result =
        await runAiClassification(
          projectId,
          user.id
        );

      setMessage(
        `AI classification completed for ` +
          `${result.classifiedRequirements} ` +
          `requirement(s) using ` +
          `${result.modelName}.`
      );

      navigate(
      `/projects/${projectId}/ai-results`
      );

      await loadData();
    } catch (
      err: any
    ) {
      console.error(
        "AI classification error:",
        err
      );

      console.error(
        "Server response:",
        err?.response?.data
      );

      setError(
        getErrorMessage(
          err,
          "Unable to run AI classification."
        )
      );
    } finally {
      setRunningAi(
        false
      );
      setAiTracking(null);
    }
  }

  const hazardCount =
    useMemo(
      () =>
        requirements.filter(
          (
            requirement
          ) =>
            requirement.humanIsHazard ===
            true
        ).length,
      [
        requirements,
      ]
    );

  const nonHazardCount =
    useMemo(
      () =>
        requirements.filter(
          (
            requirement
          ) =>
            requirement.humanIsHazard ===
            false
        ).length,
      [
        requirements,
      ]
    );

  const hasAiResults =
    useMemo(
      () =>
        requirements.some(
          (
            requirement
          ) =>
            requirement
              .hasAiClassification
        ),
      [
        requirements,
      ]
    );

  if (loading) {
    return (
      <div className="page-container">
        <div className="projects-loading">
          Loading requirements...
        </div>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          Project ID was not found.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* ======================================
          Header
          ====================================== */}

      <div className="page-header">
        <div>
          <h1>
            Human Hazard Classification
          </h1>

          <p className="page-subtitle">
            {project?.name ??
              "Requirements Classification"}
          </p>
        </div>

        <div
          style={{
            display:
              "flex",
            gap:
              "10px",
            flexWrap:
              "wrap",
          }}
        >
          <Link
            to={`/projects/${projectId}/ai-results`}
            className="button button-secondary"
          >
            View AI Results
          </Link>

          <Link
            to={`/projects/${projectId}/upload`}
            className="button button-secondary"
          >
            Upload PDF
          </Link>

          <Link
            to={`/projects/${projectId}`}
            className="button button-secondary"
          >
            Back to Project
          </Link>
        </div>
      </div>

      {/* ======================================
          Alerts
          ====================================== */}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {/* ======================================
          No document uploaded
          ====================================== */}

      {documents.length ===
      0 ? (
        <div className="empty-projects">
          <div className="empty-icon">
            PDF
          </div>

          <h2>
            No requirements document uploaded
          </h2>

          <p>
            Upload a PDF requirements
            document before beginning
            human hazard classification.
          </p>

          <Link
            to={`/projects/${projectId}/upload`}
            className="button button-primary"
          >
            Upload PDF
          </Link>
        </div>
      ) : null}

      {documents.some(document => document.requirementCount === 0) && (
        /* ==================================
           Documents exist, but no
           requirements have been extracted
           ================================== */

        <div>
          <div className="research-protocol-banner">
            <strong>
              Requirement Extraction
            </strong>

            <p>
              One or more requirements
              documents have been uploaded.
              Extract the individual
              requirements before beginning
              human hazard classification.
            </p>
          </div>

          <div
            className="requirements-list"
          >
            {documents.filter(document => document.requirementCount === 0).map(
              (
                document
              ) => (
                <div
                  key={
                    document.id
                  }
                  className="requirement-list-card"
                >
                  <div className="requirement-list-header">
                    <div>
                      <span className="requirement-sequence">
                        Requirements Document
                      </span>

                      <h3>
                        {
                          document.fileName
                        }
                      </h3>
                    </div>

                    <span className="classification-badge">
                      {
                        document.requirementCount
                      }{" "}
                      Requirements
                    </span>
                  </div>

                  <div className="requirement-text-box">
                    <div>
                      <strong>
                        File size:
                      </strong>{" "}
                      {formatFileSize(
                        document.fileSizeBytes
                      )}
                    </div>

                    <div
                      style={{
                        marginTop:
                          "6px",
                      }}
                    >
                      <strong>
                        Uploaded:
                      </strong>{" "}
                      {formatDate(
                        document.uploadedAtUtc
                      )}
                    </div>

                    <div
                      style={{
                        marginTop:
                          "6px",
                      }}
                    >
                      <strong>
                        Processing status:
                      </strong>{" "}
                      {document.processedAtUtc
                        ? "Processed"
                        : "Awaiting extraction"}
                    </div>
                  </div>

                  <div
                    className="classification-buttons"
                    style={{
                      marginTop:
                        "16px",
                    }}
                  >
                    <button
                      type="button"
                      className="button button-primary"
                      disabled={
                        extracting || savingId !== null || randomizing || runningAi
                      }
                      onClick={() =>
                        handleExtractRequirements(
                          document.id
                        )
                      }
                    >
                      {extracting
                        ? "Extracting Requirements..."
                        : "Extract Requirements"}
                    </button>

                    <a
                      href={
                        `https://localhost:7014/api/documents/` +
                        `${document.id}/pdf`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="button button-secondary"
                    >
                      View PDF
                    </a>
                  </div>
                </div>
              )
            )}
          </div>

          <div
            style={{
              display:
                "flex",
              gap:
                "10px",
              flexWrap:
                "wrap",
              marginTop:
                "20px",
            }}
          >
            <Link
              to={`/projects/${projectId}/upload`}
              className="button button-secondary"
            >
              Upload Another PDF
            </Link>

            <Link
              to={`/projects/${projectId}`}
              className="button button-secondary"
            >
              Back to Project
            </Link>
          </div>
        </div>
      )}

      {requirements.length > 0 && (
        <>
          {/* ==================================
              Progress
              ================================== */}

          <div className="classification-progress-card">
            <div className="classification-progress-header">
              <div>
                <span className="classification-progress-label">
                  Human Classification
                  Progress
                </span>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop:
                      "4px",
                  }}
                >
                  {progress
                    ?.classifiedRequirements ??
                    0}
                  {" of "}
                  {progress
                    ?.totalRequirements ??
                    requirements.length}
                  {" requirements classified"}
                </strong>
              </div>

              <span className="classification-progress-percentage">
                {progress
                  ?.percentComplete ??
                  0}
                %
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-value"
                style={{
                  width:
                    `${
                      progress
                        ?.percentComplete ??
                      0
                    }%`,
                }}
              />
            </div>
          </div>

          {/* ==================================
              Summary
              ================================== */}

          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-label">
                Requirements
              </span>

              <span className="stat-value">
                {
                  requirements.length
                }
              </span>

              <span className="stat-description">
                Extracted from PDF
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Hazard
              </span>

              <span className="stat-value">
                {hazardCount}
              </span>

              <span className="stat-description">
                Human classified
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Not Hazard
              </span>

              <span className="stat-value">
                {nonHazardCount}
              </span>

              <span className="stat-description">
                Human classified
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Remaining
              </span>

              <span className="stat-value">
                {progress
                  ?.remainingRequirements ??
                  requirements.length}
              </span>

              <span className="stat-description">
                Need classification
              </span>
            </div>
          </div>

          {/* ==================================
              Human protocol
              ================================== */}

          <div className="research-protocol-banner">
            <strong>
              Human Classification Phase
            </strong>

            <p>
              Review every extracted
              requirement and independently
              classify it as Hazard or Not
              Hazard. AI classifications
              remain hidden during this
              phase.
            </p>

            {/* <button
              type="button"
              className="button button-secondary"
              disabled={randomizing || savingId !== null || runningAi || !user}
              onClick={handleRandomizeClassifications}
            >
              {randomizing ? "Randomizing Classifications..." : "Randomize All (Debug)"}
            </button>
            <p>
              Randomly assigns and saves Hazard or Not Hazard for every requirement,
              replacing existing classifications.
            </p> */}
          </div>

          {/* ==================================
              Requirement list
              ================================== */}

          <div className="requirements-list">
            {requirements.map(
              (
                requirement,
                index
              ) => {
                const isSaving =
                  savingId ===
                  requirement.id;

                return (
                  <div
                    key={
                      requirement.id
                    }
                    className="requirement-list-card"
                  >
                    <div className="requirement-list-header">
                      <div>
                        <span className="requirement-sequence">
                          Requirement{" "}
                          {index +
                            1}
                        </span>

                        <h3>
                          {requirement
                            .requirementNumber ??
                            `REQ-${String(
                              index +
                                1
                            ).padStart(
                              3,
                              "0"
                            )}`}
                        </h3>
                        <p className="page-subtitle">
                          Source: {documents.find(document => document.id === requirement.documentId)?.fileName ?? "Unknown document"}
                        </p>
                      </div>

                      {requirement
                        .humanIsHazard ===
                        true && (
                        <span className="classification-badge classification-hazard">
                          Hazard
                        </span>
                      )}

                      {requirement
                        .humanIsHazard ===
                        false && (
                        <span className="classification-badge classification-not-hazard">
                          Not Hazard
                        </span>
                      )}

                      {requirement
                        .humanIsHazard ==
                        null && (
                        <span className="classification-badge">
                          Not Classified
                        </span>
                      )}
                    </div>

                    <div className="requirement-text-box">
                      {
                        requirement.requirementText
                      }
                    </div>

                    <div className="classification-question">
                      Does this requirement
                      represent or contribute
                      to a software safety
                      hazard?
                    </div>

                    <div className="classification-buttons">
                      <button
                        type="button"
                        className={
                          `classification-choice classification-choice-hazard ${
                            requirement.humanIsHazard ===
                            true
                              ? "classification-choice-selected"
                              : ""
                          }`
                        }
                        disabled={
                          savingId !== null || randomizing || runningAi
                        }
                        onClick={() =>
                          handleClassification(
                            requirement.id,
                            true
                          )
                        }
                      >
                        Hazard
                      </button>

                      <button
                        type="button"
                        className={
                          `classification-choice classification-choice-safe ${
                            requirement.humanIsHazard ===
                            false
                              ? "classification-choice-selected"
                              : ""
                          }`
                        }
                        disabled={
                          savingId !== null || randomizing || runningAi
                        }
                        onClick={() =>
                          handleClassification(
                            requirement.id,
                            false
                          )
                        }
                      >
                        Not Hazard
                      </button>
                    </div>

                    {isSaving && (
                      <div className="classification-saving">
                        Saving
                        classification...
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* ==================================
              AI Phase
              ================================== */}

          <div
            className={
              progress?.isComplete
                ? "ai-phase-card ai-ready"
                : "ai-phase-card ai-locked"
            }
          >
            <div className="ai-phase-header">
              <div>
                <span className="phase-label">
                  Phase 2
                </span>

                <h2>
                  AI Hazard Classification
                </h2>
              </div>
            </div>

            {!progress
              ?.isComplete ? (
              <>
                <p>
                  AI classification remains
                  locked until every
                  extracted requirement has
                  been classified by the
                  human participant.
                </p>

                <strong>
                  {progress
                    ?.remainingRequirements ??
                    0}{" "}
                  requirement(s)
                  remaining.
                </strong>
              </>
            ) : (
              <>
                <p>
                  Human classification is
                  complete. The AI can now
                  independently classify
                  the same requirements.
                </p>

                <div className="form-actions">
                  <button
                    type="button"
                    className="button button-primary"
                    disabled={
                      runningAi || randomizing || savingId !== null
                    }
                    onClick={
                      handleRunAi
                    }
                  >
                    {runningAi
                      ? "Running AI Classification..."
                      : hasAiResults
                        ? "Run AI Classification Again"
                        : "Run AI Classification"}
                  </button>

                  {hasAiResults && (
                    <Link
                      to={`/projects/${projectId}/analysis`}
                      className="button button-secondary"
                    >
                      View Comparison
                    </Link>
                  )}
                </div>
                {runningAi && (
                  <div className="classification-progress-card" style={{ marginTop: "20px" }}>
                    <div className="classification-progress-header">
                      <div>
                        <span className="classification-progress-label">AI Classification Progress</span>
                        <div role="status" style={{ marginTop: "6px" }}>
                          {aiTracking
                            ? `${aiCompletedCount} of ${aiTotalCount} requirements classified${aiProgressUnavailable ? " (last confirmed)" : ""}`
                            : aiProgressUnavailable
                              ? "AI classification is running. Live progress is unavailable."
                              : "Preparing AI classification..."}
                        </div>
                      </div>
                      {aiTracking && <strong className="classification-progress-percentage">{aiPercent}%</strong>}
                    </div>
                    {aiTracking && (
                      <div
                        className="progress-track"
                        role="progressbar"
                        aria-label="AI classification progress"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={aiPercent}
                        aria-valuetext={`${aiCompletedCount} of ${aiTotalCount} requirements classified`}
                      >
                        <div className="progress-value" style={{ width: `${aiPercent}%` }} />
                      </div>
                    )}
                    {aiTracking && aiProgressUnavailable && (
                      <p>Progress updates are temporarily unavailable. Retrying automatically.</p>
                    )}
                    {aiTracking && !aiProgressUnavailable && (
                      <p>{aiPercent === 100
                        ? "All results are saved. Finishing classification..."
                        : "Checking for saved classifications every few seconds. Results will open when classification finishes."}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function formatFileSize(
  bytes: number
): string {
  if (bytes < 1024) {
    return `${bytes} bytes`;
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

function formatDate(
  value: string
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleString(
    undefined,
    {
      year:
        "numeric",
      month:
        "short",
      day:
        "numeric",
      hour:
        "numeric",
      minute:
        "2-digit",
    }
  );
}

function getErrorMessage(
  error: any,
  fallback: string
): string {
  const data =
    error?.response?.data;

  if (
    typeof data ===
    "string"
  ) {
    return data;
  }

  if (
    data?.message
  ) {
    return data.message;
  }

  if (
    data?.title
  ) {
    return data.title;
  }

  return fallback;
}
