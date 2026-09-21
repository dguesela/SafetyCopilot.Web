import {
    Box,
    Divider,
    Typography,
} from "@mui/material";

import type {
    Recommendation,
} from "../../types/analysis";

import RecommendationCard
    from "./RecommendationCard";

interface Props {

    recommendations: Recommendation[];

    onAccept: (
        recommendation: Recommendation
    ) => void;

    onReject: (
        recommendation: Recommendation
    ) => void;

    onModify: (
        recommendation: Recommendation
    ) => void;
}

export default function RecommendationList({
    recommendations,
    onAccept,
    onReject,
    onModify,
}: Props) {

    return (
        <Box>

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    mb: 1,
                }}
            >
                AI Recommendations
            </Typography>

            <Typography
                color="text.secondary"
                sx={{
                    mb: 3,
                }}
            >
                Review each recommendation carefully.
                The safety engineer remains responsible
                for the final decision.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {recommendations.length === 0 ? (

                <Typography
                    color="text.secondary"
                >
                    No recommendations have been
                    generated yet.
                </Typography>

            ) : (

                recommendations.map(
                    recommendation => (

                        <RecommendationCard
                            key={
                                recommendation.id
                            }
                            recommendation={
                                recommendation
                            }
                            onAccept={() =>
                                onAccept(
                                    recommendation
                                )
                            }
                            onReject={() =>
                                onReject(
                                    recommendation
                                )
                            }
                            onModify={() =>
                                onModify(
                                    recommendation
                                )
                            }
                        />

                    )
                )

            )}

        </Box>
    );
}