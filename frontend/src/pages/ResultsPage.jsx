import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Alert, Chip, IconButton,
  Tooltip, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Card, CardContent, TextField, InputAdornment, Skeleton,
  Snackbar,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { surveyAPI } from '../services/api';
import entidadesPublicasConfig from '../config/EntidadesPublicasConfig';
import mgdaConfig from '../config/MGMAconfig';
import entidadesPrivadasConfig from '../config/surveyConfig';
import pinarConfig from '../config/pinarConfig';

const FORM_LABELS = {
  entidades_publicas: 'Entidades Públicas',
  mgda: 'MGDA',
  entidades_privadas: 'Entidades Privadas',
  pinar: 'PINAR',
};

const FORM_COLORS = {
  entidades_publicas: { color: '#0076C6', bg: '#E1F0F7', icon: AccountBalanceOutlinedIcon },
  mgda: { color: '#005585', bg: '#E1F0F7', icon: DescriptionOutlinedIcon },
  entidades_privadas: { color: '#00446A', bg: '#E1F0F7', icon: BusinessOutlinedIcon },
  pinar: { color: '#0B6BCB', bg: '#EAF4FF', icon: DescriptionOutlinedIcon },
};

const FORM_CONFIGS = {
  entidades_publicas: entidadesPublicasConfig,
  mgda: mgdaConfig,
  entidades_privadas: entidadesPrivadasConfig,
  pinar: pinarConfig,
};

const extractElements = (elements = []) => {
  const fields = [];
  for (const el of elements) {
    if (el.type === 'html') continue;
    if (el.type === 'panel') fields.push(...extractElements(el.elements));
    else if (el.name) fields.push({ name: el.name, title: el.title || el.name });
  }
  return fields;
};

