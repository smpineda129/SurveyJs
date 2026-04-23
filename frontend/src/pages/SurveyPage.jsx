import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  Paper, Chip,
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SurveyComponent from '../components/Survey/SurveyComponent';
import entidadesPublicasConfig from '../config/EntidadesPublicasConfig';
import mgdaConfig from '../config/MGMAconfig';
import entidadesPrivadasConfig from '../config/surveyConfig';
import pinarConfig from '../config/PINARconfig';

const formularios = [
  {
    key: 'entidades_publicas',
    label: 'Diagnóstico Integral – Entidades Públicas',
    config: entidadesPublicasConfig,
  },
  {
    key: 'mgda',
    label: 'Modelo de Gestión Documental (MGDA)',
    config: mgdaConfig,
  },
  {
    key: 'entidades_privadas',
    label: 'Diagnóstico Integral – Entidades Privadas',
    config: entidadesPrivadasConfig,
  },
  {
    key: 'pinar',
    label: 'Plan Institucional de Archivos (PINAR)',
    config: pinarConfig,
  },
];

export default function SurveyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedForm, setSelectedForm] = useState('');

  // Pre-select form from URL param (e.g. /survey?form=entidades_publicas)
  useEffect(() => {
    const formParam = searchParams.get('form');
    if (formParam && formularios.find((f) => f.key === formParam)) {
      setSelectedForm(formParam);
    }
  }, [searchParams]);

  const handleSurveyComplete = () => {
    setTimeout(() => navigate('/results'), 1800);
  };

  const activeForm = formularios.find((f) => f.key === selectedForm);

  return (
    <Box className="fade-in" sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Selector header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          mb: 3,
          border: '1px solid #E5E7EB',
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            bgcolor: '#E1F0F7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AssignmentOutlinedIcon sx={{ color: '#0076C6', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Seleccionar instrumento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Elija el formulario que desea diligenciar
            </Typography>
          </Box>
        </Box>

        <FormControl fullWidth>
          <InputLabel id="form-select-label">Instrumento archivístico</InputLabel>
          <Select
            labelId="form-select-label"
            value={selectedForm}
            label="Instrumento archivístico"
            onChange={(e) => setSelectedForm(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            {formularios.map((f) => (
              <MenuItem key={f.key} value={f.key}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedForm && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Formulario: ${activeForm?.label}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Paper>

      {/* Survey form */}
      {activeForm && (
        <SurveyComponent
          key={selectedForm}
          surveyConfig={activeForm.config}
          formType={selectedForm}
          onComplete={handleSurveyComplete}
        />
      )}

      {!selectedForm && (
        <Paper
          elevation={0}
          sx={{
            p: 6, textAlign: 'center',
            border: '2px dashed #E5E7EB',
            borderRadius: 3,
            bgcolor: 'transparent',
          }}
        >
          <AssignmentOutlinedIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Seleccione un instrumento para comenzar
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Use el selector de arriba para elegir el formulario correspondiente.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
