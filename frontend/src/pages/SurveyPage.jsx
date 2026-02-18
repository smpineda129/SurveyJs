import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SurveyComponent from '../components/Survey/SurveyComponent';
import entidadesPublicasConfig from '../config/EntidadesPublicasConfig';
import mgdaConfig from '../config/MGMAconfig';
import entidadesPrivadasConfig from '../config/surveyConfig';

const formularios = [
  {
    key: 'entidades_publicas',
    label: 'Diagnóstico Integral de Archivos – Entidades Públicas',
    config: entidadesPublicasConfig,
  },
  {
    key: 'mgda',
    label: 'Modelo de Gestión Documental y Administración de Archivos (MGDA)',
    config: mgdaConfig,
  },
  {
    key: 'entidades_privadas',
    label: 'Diagnóstico Integral de Archivos – Entidades Privadas',
    config: entidadesPrivadasConfig,
  },
];

function SurveyPage() {
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState('');

  const handleSurveyComplete = (data) => {
    console.log('Survey completed with data:', data);
    // Redirigir a resultados después de completar
    setTimeout(() => {
      navigate('/results');
    }, 2000);
  };

  const activeConfig = formularios.find((f) => f.key === selectedForm)?.config;

  return (
    <Container maxWidth="md">
      <Box className="fade-in" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          textAlign="center"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Instrumentos Archivísticos
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          paragraph
          sx={{ mb: 4 }}
        >
          Seleccione el formulario que desea diligenciar. Todos los campos
          marcados con asterisco (*) son obligatorios.
        </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="formulario-select-label">
            Seleccione un formulario
          </InputLabel>
          <Select
            labelId="formulario-select-label"
            id="formulario-select"
            value={selectedForm}
            label="Seleccione un formulario"
            onChange={(e) => setSelectedForm(e.target.value)}
          >
            {formularios.map((form) => (
              <MenuItem key={form.key} value={form.key}>
                {form.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {activeConfig && (
          <SurveyComponent
            key={selectedForm}
            surveyConfig={activeConfig}
            formType={selectedForm}
            onComplete={handleSurveyComplete}
          />
        )}
      </Box>
    </Container>
  );
}

export default SurveyPage;