const getPageStructure = (config) => {
  if (!config?.pages) return [];
  return config.pages.map((p) => ({
    pageTitle: p.title || p.name,
    fields: extractElements(p.elements),
  }));
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' }) : '—';

const getEntityName = (s) =>
  s.surveyData?.nombre_entidad ||
  s.surveyData?.NOMBRE_ENTIDAD ||
  s.surveyData?.razon_social ||
  '—';

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon sx={{ color, fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">{value ?? '—'}</Typography>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ResultsPage() {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [generatingId, setGeneratingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sr, st] = await Promise.all([
        surveyAPI.getAll({ limit: 100 }),
        surveyAPI.getStats(),
      ]);
      setSurveys(sr.data || []);
      setStats(st.data || null);
    } catch {
      setError('Error al cargar los resultados. Verifique su conexión e intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
    try {
      await surveyAPI.delete(id);
      fetchData();
      setToastMsg('Registro eliminado correctamente.');
    } catch {
      setToastMsg('Error al eliminar el registro.');
    }
  };
  const handleGeneratePptx = async (survey) => {

    setGeneratingId(survey._id);

    try {

      const blob =
        await surveyAPI.generateIndividualPresentation(
          survey._id
        );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      const entity =
        getEntityName(survey).replace(/\s+/g, '_');

      link.download =
        `Diagnostico_${entity}_${Date.now()}.pptx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      setToastMsg(
        'Presentación generada exitosamente.'
      );

    } catch {

      setToastMsg(
        'Error al generar la presentación.'
      );

    } finally {

      setGeneratingId(null);

    }
  };

  const handleGenerateDocx = async (survey) => {

    alert("DOCX CLICK");

    setGeneratingId(survey._id);

    try {

      const blob =
        await surveyAPI.generatePinarDocx(
          survey
        );

      console.log("BLOB:", blob);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      const entity =
        getEntityName(survey).replace(/\s+/g, '_');

      link.download =
        `PINAR_${entity}_${Date.now()}.docx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      setToastMsg(
        'Documento PINAR generado exitosamente.'
      );

    } catch (err) {

      console.error("ERROR DOCX:", err);

      alert(
        JSON.stringify(
          err.response?.data || err.message,
          null,
          2
        )
      );

      setToastMsg(
        'Error al generar el documento PINAR.'
      );

    } finally {

      setGeneratingId(null);

    }
  };

  const filtered = surveys.filter((s) => {
    const matchType = filterType === 'all' || s.formType === filterType;
    const entity = getEntityName(s).toLowerCase();
    const matchSearch = !search || entity.includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const filterButtons = [
    { key: 'all', label: 'Todos' },
    { key: 'entidades_publicas', label: 'Públ.' },
    { key: 'mgda', label: 'MGDA' },
    { key: 'entidades_privadas', label: 'Priv.' },
    { key: 'pinar', label: 'PINAR' },
  ];

  return (
    <Box className="fade-in" sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Registros de diagnóstico</Typography>
          <Typography variant="body2" color="text.secondary">
            {surveys.length} registro{surveys.length !== 1 ? 's' : ''} en total
          </Typography>
        </Box>
        <Tooltip title="Actualizar">
          <IconButton onClick={fetchData} disabled={loading} aria-label="Actualizar">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={AssessmentOutlinedIcon} label="Total registros" value={stats?.total ?? surveys.length} color="#0076C6" bg="#E1F0F7" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={AccountBalanceOutlinedIcon} label="Entidades Públicas" value={stats?.byFormType?.entidades_publicas ?? surveys.filter(s => s.formType === 'entidades_publicas').length} color="#005585" bg="#E1F0F7" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={DescriptionOutlinedIcon} label="MGDA" value={stats?.byFormType?.mgda ?? surveys.filter(s => s.formType === 'mgda').length} color="#00446A" bg="#E1F0F7" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={BusinessOutlinedIcon} label="Entidades Privadas" value={stats?.byFormType?.entidades_privadas ?? surveys.filter(s => s.formType === 'entidades_privadas').length} color="#636569" bg="#F4F4F5" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={BusinessOutlinedIcon} label="PINAR" value={stats?.byFormType?.pinar ?? surveys.filter(s => s.formType === 'pinar').length} color="#0B6BCB" bg="#EAF4FF" />
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Filters + search */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #E5E7EB', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Buscar entidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
              sx: { borderRadius: 2 },
            }}
            sx={{ width: { xs: '100%', sm: 240 } }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filterButtons.map(({ key, label }) => (
              <Button
                key={key}
                size="small"
                variant={filterType === key ? 'contained' : 'outlined'}
                onClick={() => setFilterType(key)}
                sx={{ borderRadius: 2, minWidth: 0, px: 1.5, py: 0.5 }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Entidad</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" width="80%" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <AssessmentOutlinedIcon sx={{ fontSize: 40, color: '#CBD5E1', mb: 1, display: 'block', mx: 'auto' }} />
                    <Typography variant="body2" color="text.secondary">
                      No hay registros para mostrar.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((survey) => {
                  const typeInfo = FORM_COLORS[survey.formType] || {};
                  const TypeIcon = typeInfo.icon || DescriptionOutlinedIcon;
                  const isPptxAvailable = true;
                  return (
                    <TableRow key={survey._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {getEntityName(survey)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<TypeIcon sx={{ fontSize: '14px !important' }} />}
                          label={FORM_LABELS[survey.formType] ?? survey.formType}
                          size="small"
                          sx={{
                            bgcolor: typeInfo.bg, color: typeInfo.color,
                            fontWeight: 500, fontSize: '0.72rem',
                            '& .MuiChip-icon': { color: typeInfo.color },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={survey.status === 'completed' ? 'Completado' : 'Borrador'}
                          size="small"
                          color={survey.status === 'completed' ? 'success' : 'default'}
                          variant="outlined"
                          sx={{ fontSize: '0.72rem', fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(survey.completedAt || survey.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Ver detalle">
                            <IconButton size="small" onClick={() => setSelectedSurvey(survey)} aria-label="Ver detalle">
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {isPptxAvailable && survey.formType !== 'pinar' && (
                            <Tooltip title="Generar PPTX">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleGeneratePptx(survey)}
                                  disabled={generatingId === survey._id}
                                  aria-label="Generar presentación PPTX"
                                  sx={{ color: 'primary.main' }}
                                >
                                  {generatingId === survey._id
                                    ? <CircularProgress size={16} />
                                    : <SlideshowOutlinedIcon fontSize="small" />}
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          {survey.formType === 'pinar' && (
                            <Tooltip title="Generar PINAR DOCX">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleGenerateDocx(survey)}
                                  disabled={generatingId === survey._id}
                                  aria-label="Generar PINAR DOCX"
                                  sx={{ color: '#2563EB' }}
                                >
                                  {generatingId === survey._id
                                    ? <CircularProgress size={16} />
                                    : <DescriptionIcon fontSize="small" />}
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(survey._id)}
                              aria-label="Eliminar registro"
                              sx={{ '&:hover': { color: 'error.main', bgcolor: '#FEE2E2' } }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detail dialog */}
      <Dialog
        open={Boolean(selectedSurvey)}
        onClose={() => setSelectedSurvey(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, maxHeight: '85vh' } }}
      >
        {selectedSurvey && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Detalle del diagnóstico</Typography>
                <Typography variant="body2" color="text.secondary">
                  {FORM_LABELS[selectedSurvey.formType]} · {formatDate(selectedSurvey.completedAt || selectedSurvey.createdAt)}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedSurvey(null)} size="small" aria-label="Cerrar">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
              {getPageStructure(FORM_CONFIGS[selectedSurvey.formType]).map((page, pi) => (
                <Box key={pi} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mb: 1.5, pb: 0.5, borderBottom: '2px solid #E1F0F7' }}>
                    {page.pageTitle}
                  </Typography>
                  <Grid container spacing={1.5}>
                    {page.fields.filter((f) => selectedSurvey.surveyData[f.name] !== undefined).map((field) => (
                      <Grid item xs={12} sm={6} key={field.name}>
                        <Box sx={{ bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2, border: '1px solid #E5E7EB' }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                            {field.title}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {String(selectedSurvey.surveyData[field.name])}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>

              <Button
                onClick={() => setSelectedSurvey(null)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cerrar
              </Button>

              {selectedSurvey?.formType !== 'pinar' ? (

                <Button
                  variant="contained"
                  startIcon={
                    generatingId === selectedSurvey._id
                      ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                      : <SlideshowOutlinedIcon />
                  }
                  onClick={() => handleGeneratePptx(selectedSurvey)}
                  disabled={generatingId === selectedSurvey._id}
                  sx={{ borderRadius: 2 }}
                >
                  Generar PPTX
                </Button>

              ) : (

                <Button
                  variant="contained"
                  startIcon={
                    generatingId === selectedSurvey._id
                      ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                      : <DescriptionIcon />
                  }
                  onClick={() => handleGenerateDocx(selectedSurvey)}
                  disabled={generatingId === selectedSurvey._id}
                  sx={{ borderRadius: 2 }}
                >
                  Generar Documento
                </Button>

              )}

            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={Boolean(toastMsg)}
        autoHideDuration={4000}
        onClose={() => setToastMsg('')}
        message={toastMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
