import {
    Box,
    CircularProgress,
} from "@mui/material";

interface Props {
    message?: string;
}

export default function Loading({
    message = "Loading...",
}: Props) {

    return (
        <Box
            sx={{
                minHeight: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
            }}
        >

            <CircularProgress />

            <span>
                {message}
            </span>

        </Box>
    );
}