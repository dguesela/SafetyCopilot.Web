import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  createProject,
  deleteProject,
  getProjects,
} from "../api/projectApi";

import ProjectForm from "../components/projects/ProjectForm";

import {
  useAuth,
} from "../contexts/AuthContext";

import type {
  Project,
} from "../types/project";

export default function ProjectsPage() {
  const {
    user,
  } = useAuth();

  const [
    projects,
    setProjects,
  ] = useState<Project[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    showCreateProject,
    setShowCreateProject,
  ] = useState(false);

  useEffect(
    () => {
      if (!user) {
        return;
      }

      loadProjects();
    },
    [user]
  );

  async function loadProjects() {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        await getProjects(
          user.id
        );

      setProjects(data);
    } catch (err: any) {
      console.error(
        "Load projects error:",
        err
      );

      console.error(
        "Server response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ??
          err?.response?.data?.title ??
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(
    name: string,
    description: string
  ) {
    if (!user) {
      throw new Error(
        "No logged-in user was found."
      );
    }

    console.log(
      "Creating project for user:",
      user.id
    );

    const createdProject =
      await createProject({
        userId: user.id,
        name,
        description:
          description.trim() ||
          null,
      });

    setProjects(
      (current) => [
        createdProject,
        ...current,
      ]
    );

    setShowCreateProject(false);
  }

  async function handleDeleteProject(
    project: Project
  ) {
    const confirmed =
      window.confirm(
        `Delete "${project.name}"?\n\n` +
          "This will also delete its uploaded requirement documents, " +
          "requirements, human classifications, and AI classifications."
      );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteProject(
        project.id
      );

      setProjects(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              project.id
          )
      );
    } catch (err: any) {
      console.error(
        "Delete project error:",
        err
      );

      console.error(
        "Server response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ??
          err?.response?.data?.title ??
          "Unable to delete project."
      );
    }
  }

  function formatDate(
    value: string
  ) {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          No logged-in user was found.
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>

          <p>
            Create and manage
            requirement classification
            studies.
          </p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={() =>
            setShowCreateProject(
              true
            )
          }
        >
          + Create Project
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="projects-loading">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-projects">
          <div className="empty-icon">
            P
          </div>

          <h2>
            No projects yet
          </h2>

          <p>
            Create your first research
            project, upload a software
            requirements PDF, and begin
            the human hazard
            classification phase.
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={() =>
              setShowCreateProject(
                true
              )
            }
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(
            (project) => (
              <div
                key={project.id}
                className="project-card"
              >
                <div className="project-card-header">
                  <div className="project-icon">
                    P
                  </div>

                  <span className="project-date">
                    {formatDate(
                      project.createdAtUtc
                    )}
                  </span>
                </div>

                <h3>
                  {project.name}
                </h3>

                <p>
                  {project.description ||
                    "No project description."}
                </p>

                <div className="project-card-metrics">
                  <div className="project-card-metric">
                    <strong>
                      {
                        project.documentCount
                      }
                    </strong>

                    <span>
                      Documents
                    </span>
                  </div>

                  <div className="project-card-metric">
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

                <div className="project-card-footer">
                  <span className="project-status">
                    Active
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Link
                      to={`/projects/${project.id}`}
                      className="button button-primary"
                    >
                      Open
                    </Link>

                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() =>
                        handleDeleteProject(
                          project
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {showCreateProject && (
        <ProjectForm
          onSubmit={
            handleCreateProject
          }
          onCancel={() =>
            setShowCreateProject(
              false
            )
          }
        />
      )}
    </div>
  );
}