import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Divider, Avatar } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import AirIcon from '@mui/icons-material/Air';
import TrafficIcon from '@mui/icons-material/DirectionsCar';
import EnergyIcon from '@mui/icons-material/Power';
import WasteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';

const navItems = [
  { text: 'Overview', icon: <DashboardIcon />, path: '/' },
  { text: 'City Map', icon: <MapIcon />, path: '/city-map' },
  { text: 'Air Quality', icon: <AirIcon />, path: '/air-quality' },
  { text: 'Traffic', icon: <TrafficIcon />, path: '/traffic' },
  { text: 'Energy', icon: <EnergyIcon />, path: '/energy' },
  { text: 'Waste', icon: <WasteIcon />, path: '/waste' },
  { text: 'Community', icon: <GroupIcon />, path: '/community' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1, justifyContent: 'center',backgroundColor:'primary.main' }}>
        <Avatar src="/logo.svg" sx={{ mr: 1, width: 36, height: 36, bgcolor: 'transparent' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: 20, letterSpacing: 0.5 }}>
          Bengaluru EcoSphere
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              '&.Mui-selected': {
                backgroundColor: 'rgba(46,125,50,0.08)',
                fontWeight: 600,
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 