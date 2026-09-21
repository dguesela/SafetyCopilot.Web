import type {
  Requirement,
} from "../../types/requirement";


interface RequirementCardProps {
  requirement: Requirement;

  onEdit: (
    requirement: Requirement
  ) => void;

  onDelete: (
    requirement: Requirement
  ) => void;
}


export default function RequirementCard({
  requirement,
  onEdit,
  onDelete,
}: RequirementCardProps) {

  return (
    <div className="requirement-card">

      <div className="requirement-card-header">

        <div>

          <div className="requirement-id">
            {requirement.requirementId}
          </div>

          <h3>
            {requirement.title}
          </h3>

        </div>


        <span
          className={`requirement-status status-${requirement.status.toLowerCase()}`}
        >
          {requirement.status}
        </span>

      </div>


      <p className="requirement-description">
        {requirement.description}
      </p>


      <div className="requirement-meta">

        <div>
          <span className="meta-label">
            Type
          </span>

          <span>
            {requirement.requirementType}
          </span>
        </div>


        <div>
          <span className="meta-label">
            Priority
          </span>

          <span>
            {requirement.priority}
          </span>
        </div>


        {requirement.source && (
          <div>
            <span className="meta-label">
              Source
            </span>

            <span>
              {requirement.source}
            </span>
          </div>
        )}

      </div>


      <div className="requirement-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            onEdit(requirement)
          }
        >
          Edit
        </button>


        <button
          type="button"
          className="danger-button"
          onClick={() =>
            onDelete(requirement)
          }
        >
          Delete
        </button>

      </div>

    </div>
  );
}