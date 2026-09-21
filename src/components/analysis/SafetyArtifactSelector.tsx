import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";

import type {
    AnalysisType,
} from "../../types/analysis";

import type {SelectChangeEvent} from "@mui/material/Select";

interface Props {
    value: AnalysisType;

    onChange: (
        value: AnalysisType
    ) => void;
}

export default function SafetyArtifactSelector({
    value,
    onChange,
}: Props) {

    return (
        <FormControl fullWidth>

            <InputLabel>
                Safety Artifact
            </InputLabel>

            <Select
                value={value}
                label="Safety Artifact"
                onChange={(event: SelectChangeEvent<AnalysisType>) => {
                    onChange(event.target.value);
                }}
            >

                <MenuItem value="Requirements">
                    Software Requirements
                </MenuItem>

                <MenuItem value="Architecture">
                    System Architecture
                </MenuItem>

                <MenuItem value="HazardLog">
                    Hazard Log
                </MenuItem>

                <MenuItem value="FailureModes">
                    Failure Modes
                </MenuItem>

                <MenuItem value="SafetyConstraints">
                    Safety Constraints
                </MenuItem>

                <MenuItem value="SafetyCase">
                    Safety Case
                </MenuItem>

                <MenuItem value="IncidentReports">
                    Incident Reports
                </MenuItem>

            </Select>

        </FormControl>
    );
}