import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Button,
} from "@mui/material";

import DashboardIcon
    from "@mui/icons-material/Dashboard";

import FolderIcon
    from "@mui/icons-material/Folder";

import ScienceIcon
    from "@mui/icons-material/Science";

import AssessmentIcon
    from "@mui/icons-material/Assessment";

import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 250;

export default function MainLayout() {

    const navigate = useNavigate();

    const { logout } = useAuth();

    return (
        <Box sx={{ display: "flex" }}>

            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) =>
                        theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>

                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                        }}
                    >
                        SafetyCopilot
                    </Typography>

                    <Button
                        color="inherit"
                        onClick={logout}
                    >
                        Logout
                    </Button>

                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >

                <Toolbar />

                <List>

                    <ListItemButton
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>

                        <ListItemText
                            primary="Dashboard"
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>

                        <ListItemText
                            primary="Projects"
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() =>
                            navigate("/projects")
}
                    >
                        <ListItemIcon>
                            <AssessmentIcon />
                        </ListItemIcon>

                        <ListItemText
                            primary="Safety Analysis"
                        />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() =>
                            navigate("/experiments")
                        }
                    >
                        <ListItemIcon>
                            <ScienceIcon />
                        </ListItemIcon>

                        <ListItemText
                            primary="Experiments"
                        />
                    </ListItemButton>

                </List>

            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    marginLeft: `${drawerWidth}px`,
                }}
            >

                <Toolbar />

                <Outlet />

            </Box>

        </Box>
    );
}