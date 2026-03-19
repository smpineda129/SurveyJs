import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';
import Logo from '../public/Logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Ingrese su correo y contraseña.'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Credenciales inválidas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #002235 0%, #005585 40%, #0076C6 100%)',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <Box sx={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)', top: -120, right: -80,
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)', bottom: -60, left: -60,
        pointerEvents: 'none',
      }} />

      <Card
        sx={{
          width: '100%', maxWidth: 420,
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
          border: 'none',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src={Logo}
              alt="GDI Logo"
              sx={{ height: 52, objectFit: 'contain', mb: 2 }}
            />
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Acceso al Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Instrumentos Archivísticos — GDI
            </Typography>
          </Box>

          {/* Icon badge */}
          <Box sx={{
            display: 'flex', justifyContent: 'center', mb: 3,
          }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%',
              backgroundColor: '#E1F0F7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LockOutlinedIcon sx={{ color: '#0076C6', fontSize: 26 }} />
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              sx={{ mb: 2 }}
              inputProps={{ 'aria-label': 'Correo electrónico' }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #0076C6 0%, #005585 100%)',
                '&:hover': { filter: 'brightness(1.08)', background: 'linear-gradient(135deg, #0076C6 0%, #005585 100%)' },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Iniciar sesión'}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
            sx={{ mt: 3 }}
          >
            © {new Date().getFullYear()} GDI — Gestión Documental Inteligente
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
