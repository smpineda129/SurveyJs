import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, CardActionArea,
  Chip, Button,
} from '@mui/material';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { useAuth } from '../context/AuthContext';

const instruments = [
  {
    key: 'entidades_publicas',
    icon: AccountBalanceOutlinedIcon,
    color: '#0076C6',
    bg: '#E1F0F7',
    label: 'Sector Público',
    title: 'Diagnóstico Integral de Archivos',
    subtitle: 'Entidades Públicas',
    description:
      'Evalúa el estado de los archivos en entidades del sector público: identificación institucional, infraestructura, gestión documental y preservación.',
  },
  {
    key: 'mgda',
    icon: DescriptionOutlinedIcon,
    color: '#005585',
    bg: '#E1F0F7',
    label: 'MGDA',
    title: 'Modelo de Gestión Documental',
    subtitle: 'Administración de Archivos',
    description:
      'Implementación del Modelo de Gestión Documental y Administración de Archivos. Evaluación por niveles de madurez: Inicial, Básico, Intermedio y Avanzado.',
  },
  {
    key: 'entidades_privadas',
    icon: BusinessOutlinedIcon,
    color: '#00446A',
    bg: '#E1F0F7',
    label: 'Sector Privado',
    title: 'Diagnóstico Integral de Archivos',
    subtitle: 'Entidades Privadas',
    description:
      'Diagnóstico para el sector privado: organización, función archivística, preservación documental y generación de informe en presentación PPTX.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <Box className="fade-in" sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Welcome banner */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #002235 0%, #0076C6 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          position: 'absolute', right: -40, top: -40,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', right: 60, bottom: -60,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
          {greeting}, {user?.name?.split(' ')[0] ?? 'Usuario'} 👋
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 540 }}>
          Bienvenido a la plataforma de Instrumentos Archivísticos de GDI. Seleccione un formulario para iniciar un diagnóstico o revise los resultados registrados.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AssignmentOutlinedIcon fontSize="small" />}
            onClick={() => navigate('/survey')}
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)', filter: 'none' },
            }}
          >
            Nuevo formulario
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<BarChartOutlinedIcon fontSize="small" />}
            onClick={() => navigate('/results')}
            sx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', filter: 'none' } }}
          >
            Ver resultados
          </Button>
        </Box>
      </Box>

      {/* Instruments */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        Instrumentos Archivísticos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Seleccione el instrumento que desea diligenciar para comenzar el diagnóstico.
      </Typography>

      <Grid container spacing={2.5}>
        {instruments.map((inst) => {
          const Icon = inst.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={inst.key}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,118,198,0.12)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/survey?form=${inst.key}`)}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', p: 0 }}
                >
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    {/* Icon + label */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48, height: 48, borderRadius: 2,
                          bgcolor: inst.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Icon sx={{ color: inst.color, fontSize: 24 }} />
                      </Box>
                      <Chip
                        label={inst.label}
                        size="small"
                        sx={{
                          bgcolor: inst.bg, color: inst.color,
                          fontWeight: 600, fontSize: '0.7rem',
                          border: `1px solid ${inst.color}22`,
                        }}
                      />
                    </Box>

                    <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ mb: 0.25 }}>
                      {inst.title}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 1.5, lineHeight: 1.2 }}>
                      {inst.subtitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {inst.description}
                    </Typography>
                  </CardContent>

                  {/* Footer CTA */}
                  <Box
                    sx={{
                      px: 3, py: 1.5,
                      borderTop: '1px solid #E5E7EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      bgcolor: '#FAFAFA',
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      Iniciar diagnóstico
                    </Typography>
                    <ArrowForwardIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
