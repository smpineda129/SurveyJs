import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Header from './Header';

const PAGE_TITLES = {
  '/': 'Inicio',
  '/survey': 'Formulario',
  '/results': 'Resultados',
};

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'GDI';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="div"
        sx={{
          flex: 1,
          ml: { md: `${SIDEBAR_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Header onMenuClick={() => setMobileOpen(true)} title={title} />

        {/* Push content below fixed AppBar */}
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }} />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            minHeight: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
