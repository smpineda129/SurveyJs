export const surveyJson = {
  title: "Plan Institucional de Archivos (PINAR)",
  logoPosition: "right",
  showProgressBar: "top",
  progressBarType: "buttons",
  showQuestionNumbers: "off",
  completedHtml:
    "<div style='font-size:18px;font-weight:bold;margin-top:20px;'>El formulario PINAR ha sido diligenciado correctamente.</div>",

  pages: [
    {
      name: "identificacion",
      title: "Identificación Institucional",
      elements: [
        {
          type: "text",
          name: "nombre_entidad",
          title: "Nombre de la entidad",
          isRequired: true
        },
        {
          type: "text",
          name: "nit",
          title: "NIT"
        },
        {
          type: "dropdown",
          name: "sector",
          title: "Sector",
          choices: ["Público", "Privado", "Mixto"],
          isRequired: true
        },
        {
          type: "text",
          name: "ciudad",
          title: "Ciudad"
        },
        {
          type: "text",
          name: "responsable",
          title: "Responsable del PINAR"
        },
        {
          type: "dropdown",
          name: "vigencia",
          title: "Vigencia del plan",
          choices: ["2026-2029", "2027-2030", "2028-2031"]
        }
      ]
    },

    {
      name: "contexto_estrategico",
      title: "Contexto Estratégico",
      elements: [
        {
          type: "comment",
          name: "mision",
          title: "Misión institucional"
        },
        {
          type: "comment",
          name: "vision",
          title: "Visión institucional"
        },
        {
          type: "comment",
          name: "objetivos_entidad",
          title: "Objetivos estratégicos institucionales"
        }
      ]
    },

    {
      name: "aspectos_criticos",
      title: "Aspectos Críticos",
      elements: [
        {
          type: "matrixdynamic",
          name: "riesgos",
          title: "Registrar aspectos críticos",
          addRowText: "Agregar aspecto",
          columns: [
            {
              name: "aspecto",
              title: "Aspecto crítico",
              cellType: "text"
            },
            {
              name: "riesgo",
              title: "Riesgo asociado",
              cellType: "comment"
            },
            {
              name: "impacto",
              title: "Impacto",
              cellType: "dropdown",
              choices: ["Alto", "Medio", "Bajo"]
            }
          ]
        }
      ]
    },

    {
      name: "vision_objetivos",
      title: "Visión y Objetivos PINAR",
      elements: [
        {
          type: "comment",
          name: "vision_pinar",
          title: "Visión estratégica del PINAR"
        },
        {
          type: "matrixdynamic",
          name: "objetivos_pinar",
          title: "Objetivos estratégicos",
          addRowText: "Agregar objetivo",
          columns: [
            {
              name: "objetivo",
              title: "Objetivo",
              cellType: "comment"
            },
            {
              name: "indicador",
              title: "Indicador",
              cellType: "text"
            }
          ]
        }
      ]
    },

    {
      name: "planes_proyectos",
      title: "Planes y Proyectos",
      elements: [
        {
          type: "paneldynamic",
          name: "proyectos",
          panelAddText: "Agregar proyecto",
          templateTitle: "Proyecto {panelIndex}",
          templateElements: [
            {
              type: "text",
              name: "nombre_proyecto",
              title: "Nombre del proyecto"
            },
            {
              type: "comment",
              name: "descripcion_proyecto",
              title: "Descripción"
            },
            {
              type: "text",
              name: "responsable_proyecto",
              title: "Responsable"
            },
            {
              type: "dropdown",
              name: "prioridad",
              title: "Prioridad",
              choices: ["Alta", "Media", "Baja"]
            }
          ]
        }
      ]
    },

    {
      name: "cronograma",
      title: "Cronograma",
      elements: [
        {
          type: "matrixdynamic",
          name: "cronograma_general",
          title: "Mapa de ruta del PINAR",
          addRowText: "Agregar actividad",
          columns: [
            {
              name: "actividad",
              title: "Actividad",
              cellType: "comment"
            },
            {
              name: "y2026",
              title: "2026",
              cellType: "boolean"
            },
            {
              name: "y2027",
              title: "2027",
              cellType: "boolean"
            },
            {
              name: "y2028",
              title: "2028",
              cellType: "boolean"
            },
            {
              name: "y2029",
              title: "2029",
              cellType: "boolean"
            }
          ]
        }
      ]
    },

    {
      name: "seguimiento",
      title: "Seguimiento",
      elements: [
        {
          type: "matrixdynamic",
          name: "indicadores",
          title: "Control y seguimiento",
          addRowText: "Agregar indicador",
          columns: [
            {
              name: "meta",
              title: "Meta",
              cellType: "text"
            },
            {
              name: "avance",
              title: "% Avance",
              cellType: "text"
            },
            {
              name: "estado",
              title: "Estado",
              cellType: "dropdown",
              choices: ["Pendiente", "En ejecución", "Finalizado"]
            }
          ]
        }
      ]
    },

    {
      name: "observaciones_finales",
      title: "Observaciones Finales",
      elements: [
        {
          type: "comment",
          name: "comentarios_finales",
          title: "Observaciones y recomendaciones"
        }
      ]
    }
  ]
};