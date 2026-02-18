import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function HomePage() {
  const formularios = [
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 56, color: 'primary.main' }} />,
      title: 'Diagnóstico Integral de Archivos – Entidades Públicas',
      description:
        'Instrumento archivístico para evaluar el estado de los archivos en entidades del sector público, abarcando identificación, infraestructura, gestión documental y conservación.',
      config: 'EntidadesPublicasConfig',
    },
    {
      icon: <DescriptionIcon sx={{ fontSize: 56, color: 'primary.main' }} />,
      title: 'Modelo de Gestión Documental y Administración de Archivos (MGDA)',
      description:
        'Formulario orientado a la implementación del Modelo de Gestión Documental y Administración de Archivos, incluyendo datos de la entidad y criterios de evaluación.',
      config: 'MGMAconfig',
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 56, color: 'primary.main' }} />,
      title: 'Diagnóstico Integral de Archivos – Entidades Privadas',
      description:
        'Instrumento archivístico dirigido a entidades del sector privado para diagnosticar el estado de sus archivos, su organización y prácticas de gestión documental.',
      config: 'surveyConfig',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box className="fade-in">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Instrumentos Archivísticos
          </Typography>
          <Chip
            label="Gestión Documental Inteligente — GDI"
            color="primary"
            variant="outlined"
            sx={{ mb: 3, fontSize: '0.95rem', py: 2.5, px: 1 }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ mb: 2, maxWidth: 720, mx: 'auto' }}
          >
            Plataforma para el diligenciamiento de instrumentos archivísticos
            requeridos en los procesos de gestión documental. Seleccione uno de
            los formularios disponibles para comenzar.
          </Typography>
        </Box>

        {/* Formularios Section */}
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 600 }}
          >
            Formularios Disponibles
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {formularios.map((form, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{form.icon}</Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {form.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {form.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
