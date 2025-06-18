import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Topbar />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, maxWidth: '100%', mx: 'auto', width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 