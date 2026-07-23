import { useState, useRef, useMemo, useEffect } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { Box, Paper, Alert, CircularProgress } from '@mui/material';
import 'survey-core/defaultV2.min.css';
import { surveyAPI } from '../../services/api';

const MAX_FOTOS_REGISTRO = 15;

function SurveyComponent({ surveyConfig, formType, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [photoWarning, setPhotoWarning] = useState(null);

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

  const calcularTotalFila = (
    row,
    excluir = ["aspecto", "total"]
  ) => {

    return Object.keys(row)
      .filter(
        key =>
          !excluir.includes(key)
      )
      .reduce(
        (sum, key) =>
          sum + Number(row[key] || 0),
        0
      );

  };

  // FUNCIÓN PARA CALCULAR TOTALES
  const calcularTotales =
    (survey) => {
      const data =
        survey.getValue(
          "admin_archivos"
        );

      if (!data) return;

      const nuevaTabla =
        data.map((row) => {

          const total =
            calcularTotalFila(row);

          return {
            ...row,
            total
          };

        });

      survey.setValue(
        "admin_archivos",
        nuevaTabla
      );

      const recalcularTabla = (
        nombre
      ) => {

        const tabla =
          survey.getValue(
            nombre
          ) || [];

        const nueva =
          tabla.map(
            row => ({
              ...row,
              total:
                calcularTotalFila(
                  row
                )
            })
          );

        survey.setValue(
          nombre,
          nueva
        );

        return nueva;

      };

      const acceso =
        recalcularTabla(
          "acceso_informacion"
        );

      const preservacion =
        recalcularTabla(
          "preservacion_informacion"
        );

      const tecnologia =
        recalcularTabla(
          "tecnologia_seguridad"
        );

      const fortalecimiento =
        recalcularTabla(
          "fortalecimiento_articulacion"
        );


      const priorizados =
        nuevaTabla.map(
          (row, index) => {

            const adminTotal =
              Number(
                row.total || 0
              );

            const accesoTotal =
              Number(
                acceso[index]?.total || 0
              );

            const preservacionTotal =
              Number(
                preservacion[index]?.total || 0
              );

            const tecnologiaTotal =
              Number(
                tecnologia[index]?.total || 0
              );

            const fortalecimientoTotal =
              Number(
                fortalecimiento[index]?.total || 0
              );

            const totalGeneral =

              adminTotal +

              accesoTotal +

              preservacionTotal +

              tecnologiaTotal +

              fortalecimientoTotal;

            let prioridad =
              "Baja";

            if (
              totalGeneral >= 35
            ) {

              prioridad =
                "Alta";

            }

            else if (
              totalGeneral >= 20
            ) {

              prioridad =
                "Media";

            }

            return {

              numero:
                index + 1,

              aspecto:
                row.aspecto,

              admin:
                adminTotal,

              acceso:
                accesoTotal,

              preservacion:
                preservacionTotal,

              tecnologia:
                tecnologiaTotal,

              fortalecimiento:
                fortalecimientoTotal,

              total:
                totalGeneral,

              prioridad

            };

          }
        )

          .sort(
            (a, b) =>
              b.total - a.total
          );

      const totalAdmin =
        priorizados.reduce(
          (sum, row) =>
            sum + Number(row.admin || 0),
          0
        );

      const totalAcceso =
        priorizados.reduce(
          (sum, row) =>
            sum + Number(row.acceso || 0),
          0
        );

      const totalPreservacion =
        priorizados.reduce(
          (sum, row) =>
            sum + Number(row.preservacion || 0),
          0
        );

      const totalTecnologia =
        priorizados.reduce(
          (sum, row) =>
            sum + Number(row.tecnologia || 0),
          0
        );

      const totalFortalecimiento =
        priorizados.reduce(
          (sum, row) =>
            sum + Number(row.fortalecimiento || 0),
          0
        );

      const totalGeneral =

        totalAdmin +

        totalAcceso +

        totalPreservacion +

        totalTecnologia +

        totalFortalecimiento;

      const filaTotales = {

        numero: "",

        aspecto: "TOTAL",

        admin: totalAdmin,

        acceso: totalAcceso,

        preservacion: totalPreservacion,

        tecnologia: totalTecnologia,

        fortalecimiento: totalFortalecimiento,

        total: "",

        prioridad: ""

      };

      priorizados.push(
        filaTotales
      );

      survey.setValue(
        "priorizacion_criticos",
        priorizados
      );

      console.log(
        "ACCESO:",
        acceso
      );

      console.log(
        "PRESERVACION:",
        preservacion
      );

      console.log(
        "TECNOLOGIA:",
        tecnologia
      );

      console.log(
        "FORTALECIMIENTO:",
        fortalecimiento
      );


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
      let responsable = "";
      let recursos = "";
      let indicador = "";
      let plazo = "";

      const aspecto = (row.aspecto || "").toLowerCase();

      if (aspecto.includes("trd")) {

        plan = "Actualización de instrumentos archivísticos";

        actividad =
          "Elaborar, actualizar e implementar las Tablas de Retención Documental.";
        responsable =
          "Área de Gestión Documental";

        recursos =
          "Talento humano archivístico, herramientas ofimáticas y acompañamiento técnico.";

        indicador =
          "Tablas de Retención Documental actualizadas e implementadas.";

        plazo =
          "Mediano plazo";

      }

      else if (aspecto.includes("digital")) {

        plan = "Fortalecimiento de digitalización documental";

        actividad =
          "Implementar estrategias de digitalización y acceso electrónico de documentos.";

        responsable =
          "Área de Tecnología y Gestión Documental";

        recursos =
          "Infraestructura tecnológica, software documental y personal técnico.";

        indicador =
          "Documentos digitalizados y disponibles electrónicamente.";

        plazo =
          "Mediano plazo";

      }

      else if (aspecto.includes("organización")) {

        plan = "Organización documental institucional";

        actividad =
          "Aplicar procesos técnicos archivísticos para la adecuada organización documental.";

        responsable =
          "Área de Archivo Central";

        recursos =
          "Cajas, carpetas, mobiliario archivístico y talento humano.";

        indicador =
          "Fondos documentales organizados técnicamente.";

        plazo =
          "Corto plazo";

      }

      else {

        plan = "Fortalecimiento de gestión documental";

        actividad =
          "Implementar acciones de mejora para fortalecer la gestión documental institucional.";

        responsable =
          "Área de Gestión Documental";

        recursos =
          "Talento humano, recursos administrativos y herramientas archivísticas.";

        indicador =
          "Cumplimiento de actividades de fortalecimiento documental.";

        plazo =
          "Mediano plazo";

      }

      return {
        aspecto: row.aspecto,
        plan,
        actividad,
        responsable,
        recursos,
        indicador,
        plazo
      };
    });

    survey.setValue("planes_proyectos", planes);

    generarMapaRuta(survey, planes);
  };

  const generarMapaRuta = (
    survey,
    planes
  ) => {

    const mapa = planes.map(
      (row) => {

        let vigencia1 = "";
        let vigencia2 = "";
        let vigencia3 = "";

        if (
          row.plazo ===
          "Corto plazo"
        ) {

          vigencia1 = "X";

        }

        else if (
          row.plazo ===
          "Mediano plazo"
        ) {

          vigencia1 = "X";
          vigencia2 = "X";

        }

        else if (
          row.plazo ===
          "Largo plazo"
        ) {

          vigencia1 = "X";
          vigencia2 = "X";
          vigencia3 = "X";

        }

        return {

          plan: row.plan,

          vigencia1,

          vigencia2,

          vigencia3

        };

      }
    );

    survey.setValue(
      "mapa_ruta_generado",
      mapa
    );

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

    const cargarDiagnosticos =
      async () => {

        try {

          const response =
            await surveyAPI.getAll({
              limit: 100
            });

          console.log(
            response.data
          );

          const diagnosticos =
            (response.data || [])
              .filter(
                d =>
                  d.formType?.toLowerCase() !==
                  "pinar"
              );

          console.log(
            "DIAGNOSTICOS:",
            diagnosticos
          );

          const question =
            survey.getQuestionByName(
              "diagnostico_origen"
            );

          if (question) {

            question.choices =
              diagnosticos.map(
                (d) => ({
                  value: d._id,
                  text:
                    `${d.formType.toUpperCase()} - ${d.surveyData?.nombre_entidad ||

                    d.surveyData?.NOMBRE_ENTIDAD ||

                    d.surveyData?.nombre_empresa ||

                    d.surveyData?.razon_social ||

                    "Sin nombre"
                    }`
                })
              );

            survey.onValueChanged.add(
              (sender, options) => {

                if (
                  options.name ===
                  "diagnostico_origen"
                ) {

                  const seleccionado =
                    diagnosticos.find(
                      d =>
                        d._id ===
                        options.value
                    );

                  if (seleccionado) {

                    const nombreEntidad =

                      seleccionado.surveyData?.nombre_entidad ||

                      seleccionado.surveyData?.NOMBRE_ENTIDAD ||

                      seleccionado.surveyData?.nombre_empresa ||

                      seleccionado.surveyData?.razon_social ||

                      "";

                    sender.setValue(
                      "nombre_empresa",
                      nombreEntidad
                    );

                  }

                }

              }
            );

          }

        } catch (error) {

          console.error(
            "Error cargando diagnósticos:",
            error
          );

        }

      };

    cargarDiagnosticos();

  }, [survey, formType]);

  const cargarDatosDiagnostico =
    async (
      survey,
      id
    ) => {

      try {

        const diagnostico =
          await surveyAPI.getById(
            id
          );

        const data =
          diagnostico
            ?.data
            ?.surveyData || {};

        console.log(
          Object.keys(data)
        );

        const observaciones =
          Object.entries(data)

            .filter(
              ([key, value]) => (

                (
                  key.endsWith("_OBS") ||
                  key.endsWith("_obs") ||
                  key.endsWith("_SEL")
                )

                &&

                value &&
                String(value).trim() !== ""

              )
            )
            .map(
              ([key, value]) => ({

                codigo: key,

                observacion: value

              })
            );

        console.log(
          "OBSERVACIONES:",
          observaciones
        );

        const response =
          await surveyAPI
            .generateAspectosCriticos(
              observaciones
            );

        console.log(
          response
        );

        const aspectos =
          response.data || [];

        console.log(
          "ASPECTOS IA:",
          aspectos
        );

        const iaResponse =

          await surveyAPI
            .generatePinarIA(
              survey.data
            );

        survey.setValue(
          "introduccion_ia",
          iaResponse.data.introduccion_ia
        );

        survey.setValue(
          "vision_ia",
          iaResponse.data.vision_ia
        );

        survey.setValue(
          "objetivos_ia",
          iaResponse.data.objetivos_ia
        );

        survey.setValue(
          "planes_ia",
          iaResponse.data.planes_ia
        );

        survey.setValue(
          "aspectos_criticos",
          aspectos
        );

        survey.setValue(
          "admin_archivos",
          aspectos.map(
            item => ({
              aspecto:
                item.aspecto || ""
            })
          )
        );

        survey.setValue(
          "acceso_informacion",
          aspectos.map(
            item => ({
              aspecto:
                item.aspecto || ""
            })
          )
        );

        survey.setValue(
          "preservacion_informacion",
          aspectos.map(
            item => ({
              aspecto:
                item.aspecto || ""
            })
          )
        );

        survey.setValue(
          "tecnologia_seguridad",
          aspectos.map(
            item => ({
              aspecto:
                item.aspecto || ""
            })
          )
        );

        survey.setValue(
          "fortalecimiento_articulacion",
          aspectos.map(
            item => ({
              aspecto:
                item.aspecto || ""
            })
          )
        );

      } catch (error) {

        console.error(
          "Error cargando diagnóstico:",
          error
        );

      }

    };

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

      // VALIDACIÓN: límite de fotos en el registro fotográfico
      if (options.name === 'registro_fotografico') {
        if (Array.isArray(options.value) && options.value.length > MAX_FOTOS_REGISTRO) {
          const recortado = options.value.slice(0, MAX_FOTOS_REGISTRO);
          sender.setValue('registro_fotografico', recortado);
          setPhotoWarning(
            `Se permiten máximo ${MAX_FOTOS_REGISTRO} fotos en el registro fotográfico. Se conservaron las primeras ${MAX_FOTOS_REGISTRO}.`
          );
          setTimeout(() => setPhotoWarning(null), 6000);
        }
      }

      if (
        options.name ===
        "diagnostico_origen"
      ) {

        cargarDatosDiagnostico(
          sender,
          options.value
        );

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

      {photoWarning && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setPhotoWarning(null)}>
          {photoWarning}
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