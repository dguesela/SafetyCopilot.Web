import {
    TextField,
    Typography,
    Box,
} from "@mui/material";

interface Props {
    value: string;

    onChange: (
        value: string
    ) => void;
}

export default function AnalysisInput({
    value,
    onChange,
}: Props) {

    return (
        <Box>

            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 600,
                    mb: 1,
                }}
            >
                Safety Artifact Content
            </Typography>

            <TextField
                fullWidth
                multiline
                minRows={14}
                maxRows={25}
                placeholder={
                    "Paste software requirements, architecture description, hazard information, failure modes, safety constraints, or incident information here..."
                }
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
            />

            <Typography
                variant="caption"
                color="text.secondary"
            >
                The AI analyzes the provided artifact
                and proposes potential safety issues.
            </Typography>

        </Box>
    );
}