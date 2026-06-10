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
    {
      name: "ADMINISTRACION_ARCHIVOS",
      elements: [
        {
          type: "matrixdynamic",
          name: "admin_archivos",
          title: "Administración de Archivos",
          columns: [
            {
              name: "aspecto",
              title: "Aspecto crítico",
              cellType: "text",
              readOnly: true
            },
            {
              name: "criterio1",
              title: "¿Se consideran instrumentos archivísticos?",
              cellType: "dropdown",
              choices: [0, 1]
            }
          ]
        }
      ]
    }
  ]
};

export default pinarConfig;