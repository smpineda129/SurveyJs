const pinarConfig = {
  title: "PLAN INSTITUCIONAL DE ARCHIVOS – PINAR",
  showProgressBar: "top",
  progressBarType: "buttons",
  showQuestionNumbers: "off",

  pages: [

    //  1. PORTADA
    {
      name: "portada",
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
          type: "text",
          name: "mes_anio",
          title: "Mes y año (ej: Enero 2026)"
        }
      ]
    },


    // 2. CONTEXTO ESTRATÉGICO
    {
      name: "contexto",
      elements: [
        {
          type: "paneldynamic",
          name: "contexto_estrategico",
          title: "3. Contexto estratégico",
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
          panelAddText: "Agregar ítem"
        }
      ]
    },

    //  3. ASPECTOS CRÍTICOS
    {
      name: "aspectos",
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

    //  4. EJES ARTICULADORES
    {
      name: "ejes",
      elements: [
        {
          type: "html",
          html: `
          <h3>Ejes articuladores</h3>
          <ul>
            <li>Administración de archivos</li>
            <li>Acceso a la información</li>
            <li>Preservación de la información</li>
            <li>Aspectos tecnológicos y de seguridad</li>
            <li>Fortalecimiento y articulación</li>
          </ul>
          `
        }
      ]
    },

    // 🟦 5. MATRIZ DE CALIFICACIÓN
    {
      name: "calificacion",
      elements: [
        {
          type: "matrixdynamic",
          name: "matriz_calificacion",
          title: "Calificación de aspectos",
          columns: [
            { name: "aspecto", title: "Aspecto crítico", cellType: "text" },
            { name: "admin", title: "Administración de archivos", cellType: "text" },
            { name: "acceso", title: "Acceso a la información", cellType: "text" },
            { name: "preservacion", title: "Preservación de la Información", cellType: "text" },
            { name: "tecnologia", title: "Aspectos Tecnológicos y de Seguridad", cellType: "text" },
            { name: "fortalecimiento", title: "Fortalecimiento y Articulación", cellType: "text" },
            {
              name: "total",
              title: "TOTAL",
              cellType: "text",
              readOnly: true
            }
          ]
        },
        {
          type: "matrixdynamic",
          name: "priorizacion_criticos",
          title: "Aspectos críticos priorizados",
          columns: [
            {
              name: "numero",
              title: "N°",
              cellType: "text",
              readOnly: true
            },
            {
              name: "aspecto",
              title: "Aspecto crítico priorizado",
              cellType: "text",
              readOnly: true
            },
            {
              name: "prioridad",
              title: "Prioridad",
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