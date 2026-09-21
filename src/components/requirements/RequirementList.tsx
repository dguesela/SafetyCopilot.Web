import RequirementCard
  from "./RequirementCard";

import type {
  Requirement,
} from "../../types/requirement";


interface RequirementListProps {
  requirements: Requirement[];

  onEdit: (
    requirement: Requirement
  ) => void;

  onDelete: (
    requirement: Requirement
  ) => void;
}


export default function RequirementList({
  requirements,
  onEdit,
  onDelete,
}: RequirementListProps) {

  if (requirements.length === 0) {

    return (
      <div className="card empty-state">

        <h3>
          No requirements yet
        </h3>

        <p>
          Add the first software or safety
          requirement for this project.
        </p>

      </div>
    );
  }


  return (
    <div className="requirements-list">

      {requirements.map(
        requirement => (

          <RequirementCard
            key={requirement.id}
            requirement={requirement}
            onEdit={onEdit}
            onDelete={onDelete}
          />

        )
      )}

    </div>
  );
}