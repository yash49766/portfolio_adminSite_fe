import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Link } from 'react-router-dom';

const navItems = [
    { label: 'Project', path: '/project' },
    { label: 'Contact', path: '/contact' }
];

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = () => setMobileOpen(!mobileOpen);

    const drawer = (
        <Box onClick={toggleDrawer} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                🚀 DevEdge
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            sx={{ textAlign: 'center' }}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    boxShadow: 4,
                }}
            >
                <Toolbar>
                    <RocketLaunchIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        DevEdge
                    </Typography>
                    {isMobile ? (
                        <IconButton edge="end" color="inherit" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        navItems.map((item) => (
                            <Button
                                key={item.label}
                                component={Link}
                                to={item.path}
                                color="inherit"
                                sx={{ mx: 1 }}
                            >
                                {item.label}
                            </Button>
                        ))
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={toggleDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: 220 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default Navbar;
