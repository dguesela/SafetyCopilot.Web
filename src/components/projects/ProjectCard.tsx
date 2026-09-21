import { useNavigate } from "react-router-dom";

import type { Project } from "../../types/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const navigate = useNavigate();

  const createdDate =
    new Date(
      project.createdAtUtc
    ).toLocaleDateString();

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-icon">
          P
        </div>

        <div className="project-date">
          {createdDate}
        </div>
      </div>

      <h3>
        {project.name}
      </h3>

      <p>
        {project.description ||
          "No project description provided."}
      </p>

      <div className="project-card-footer">
        <span className="project-status">
          Active
        </span>

        <button
          onClick={() =>
            navigate(
              `/projects/${project.id}`
            )
          }
        >
          Open Project
        </button>
      </div>
    </div>
  );
}