import { useState, useRef, useMemo, useEffect } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { Box, Paper, Alert, CircularProgress } from '@mui/material';
import 'survey-core/defaultV2.min.css';
import { surveyAPI } from '../../services/api';

function SurveyComponent({ surveyConfig, formType, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  console.log('>>> SurveyComponent FIXED <<<');

  const allValuesRef = useRef({});
  const onCompleteRef = useRef(onComplete);
  const formTypeRef = useRef(formType);

  onCompleteRef.current = onComplete;
  formTypeRef.current = formType;

  // 🔥 FUNCIÓN PARA CALCULAR TOTALES
  const calcularTotales = (survey) => {
    const data = survey.getValue("matriz_calificacion");
    if (!data) return;

    const actualizada = data.map(row => {
      const total =
        (Number(row.admin) || 0) +
        (Number(row.acceso) || 0) +
        (Number(row.preservacion) || 0) +
        (Number(row.tecnologia) || 0) +
        (Number(row.fortalecimiento) || 0);

      return { ...row, total };
    });

    survey.setValue("matriz_calificacion", actualizada);
  };

  // 🔥 CREAR SURVEY
  const survey = useMemo(() => {
    const s = new Model(surveyConfig);

    s.clearInvisibleValues = 'none';
    s.keepIncorrectValues = true;
    s.storeOthersAsComment = false;
    s.textUpdateMode = 'onTyping';

    s.applyTheme({
      themeName: 'defaultV2',
      colorPalette: 'light',
      isPanelless: false,
    });

    return s;
  }, [surveyConfig]);

  // 🔥 INYECTAR DATOS PINAR
  useEffect(() => {
    if (formType !== "pinar") return;

    const aspectosDiagnostico = [
      "Falta de actualización de TRD",
      "Deficiente organización documental",
      "Falta de digitalización"
    ];

    const aspectosFormateados = aspectosDiagnostico.map(a => ({
      aspecto: a,
      riesgo: ""
    }));

    const matriz = aspectosDiagnostico.map(a => ({
      aspecto: a,
      admin: "",
      acceso: "",
      preservacion: "",
      tecnologia: "",
      fortalecimiento: "",
      total: 0
    }));

    setTimeout(() => {
      survey.setValue("aspectos_criticos", aspectosFormateados);
      survey.setValue("matriz_calificacion", matriz);
    }, 200);

  }, [survey, formType]);

  // 🔥 EVENTOS
  useEffect(() => {

    const onValueChanged = (sender, options) => {
      if (
        options.name &&
        options.value !== undefined &&
        options.value !== null &&
        options.value !== ''
      ) {
        allValuesRef.current[options.name] = options.value;
      }

      if (
        formTypeRef.current === "pinar" &&
        options.name === "matriz_calificacion"
      ) {
        calcularTotales(sender);
      }
    };

    const onPageChanging = (sender) => {
      const page = sender.currentPage;
      if (page && page.questions) {
        page.questions.forEach(q => {
          if (
            q.name &&
            q.value !== undefined &&
            q.value !== null &&
            q.value !== ''
          ) {
            allValuesRef.current[q.name] = q.value;
          }
        });
      }
    };

    const onSurveyComplete = async (sender) => {
      setLoading(true);
      setError(null);

      const lastPage = sender.currentPage;
      if (lastPage && lastPage.questions) {
        lastPage.questions.forEach(q => {
          if (
            q.name &&
            q.value !== undefined &&
            q.value !== null &&
            q.value !== ''
          ) {
            allValuesRef.current[q.name] = q.value;
          }
        });
      }

      const surveyData = { ...allValuesRef.current, ...sender.data };

      try {
        const response = await surveyAPI.create(
          surveyData,
          'completed',
          formTypeRef.current
        );

        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);

        if (onCompleteRef.current) {
          onCompleteRef.current(response.data);
        }

      } catch (err) {
        console.error('Error al enviar:', err);
        setError(err.response?.data?.message || 'Error al enviar el formulario.');
      } finally {
        setLoading(false);
      }
    };

    survey.onValueChanged.add(onValueChanged);
    survey.onCurrentPageChanging.add(onPageChanging);
    survey.onComplete.add(onSurveyComplete);

    return () => {
      survey.onValueChanged.remove(onValueChanged);
      survey.onCurrentPageChanging.remove(onPageChanging);
      survey.onComplete.remove(onSurveyComplete);
    };

  }, [survey]);

  return (
    <Box className="fade-in">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ¡Formulario enviado exitosamente! Gracias por su participación.
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Survey model={survey} />
      </Paper>
    </Box>
  );
}

export default SurveyComponent;