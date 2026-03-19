import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, Tooltip, IconButton,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Logo from '../../public/Logo.png';
import { useAuth } from '../../context/AuthContext';

export const SIDEBAR_WIDTH = 252;

const navItems = [
  { label: 'Inicio', icon: <HomeOutlinedIcon fontSize="small" />, path: '/' },
  { label: 'Formulario', icon: <AssignmentOutlinedIcon fontSize="small" />, path: '/survey' },
  { label: 'Resultados', icon: <BarChartOutlinedIcon fontSize="small" />, path: '/results' },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNav = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#FFFFFF' }}>
      {/* Brand */}
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 64 }}>
        <Box
          component="img"
          src={Logo}
          alt="GDI"
          sx={{ height: 32, objectFit: 'contain', cursor: 'pointer' }}
          onClick={() => handleNav('/')}
        />
        <Box>
          <Typography variant="caption" fontWeight={700} color="primary.main" display="block" lineHeight={1.2}>
            GDI
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}>
            Instrumentos Archivísticos
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 1.5, overflow: 'auto' }}>
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ px: 2.5, pb: 1, display: 'block', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.7rem' }}
        >
          Menú Principal
        </Typography>
        <List dense disablePadding>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => handleNav(item.path)}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* User section */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          p: 1, borderRadius: 2, bgcolor: '#F8FAFC',
        }}>
          <Avatar
            sx={{ width: 34, height: 34, bgcolor: '#0076C6', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap sx={{ lineHeight: 1.3 }}>
              {user?.name || 'Usuario'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ lineHeight: 1.2 }}>
              {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </Typography>
          </Box>
          <Tooltip title="Cerrar sesión">
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: '#FEE2E2' } }}
              aria-label="Cerrar sesión"
            >
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', top: 0, height: '100vh', position: 'fixed' },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}
