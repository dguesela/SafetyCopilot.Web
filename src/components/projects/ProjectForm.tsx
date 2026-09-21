import {
  useState,
} from "react";

import type { FormEvent } from "react";

interface ProjectFormProps {
  onSubmit: (
    name: string,
    description: string
  ) => Promise<void>;

  onCancel: () => void;
}

export default function ProjectForm({
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError(
        "Project name is required."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit(
        name.trim(),
        description.trim()
      );
    } catch (err: any) {
      console.error(
        "Create project error:",
        err
      );

      console.error(
        "Server response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ??
          err?.response?.data?.title ??
          "Unable to create project."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-project-overlay">
      <div className="create-project-dialog">
        <div className="create-project-header">
          <div className="create-project-heading">
            <div className="create-project-icon">
              P
            </div>

            <div>
              <h2>Create Project</h2>

              <p>
                Create a project for a
                human–AI requirements
                classification study.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="create-project-close"
            onClick={onCancel}
            disabled={submitting}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="create-project-error">
            {error}
          </div>
        )}

        <form
          className="create-project-form"
          onSubmit={handleSubmit}
        >
          <div className="create-project-field">
            <label htmlFor="projectName">
              Project Name
            </label>

            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Example: MCAS Requirements Study"
              maxLength={200}
              autoFocus
              required
            />

            <span className="create-project-help">
              Use a descriptive name for
              the research project.
            </span>
          </div>

          <div className="create-project-field">
            <label htmlFor="projectDescription">
              Description
            </label>

            <textarea
              id="projectDescription"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe the project and its requirements analysis objective."
              maxLength={2000}
            />
          </div>

          <div className="create-project-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={
                submitting ||
                !name.trim()
              }
            >
              {submitting
                ? "Creating..."
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}