const pinarConfig = {
  title: "PLAN INSTITUCIONAL DE ARCHIVOS – PINAR",
  showProgressBar: "top",
  progressBarType: "buttons",
  showQuestionNumbers: "off",

  pages: [

    //  1. PORTADA
    {
      name: "DATOS DE LA EMPRESA",
      elements: [
        {
          type: "html",
          name: "titulo_portada",
          html: `
            <h2 style="text-align:center;">PLAN INSTITUCIONAL DE ARCHIVOS – PINAR</h2>
          `
        },
        {
          type: "text",
          name: "nombre_empresa",
          title: "Nombre de la empresa"
        },

        {
          type: "dropdown",

          name: "diagnostico_origen",

          title:
            "Diagnóstico base",

          choices: [],

          placeholder:
            "Seleccione un diagnóstico"
        },

        {
          type: "text",
          name: "mes_anio",
          title: "Mes y año (ej: Enero 2026)"
        }
      ]
    },


    // 2. CONTEXTO ESTRATÉGICO
    {
      name: "CONTEXTO ESTRATÉGICO",
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
          type: "text",
          name: "naturaleza_juridica",
          title: "Naturaleza jurídica"
        },

        {
          type: "comment",
          name: "funciones_principales",
          title: "Funciones principales"
        },

        {
          type: "paneldynamic",
          name: "contexto_adicional",
          title: "Otros elementos estratégicos",
          templateElements: [

            {
              type: "text",
              name: "titulo",
              title: "Título"
            },

            {
              type: "comment",
              name: "contenido",
              title: "Contenido"
            }

          ],

          panelAddText:
            "Agregar elemento"
        }

      ]
    },

    //  3. ASPECTOS CRÍTICOS
    {
      name: "ASPECTOS CRÍTICOS",
      elements: [
        {
          type: "matrixdynamic",
          name: "aspectos_criticos",
          title: "Aspectos críticos",
          columns: [
            { name: "aspecto", title: "Aspecto crítico", cellType: "text" },
            { name: "riesgo", title: "Riesgo asociado", cellType: "text" }
          ],
          addRowText: "Agregar aspecto"
        }
      ]
    },

    // 🟦 4. CALIFICACION EJES ARTICULADORES
    // 🟦 4. ADMINISTRACIÓN DE ARCHIVOS
    {
      name: "ADMINISTRACION_ARCHIVOS",
      elements: [
        {
          type: "matrixdynamic",

          name: "admin_archivos",

          title: "Administración de Archivos",

          allowAddRows: false,
          allowRemoveRows: false,

          columns: [

            {
              name: "aspecto",
              title: "Aspecto crítico",
              cellType: "text",
              readOnly: true
            },

            {
              name: "ciclo_vital",
              title: "Se considera el ciclo vital de los documentos integrando aspectos administrativos, legales, funcionales y técnicos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "instrumentos",
              title: "Se cuenta con todos los instrumentos archivísticos socializados e implementados.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "seguimiento",
              title: "Se cuenta con procesos de seguimiento, evaluación y mejora para la gestión documental.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "politica",
              title: "Se tiene establecida la política de gestión documental.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "electronica",
              title: "Los instrumentos archivísticos involucran la documentación electrónica.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "flujos",
              title: "Se cuenta con procesos y flujos documentales normalizados y medibles.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "documentacion",
              title: "Se documentan procesos o actividades de gestión de documentos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "infraestructura",
              title: "Se cuenta con la infraestructura adecuada para resolver las necesidades documentales y de archivo.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "personal",
              title: "El personal de la entidad conoce la importancia de los documentos e interioriza las políticas y directrices concernientes a la gestión de los documentos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "presupuesto",
              title: "Se cuenta con el presupuesto adecuado para atender las necesidades documentales y de archivo.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "total",
              title: "TOTAL",
              cellType: "text",
              readOnly: true
            }
          ]
        }
      ]
    }
  ]
};

export default pinarConfig;