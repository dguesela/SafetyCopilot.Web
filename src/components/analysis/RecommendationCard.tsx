import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import CheckIcon
    from "@mui/icons-material/Check";

import CloseIcon
    from "@mui/icons-material/Close";

import EditIcon
    from "@mui/icons-material/Edit";

import WarningIcon
    from "@mui/icons-material/Warning";

import type {
    Recommendation,
} from "../../types/analysis";

interface Props {

    recommendation: Recommendation;

    onAccept: () => void;

    onReject: () => void;

    onModify: () => void;
}

export default function RecommendationCard({
    recommendation,
    onAccept,
    onReject,
    onModify,
}: Props) {

    const confidence =
        recommendation.confidence !== undefined
            ? Math.round(
                recommendation.confidence * 100
            )
            : undefined;

    return (
        <Card
            sx={{
                mb: 2,

                borderLeft:
                    "5px solid",

                borderLeftColor:
                    recommendation.status ===
                    "Accepted"
                        ? "success.main"
                        : recommendation.status ===
                          "Rejected"
                            ? "error.main"
                            : "warning.main",
            }}
        >

            <CardContent>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        mb: 1,
                    }}
                >

                    <Chip
                        icon={
                            <WarningIcon />
                        }
                        label={
                            recommendation.category
                        }
                        size="small"
                        color="warning"
                    />

                    <Chip
                        label={
                            recommendation.status
                        }
                        size="small"
                    />

                </Stack>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    {recommendation.title}
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                    }}
                >
                    {recommendation.description}
                </Typography>

                {recommendation.rationale && (
                    <Alert
                        severity="info"
                        sx={{
                            mt: 2,
                        }}
                    >
                        <strong>
                            Rationale:
                        </strong>{" "}
                        {recommendation.rationale}
                    </Alert>
                )}

                {recommendation.proposedControl && (
                    <Box sx={{ mt: 2 }}>

                        <Typography
                            variant="subtitle2"
                        >
                            Proposed Safety Control
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            {
                                recommendation.proposedControl
                            }
                        </Typography>

                    </Box>
                )}

                {confidence !== undefined && (
                    <Box sx={{ mt: 2 }}>

                        <Typography
                            variant="subtitle2"
                        >
                            AI Confidence
                        </Typography>

                        <Typography>
                            {confidence}%
                        </Typography>

                    </Box>
                )}

                {recommendation.uncertainty !==
                    undefined && (
                    <Box sx={{ mt: 1 }}>

                        <Typography
                            variant="subtitle2"
                        >
                            Uncertainty
                        </Typography>

                        <Typography>
                            {Math.round(
                                recommendation
                                    .uncertainty *
                                    100
                            )}
                            %
                        </Typography>

                    </Box>
                )}

                <Divider
                    sx={{
                        my: 2,
                    }}
                />

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={
                            <CheckIcon />
                        }
                        disabled={
                            recommendation.status ===
                            "Accepted"
                        }
                        onClick={onAccept}
                    >
                        Accept
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={
                            <CloseIcon />
                        }
                        disabled={
                            recommendation.status ===
                            "Rejected"
                        }
                        onClick={onReject}
                    >
                        Reject
                    </Button>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                            <EditIcon />
                        }
                        onClick={onModify}
                    >
                        Modify
                    </Button>

                </Stack>

            </CardContent>

        </Card>
    );
}