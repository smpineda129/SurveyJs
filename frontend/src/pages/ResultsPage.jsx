import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { surveyAPI } from '../services/api';

function ResultsPage() {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [surveysResponse, statsResponse] = await Promise.all([
        surveyAPI.getAll({ limit: 50 }),
        surveyAPI.getStats(),
      ]);
      setSurveys(surveysResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los resultados. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta respuesta?')) {
      try {
        await surveyAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting survey:', err);
        alert('Error al eliminar la respuesta');
      }
    }
  };

  const handleView = (survey) => {
    console.log('Survey data:', survey);
    alert(JSON.stringify(survey.surveyData, null, 2));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box className="fade-in" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h3" component="h1" sx={{ fontWeight: 600 }}>
            Resultados del Formulario
          </Typography>
          <Tooltip title="Actualizar">
            <IconButton onClick={fetchData} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Estadísticas */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total de Respuestas
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Completadas
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {stats.completed}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Borradores
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {stats.draft}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Tasa de Completado
                  </Typography>
                  <Typography variant="h4" component="div" color="primary.main">
                    {stats.completionRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabla de Resultados */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  ID
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Estado
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Fecha de Creación
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Fecha de Completado
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                      No hay resultados disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                surveys.map((survey) => (
                  <TableRow
                    key={survey._id}
                    sx={{
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {survey._id.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={survey.status}
                        color={survey.status === 'completed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(survey.createdAt)}</TableCell>
                    <TableCell>
                      {survey.completedAt
                        ? formatDate(survey.completedAt)
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleView(survey)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(survey._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default ResultsPage;
