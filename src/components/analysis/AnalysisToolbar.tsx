import {
    Box,
    Button,
    FormControlLabel,
    Switch,
} from "@mui/material";

import PlayArrowIcon
    from "@mui/icons-material/PlayArrow";

interface Props {

    includeExplanations: boolean;

    includeUncertainty: boolean;

    running: boolean;

    onExplanationsChange: (
        value: boolean
    ) => void;

    onUncertaintyChange: (
        value: boolean
    ) => void;

    onRun: () => void;
}

export default function AnalysisToolbar({
    includeExplanations,
    includeUncertainty,
    running,
    onExplanationsChange,
    onUncertaintyChange,
    onRun,
}: Props) {

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexWrap: "wrap",
                mt: 3,
            }}
        >

            <FormControlLabel
                control={
                    <Switch
                        checked={
                            includeExplanations
                        }
                        onChange={(event) =>
                            onExplanationsChange(
                                event.target.checked
                            )
                        }
                    />
                }
                label="Explanations"
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={
                            includeUncertainty
                        }
                        onChange={(event) =>
                            onUncertaintyChange(
                                event.target.checked
                            )
                        }
                    />
                }
                label="Uncertainty"
            />

            <Button
                variant="contained"
                size="large"
                startIcon={
                    <PlayArrowIcon />
                }
                disabled={running}
                onClick={onRun}
            >
                {running
                    ? "Analyzing..."
                    : "Run Safety Analysis"}
            </Button>

        </Box>
    );
}