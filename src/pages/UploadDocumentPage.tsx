import {
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent
} from "react";

import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  uploadDocument,
} from "../api/documentApi";

import {
  useAuth,
} from "../contexts/AuthContext";

export default function UploadDocumentPage() {
  const {
    user,
    initializing,
  } = useAuth();

  const {
    projectId,
  } = useParams<{
    projectId: string;
  }>();

  const navigate =
    useNavigate();

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null
  );

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    success,
    setSuccess,
  ] = useState<string | null>(
    null
  );

  if (initializing) {
    return (
      <div className="page-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
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

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    setError(null);
    setSuccess(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isPdf =
      file.type ===
        "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      setSelectedFile(null);

      setError(
        "Please select a PDF file."
      );

      event.target.value = "";

      return;
    }

    setSelectedFile(file);
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!selectedFile) {
      setError(
        "Please select a PDF requirements document."
      );

      return;
    }

    if (!projectId) {
      setError(
        "Project ID is missing."
      );

      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      console.log(
        "Uploading document:",
        {
          projectId,
          fileName:
            selectedFile.name,
          fileType:
            selectedFile.type,
          fileSize:
            selectedFile.size,
        }
      );

      const result =
        await uploadDocument(
          projectId,
          selectedFile
        );

      console.log(
        "Upload result:",
        result
      );

      setSuccess(
        `Successfully uploaded ${result.fileName}. ` +
          `${result.requirementCount} requirement(s) were extracted.`
      );

      /*
       * Return to the human
       * classification page.
       */
      window.setTimeout(
        () => {
          navigate(
            `/projects/${projectId}/requirements`
          );
        },
        800
      );
    } catch (err: any) {
      console.error(
        "Upload PDF error:",
        err
      );

      console.error(
        "Upload server response:",
        err?.response?.data
      );

      const responseData =
        err?.response?.data;

      let message =
        "Unable to upload the PDF document.";

      if (
        typeof responseData ===
        "string"
      ) {
        message = responseData;
      } else if (
        responseData?.message
      ) {
        message =
          responseData.message;
      } else if (
        responseData?.title
      ) {
        message =
          responseData.title;
      } else if (
        responseData?.errors
      ) {
        const validationErrors =
          Object.values(
            responseData.errors
          )
            .flat()
            .join(" ");

        if (validationErrors) {
          message =
            validationErrors;
        }
      }

      setError(message);
    } finally {
      setUploading(false);
    }
  }

  function formatFileSize(
    bytes: number
  ) {
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

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>
            Upload Requirements
            Document
          </h1>

          <p className="page-subtitle">
            Upload a PDF containing
            software requirements. The
            system will extract the
            requirements for human hazard
            classification.
          </p>
        </div>

        <Link
          to={`/projects/${projectId}/requirements`}
          className="button button-secondary"
        >
          Back to Classification
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>
            Requirements PDF
          </h2>

          <p>
            Select the software
            requirements document that
            will be used in the
            experiment.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label
              htmlFor="requirementsPdf"
            >
              PDF Document
            </label>

            <input
              id="requirementsPdf"
              type="file"
              accept=".pdf,application/pdf"
              onChange={
                handleFileChange
              }
              disabled={uploading}
            />

            <small>
              Only PDF documents are
              accepted.
            </small>
          </div>

          {selectedFile && (
            <div
              style={{
                marginBottom:
                  "20px",
                padding: "16px",
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "8px",
                background:
                  "#f9fafb",
              }}
            >
              <strong
                style={{
                  display:
                    "block",
                  color:
                    "#111827",
                  fontSize:
                    "13px",
                }}
              >
                {selectedFile.name}
              </strong>

              <span
                style={{
                  display:
                    "block",
                  marginTop:
                    "4px",
                  color:
                    "#6b7280",
                  fontSize:
                    "11px",
                }}
              >
                {formatFileSize(
                  selectedFile.size
                )}
              </span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={
                uploading ||
                !selectedFile
              }
            >
              {uploading
                ? "Uploading and extracting..."
                : "Upload PDF"}
            </button>

            <Link
              to={`/projects/${projectId}/requirements`}
              className="button button-secondary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="research-protocol-banner">
        <strong>
          Human Classification Protocol
        </strong>

        <p>
          Requirements extracted from
          this document will first be
          classified by the human
          participant. AI classification
          remains unavailable until the
          human classification phase is
          complete.
        </p>
      </div>
    </div>
  );
}