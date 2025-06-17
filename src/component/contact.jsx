import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    IconButton,
    Snackbar,
    Alert,
    Grid,
    Fade,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

function Contact() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

    const API_BASE = 'https://portfolio-admin-fe.onrender.com/api/contact';

    const fetchContacts = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setContacts(data);
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
            setToast({ open: true, message: 'Failed to load contacts.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setContacts((prev) => prev.filter((item) => item._id !== id));
                setToast({ open: true, message: 'Contact deleted successfully!', severity: 'success' });
            } else {
                throw new Error('Delete failed');
            }
        } catch (err) {
            console.error('Delete error:', err);
            setToast({ open: true, message: 'Error deleting contact.', severity: 'error' });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ px: 4, py: 5, background: '#f9f9f9', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
                📬 User Contact Messages
            </Typography>

            {contacts.length === 0 ? (
                <Typography variant="body1" textAlign="center">
                    No contact messages found.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {contacts.map((contact) => (
                        <Grid item xs={12} sm={6} md={4} key={contact._id}>
                            <Fade in>
                                <Card
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <PersonIcon color="primary" />
                                            <Typography fontWeight="bold">{contact.name}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <EmailIcon color="action" />
                                            <Typography variant="body2">{contact.email}</Typography>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary', mb: 2, minHeight: 60 }}
                                        >
                                            {contact.message}
                                        </Typography>

                                        <Box sx={{ textAlign: 'right' }}>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(contact._id)}
                                                disabled={deletingId === contact._id}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Contact;
