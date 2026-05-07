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
  const currentYear = new Date().getFullYear();

  const years = [
    currentYear,
    currentYear + 1,
    currentYear + 2
  ];

  onCompleteRef.current = onComplete;
  formTypeRef.current = formType;

  // FUNCIÓN PARA CALCULAR TOTALES
  const calcularTotales = (survey) => {
    const data = survey.getValue("matriz_calificacion");
    if (!data) return;

    let cambiado = false;

    const actualizada = data.map(row => {
      const total =
        (Number(row.admin) || 0) +
        (Number(row.acceso) || 0) +
        (Number(row.preservacion) || 0) +
        (Number(row.tecnologia) || 0) +
        (Number(row.fortalecimiento) || 0);

      if (row.total !== total) {
        cambiado = true;
        return { ...row, total };
      }

      return row;
    });

    if (cambiado) {
      survey.setValue("matriz_calificacion", actualizada);
    }
    generarPriorizacion(survey);
  };
  const generarObjetivos = (survey, priorizados) => {

    const objetivos = priorizados.map((row) => {

      let objetivo = "";

      const aspecto = (row.aspecto || "").toLowerCase();

      if (aspecto.includes("trd")) {
        objetivo =
          "Actualizar, ajustar e implementar las Tablas de Retención Documental para fortalecer la gestión documental institucional.";
      }

      else if (aspecto.includes("digital")) {
        objetivo =
          "Fortalecer los procesos de digitalización documental para garantizar acceso y preservación de la información.";
      }

      else if (aspecto.includes("organización")) {
        objetivo =
          "Optimizar la organización documental mediante lineamientos archivísticos y buenas prácticas institucionales.";
      }

      else {
        objetivo =
          "Implementar acciones de mejora orientadas al fortalecimiento de la gestión documental institucional.";
      }

      return {
        aspecto: row.aspecto,
        objetivo
      };
    });

    survey.setValue("objetivos_estrategicos", objetivos);
  };

  const generarRiesgos = (survey, priorizados) => {

    const riesgos = priorizados.map((row) => {

      let riesgo = "";

      const aspecto = (row.aspecto || "").toLowerCase();

      if (aspecto.includes("trd")) {
        riesgo =
          "Riesgo de pérdida de control documental e incumplimiento de la normatividad archivística.";
      }

      else if (aspecto.includes("digital")) {
        riesgo =
          "Riesgo de pérdida de información y dificultades en el acceso documental.";
      }

      else if (aspecto.includes("organización")) {
        riesgo =
          "Riesgo de desorganización documental y retrasos en la recuperación de información.";
      }

      else {
        riesgo =
          "Riesgo asociado a deficiencias en la gestión documental institucional.";
      }

      return {
        aspecto: row.aspecto,
        riesgo
      };
    });

    survey.setValue("riesgos_automaticos", riesgos);
  };

  const generarPlanes = (survey, priorizados) => {

    const planes = priorizados.map((row) => {

      let plan = "";
      let actividad = "";

      const aspecto = (row.aspecto || "").toLowerCase();

      if (aspecto.includes("trd")) {

        plan = "Actualización de instrumentos archivísticos";

        actividad =
          "Elaborar, actualizar e implementar las Tablas de Retención Documental.";

      }

      else if (aspecto.includes("digital")) {

        plan = "Fortalecimiento de digitalización documental";

        actividad =
          "Implementar estrategias de digitalización y acceso electrónico de documentos.";

      }

      else if (aspecto.includes("organización")) {

        plan = "Organización documental institucional";

        actividad =
          "Aplicar procesos técnicos archivísticos para la adecuada organización documental.";

      }

      else {

        plan = "Fortalecimiento de gestión documental";

        actividad =
          "Implementar acciones de mejora para fortalecer la gestión documental institucional.";

      }

      return {
        aspecto: row.aspecto,
        plan,
        actividad
      };
    });

    survey.setValue("planes_proyectos", planes);

    generarMapaRuta(survey, planes);
  };

  const generarPriorizacion = (survey) => {
    const data = survey.getValue("matriz_calificacion");
    if (!data) return;

    const priorizados = [...data]

      // ordenar de mayor a menor por total
      .sort((a, b) => (b.total || 0) - (a.total || 0))

      .map((row, index) => {

        let prioridad = "Baja";

        if (row.total >= 40) {
          prioridad = "Alta";
        } else if (row.total >= 25) {
          prioridad = "Media";
        }

        return {
          numero: index + 1,
          aspecto: row.aspecto,
          prioridad
        };
      });

    survey.setValue("priorizacion_criticos", priorizados);

    generarObjetivos(survey, priorizados);
    generarRiesgos(survey, priorizados);
    generarPlanes(survey, priorizados);
  };

  const generarMapaRuta = (survey, planes) => {

    const mapa = planes.map((row, index) => {

      return {
        plan: row.plan,

        vigencia1: "X",

        vigencia2:
          index % 2 === 0 ? "X" : "",

        vigencia3:
          index % 3 === 0 ? "X" : ""
      };
    });

    survey.setValue("mapa_ruta_generado", mapa);
  };

  // CREAR SURVEY
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

  // EVENTOS
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

      // detectar cambios en la matriz (aunque sea interno)
      if (formTypeRef.current === "pinar") {
        setTimeout(() => {
          calcularTotales(sender);
        }, 50);
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

        console.error('ERROR COMPLETO:', err);

        alert(
          JSON.stringify(err.response?.data, null, 2)
        );

        setError(
          err.response?.data?.message ||
          'Error al enviar el formulario.'
        );
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
};

export default SurveyComponent;