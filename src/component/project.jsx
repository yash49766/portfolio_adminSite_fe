"use client"

import { useState, useEffect } from "react"
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    IconButton,
    Grid,
    Fab,
    Alert,
    Snackbar,
    CardActions,
    Divider,
    Paper,
    Stack,
    Avatar,
    Tooltip,
} from "@mui/material"

import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    GitHub as GitHubIcon,
    Launch as LaunchIcon,
    Code as CodeIcon,
    Close as CloseIcon,
} from "@mui/icons-material"

const API_BASE = "https://portfolio-admin-fe.onrender.com/api/projects"

const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })

function Project() {
    const [projects, setProjects] = useState([])
    const [open, setOpen] = useState(false)
    const [editingProject, setEditingProject] = useState(null)
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        tech: [],
        github: "",
        demo: "",
    })
    const [techInput, setTechInput] = useState("")

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const response = await fetch(API_BASE)
            const data = await response.json()
            setProjects(data)
        } catch (error) {
            showSnackbar("Failed to fetch projects", "error")
        } finally {
            setLoading(false)
        }
    }

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity })
    }

    const handleSubmit = async () => {
        const { title, description, image } = formData
        if (!title || !description || !image) {
            return showSnackbar("Please fill all required fields", "error")
        }

        setLoading(true)
        try {
            const method = editingProject ? "PUT" : "POST"
            const url = editingProject ? `${API_BASE}/${editingProject._id}` : API_BASE

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error()

            await fetchProjects()
            handleClose()
            showSnackbar(editingProject ? "Project updated!" : "Project created!")
        } catch {
            showSnackbar("Failed to save project", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
            if (!response.ok) throw new Error()
            await fetchProjects()
            showSnackbar("Project deleted!")
        } catch {
            showSnackbar("Failed to delete project", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (project) => {
        setEditingProject(project)
        setFormData(project)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setEditingProject(null)
        setFormData({
            title: "",
            description: "",
            image: "",
            tech: [],
            github: "",
            demo: "",
        })
        setTechInput("")
    }

    const handleAddTech = () => {
        const tech = techInput.trim()
        if (tech && !formData.tech.includes(tech)) {
            setFormData((prev) => ({ ...prev, tech: [...prev.tech, tech] }))
            setTechInput("")
        }
    }

    const handleRemoveTech = (tech) => {
        setFormData((prev) => ({
            ...prev,
            tech: prev.tech.filter((t) => t !== tech),
        }))
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "primary.main" }}><CodeIcon /></Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="primary">Project Admin Panel</Typography>
                        <Typography variant="subtitle1" color="text.secondary">Manage your portfolio projects</Typography>
                    </Box>
                </Stack>
            </Paper>

            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} lg={4} key={project._id}>
                        <Card
                            elevation={8}
                            sx={{
                                height: 480, // Fixed height for consistency
                                display: "flex",
                                flexDirection: "column",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="180"
                                image={project.image}
                                alt={project.title}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent sx={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                p: 2
                            }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{
                                        mb: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {project.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                        flexGrow: 1,
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        lineHeight: 1.4
                                    }}
                                >
                                    {project.description}
                                </Typography>
                                <Box sx={{
                                    maxHeight: 60,
                                    overflow: "hidden",
                                    mb: 1
                                }}>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                        {project.tech.slice(0, 4).map((tech, i) => (
                                            <Chip
                                                key={i}
                                                label={tech}
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                sx={{ mb: 0.5, fontSize: "0.7rem" }}
                                            />
                                        ))}
                                        {project.tech.length > 4 && (
                                            <Chip
                                                label={`+${project.tech.length - 4}`}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                sx={{ mb: 0.5, fontSize: "0.7rem" }}
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{
                                justifyContent: "space-between",
                                p: 2,
                                minHeight: 56 // Consistent action bar height
                            }}>
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="View GitHub">
                                        <IconButton size="small" href={project.github} target="_blank" color="primary">
                                            <GitHubIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View Demo">
                                        <IconButton size="small" href={project.demo} target="_blank" color="primary">
                                            <LaunchIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="Edit Project">
                                        <IconButton size="small" onClick={() => handleEdit(project)} color="info">
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Project">
                                        <IconButton size="small" onClick={() => handleDelete(project._id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setOpen(true)}
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    "&:hover": {
                        background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
                    },
                }}
            >
                <AddIcon />
            </Fab>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        },
                    }}
            >
                <DialogTitle
                    sx={{
                        background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                        color: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6">{editingProject ? "Edit Project" : "Add New Project"}</Typography>
                    <IconButton onClick={handleClose} sx={{ color: "white" }}><CloseIcon /></IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                        <TextField fullWidth label="Title" value={formData.title}
                                   onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} />
                        <TextField fullWidth label="Description" multiline minRows={3} maxRows={10}
                                   value={formData.description}
                                   onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} />
                        <Button variant="outlined" component="label">
                            {formData.image ? "Change Image" : "Upload Image"}
                            <input type="file" hidden accept="image/*" onChange={async (e) => {
                                const file = e.target.files[0]
                                if (file) {
                                    const base64 = await convertToBase64(file)
                                    setFormData((prev) => ({ ...prev, image: base64 }))
                                }
                            }} />
                        </Button>
                        {formData.image && (
                            <Box mt={2}>
                                <Typography variant="caption">Preview:</Typography>
                                <Box component="img" src={formData.image} alt="Preview" sx={{ maxWidth: "100%", borderRadius: 2 }} />
                            </Box>
                        )}
                        <Stack direction="row" spacing={1}>
                            <TextField
                                label="Add Technology"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                                size="small"
                            />
                            <Button onClick={handleAddTech} variant="outlined">Add</Button>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {formData.tech.map((tech, index) => (
                                <Chip key={index} label={tech} onDelete={() => handleRemoveTech(tech)} color="primary" />
                            ))}
                        </Stack>
                        <TextField fullWidth label="GitHub URL"
                                   value={formData.github}
                                   onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))} />
                        <TextField fullWidth label="Demo URL"
                                   value={formData.demo}
                                   onChange={(e) => setFormData((prev) => ({ ...prev, demo: e.target.value }))} />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                            "&:hover": {
                                background: "linear-gradient(45deg, #667eea 60%, #764ba2 100%)",
                            },
                        }}
                    >
                        {loading ? "Saving..." : editingProject ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Project