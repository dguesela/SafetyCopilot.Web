import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";

import { useState } from "react";

import {
    createProject,
} from "../../api/projectApi";

import type {
    Project,
} from "../../types/project";

interface Props {
    open: boolean;

    onClose: () => void;

    onCreated: (
        project: Project
    ) => void;
}

export default function CreateProjectDialog({
    open,
    onClose,
    onCreated,
}: Props) {

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [projectType, setProjectType] =
        useState("Software");

    const [loading, setLoading] =
        useState(false);

    const handleCreate = async () => {

        if (!name.trim()) {
            return;
        }

        try {

            setLoading(true);

            const project =
                await createProject({
                    name,
                    description,
                    projectType,
                });

            onCreated(project);

            setName("");
            setDescription("");

            onClose();

        } finally {

            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Create Safety Project
            </DialogTitle>

            <DialogContent>

                <TextField
                    fullWidth
                    label="Project Name"
                    margin="normal"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    margin="normal"
                    value={description}
                    onChange={(e) =>
                        setDescription(
                            e.target.value
                        )
                    }
                />

                <TextField
                    fullWidth
                    select
                    label="Project Type"
                    margin="normal"
                    value={projectType}
                    onChange={(e) =>
                        setProjectType(
                            e.target.value
                        )
                    }
                >

                    <MenuItem value="Software">
                        Software
                    </MenuItem>

                    <MenuItem value="Embedded">
                        Embedded System
                    </MenuItem>

                    <MenuItem value="Nuclear">
                        Nuclear System
                    </MenuItem>

                    <MenuItem value="Aerospace">
                        Aerospace
                    </MenuItem>

                    <MenuItem value="Automotive">
                        Automotive
                    </MenuItem>

                    <MenuItem value="Medical">
                        Medical
                    </MenuItem>

                </TextField>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    disabled={
                        loading ||
                        !name.trim()
                    }
                    onClick={handleCreate}
                >
                    Create Project
                </Button>

            </DialogActions>

        </Dialog>
    );
}