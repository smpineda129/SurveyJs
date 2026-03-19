import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SIDEBAR_WIDTH } from './Sidebar';

export default function Header({ onMenuClick, title }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, px: { xs: 2, md: 3 } }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          aria-label="Abrir menú"
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography variant="h6" fontWeight={600} color="text.primary" noWrap>
              {title}
            </Typography>
          )}
        </Box>
        {/* Reserved for future: notifications, user badge, etc. */}
      </Toolbar>
    </AppBar>
  );
}
