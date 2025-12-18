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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import DescriptionIcon from '@mui/icons-material/Description';
import { Button } from '@mui/material';
import { surveyAPI } from '../services/api';

function ResultsPage() {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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
    setSelectedSurvey(survey);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSurvey(null);
  };

  const renderFieldValue = (key, value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value);
  };

  const getFieldLabel = (key) => {
    const labels = {
      firstName: 'Nombre',
      lastName: 'Apellido',
      age: 'Edad',
      gender: 'Género',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      city: 'Ciudad',
      country: 'País',
      interests: 'Áreas de Interés',
      contactPreference: 'Preferencia de Contacto',
      newsletter: 'Boletín Informativo',
      comments: 'Comentarios',
      satisfaction: 'Satisfacción'
    };
    return labels[key] || key;
  };

  const handleGeneratePresentation = async () => {
    try {
      setLoading(true);
      const blob = await surveyAPI.generatePresentation();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Resultados_Formulario_${Date.now()}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setLoading(false);
    } catch (err) {
      console.error('Error generating presentation:', err);
      setError('Error al generar la presentación. Por favor, intente nuevamente.');
      setLoading(false);
    }
  };

  const handleGenerateIndividualPresentation = async (survey) => {
    try {
      const blob = await surveyAPI.generateIndividualPresentation(survey._id);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const entityName = survey.surveyData.nombre_entidad || 'Entidad';
      link.download = `Diagnostico_${entityName.replace(/\s+/g, '_')}_${Date.now()}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating individual presentation:', err);
      alert('Error al generar la presentación individual. Por favor, intente nuevamente.');
    }
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SlideshowIcon />}
              onClick={handleGeneratePresentation}
              disabled={loading || surveys.length === 0}
            >
              Generar Presentación
            </Button>
            <Tooltip title="Actualizar">
              <IconButton onClick={fetchData} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
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
                      <Tooltip title="Generar Presentación">
                        <IconButton
                          size="small"
                          onClick={() => handleGenerateIndividualPresentation(survey)}
                          color="secondary"
                        >
                          <DescriptionIcon />
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

        {/* Dialog para ver detalles completos */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              Detalles de la Respuesta
            </Typography>
            {selectedSurvey && (
              <Typography variant="caption" color="text.secondary">
                ID: {selectedSurvey._id}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent dividers>
            {selectedSurvey && (
              <Box>
                {/* Información Personal */}
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  Paso 1: Información Personal
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {['firstName', 'lastName', 'age', 'gender'].map((field) => (
                    selectedSurvey.surveyData[field] !== undefined && (
                      <Grid item xs={12} sm={6} key={field}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {getFieldLabel(field)}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {renderFieldValue(field, selectedSurvey.surveyData[field])}
                          </Typography>
                        </Paper>
                      </Grid>
                    )
                  ))}
                </Grid>

                {/* Información de Contacto */}
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  Paso 2: Información de Contacto
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {['email', 'phone', 'address', 'city', 'country'].map((field) => (
                    selectedSurvey.surveyData[field] !== undefined && (
                      <Grid item xs={12} sm={6} key={field}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {getFieldLabel(field)}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {renderFieldValue(field, selectedSurvey.surveyData[field])}
                          </Typography>
                        </Paper>
                      </Grid>
                    )
                  ))}
                </Grid>

                {/* Preferencias */}
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  Paso 3: Preferencias
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {['interests', 'contactPreference', 'newsletter'].map((field) => (
                    selectedSurvey.surveyData[field] !== undefined && (
                      <Grid item xs={12} sm={6} key={field}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {getFieldLabel(field)}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {renderFieldValue(field, selectedSurvey.surveyData[field])}
                          </Typography>
                        </Paper>
                      </Grid>
                    )
                  ))}
                </Grid>

                {/* Comentarios Adicionales */}
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  Paso 4: Comentarios Adicionales
                </Typography>
                <Grid container spacing={2}>
                  {['comments', 'satisfaction'].map((field) => (
                    selectedSurvey.surveyData[field] !== undefined && (
                      <Grid item xs={12} key={field}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {getFieldLabel(field)}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {renderFieldValue(field, selectedSurvey.surveyData[field])}
                          </Typography>
                        </Paper>
                      </Grid>
                    )
                  ))}
                </Grid>

                {/* Metadata */}
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Fecha de creación: {formatDate(selectedSurvey.createdAt)}
                  </Typography>
                  {selectedSurvey.completedAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Fecha de completado: {formatDate(selectedSurvey.completedAt)}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block">
                    Estado: {selectedSurvey.status}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default ResultsPage;
