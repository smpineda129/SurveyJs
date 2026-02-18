import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../public/Logo.png';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box component="img" src={Logo} alt="GDI Logo" sx={{ height: 40, mr: 2, cursor: 'pointer' }} onClick={() => navigate('/')} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
            }}
          >
            Inicio
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/survey')}
            sx={{
              fontWeight: location.pathname === '/survey' ? 'bold' : 'normal',
            }}
          >
            Formulario
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/results')}
            sx={{
              fontWeight: location.pathname === '/results' ? 'bold' : 'normal',
            }}
          >
            Resultados
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
