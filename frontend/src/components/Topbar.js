import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Set axios base URL globally
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://urban-sustainability-dashboard.onrender.com';

const Topbar = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
      }
    };
    fetchUserName();
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return 'JD'; // Default initials if name is not available
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    } else if (name.length > 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return name.toUpperCase();
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={0} color="inherit" sx={{ borderBottom: '1px solid #e0e0e0', background: '#fff',margin:2 }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#222',fontStyle:'Lato',fontSize:'30px'}}>
            Bengaluru Sustainability Dashboard
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: 14 Jun 2025, 7:57 pm
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="contained" color="primary" startIcon={<CloudDownloadIcon />} sx={{ borderRadius: 2, textTransform: 'none', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}>
            Export Data
          </Button>
          <IconButton sx={{ color: '#222' }}>
            <RefreshIcon />
          </IconButton>
          <IconButton 
            sx={{ color: '#222' }}
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
          <Avatar 
            sx={{ ml: 2, bgcolor: 'secondary.main' }}
          >
            {getInitials(userName)}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar; 