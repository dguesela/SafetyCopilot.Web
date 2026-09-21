import type { ReactNode } from "react";

import {
    Box,
    Typography,
} from "@mui/material";

interface Props {
    title: string;

    subtitle?: string;

    action?: ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    action,
}: Props) {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
            }}
        >

            <Box>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    {title}
                </Typography>

                {subtitle && (
                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}

            </Box>

            {action}

        </Box>
    );
}