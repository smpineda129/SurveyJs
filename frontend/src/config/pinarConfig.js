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

    // 2. INTRODUCCIÓN
    {
      name: "introduccion",
      elements: [
        {
          type: "html",
          html: `
          <h3>1. Introducción</h3>
          <p>
          La {nombre_empresa}, como entidad del Estado que cumple una función pública...
          </p>
          `
        },
        {
          type: "text",
          name: "vigencia",
          title: "Vigencia del plan (ej: 2025-2028)"
        }
      ]
    },

    //  3. ALCANCE
    {
      name: "alcance",
      elements: [
        {
          type: "html",
          html: `
          <h3>2. Alcance</h3>
          <p>
          El PINAR del {nombre_empresa} se proyectará para las vigencias {vigencia}...
          </p>
          `
        }
      ]
    },

    // 4. CONTEXTO ESTRATÉGICO
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

    // 5. ¿TENÍA PINAR ANTERIOR?
    {
      name: "pinar_anterior",
      elements: [
        {
          type: "radiogroup",
          name: "tenia_pinar",
          title: "¿La entidad ha tenido PINAR anteriormente?",
          choices: ["Si", "No"]
        }
      ]
    },

    // 6. ANÁLISIS (CONDICIONAL)
    {
      name: "analisis",
      visibleIf: "{tenia_pinar} = 'Si'",
      elements: [
        {
          type: "html",
          html: `
          <h3>4. Análisis de la situación actual</h3>
          <p>
          Con el objeto de fortalecer la política archivística...
          </p>
          `
        },
        {
          type: "file",
          name: "evidencia_anterior",
          title: "Subir imagen del plan anterior"
        }
      ]
    },

    //  7. ASPECTOS CRÍTICOS
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

    //  8. EJES ARTICULADORES
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

    // 🟦 9. MATRIZ DE CALIFICACIÓN
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
        },
        {
          type: "matrixdynamic",
          name: "objetivos_estrategicos",
          title: "Objetivos estratégicos",
          columns: [
            {
              name: "aspecto",
              title: "Aspecto crítico",
              cellType: "text",
              readOnly: true
            },
            {
              name: "objetivo",
              title: "Objetivo estratégico",
              cellType: "comment",
              readOnly: true
            }
          ]
        },
        {
          type: "matrixdynamic",
          name: "riesgos_automaticos",
          title: "Riesgos asociados",
          columns: [
            {
              name: "aspecto",
              title: "Aspecto crítico",
              cellType: "text",
              readOnly: true
            },
            {
              name: "riesgo",
              title: "Riesgo asociado",
              cellType: "comment",
              readOnly: true
            }
          ]
        },
        {
          type: "matrixdynamic",
          name: "planes_proyectos",
          title: "Planes y proyectos sugeridos",
          columns: [
            {
              name: "aspecto",
              title: "Aspecto crítico",
              cellType: "text",
              readOnly: true
            },
            {
              name: "plan",
              title: "Plan o proyecto",
              cellType: "text",
              readOnly: true
            },
            {
              name: "actividad",
              title: "Actividad principal",
              cellType: "comment",
              readOnly: true
            }
          ]
        }
      ]
    },

    //  10. VISIÓN ESTRATÉGICA
    {
      name: "vision",
      elements: [
        {
          type: "html",
          html: `
          <h3>Visión estratégica</h3>
          <p>
          La {nombre_empresa}, a través del PINAR, busca...
          </p>
          `
        }
      ]
    },

    //  11. OBJETIVOS
    {
      name: "objetivos",
      elements: [
        {
          type: "comment",
          name: "objetivo_general",
          title: "Objetivo general"
        },
        {
          type: "paneldynamic",
          name: "objetivos_especificos",
          title: "Objetivos específicos",
          templateElements: [
            {
              type: "text",
              name: "objetivo",
              title: "Objetivo"
            }
          ]
        }
      ]
    },

    // 12. PLANES Y PROYECTOS
    {
      name: "planes",
      elements: [
        {
          type: "paneldynamic",
          name: "planes_proyectos",
          title: "Planes y proyectos",
          templateElements: [
            {
              type: "text",
              name: "nombre",
              title: "Nombre del proyecto"
            },
            {
              type: "comment",
              name: "alcance",
              title: "Alcance"
            }
          ]
        }
      ]
    },

    //  13. MAPA DE RUTA
    {
      name: "mapa",
      elements: [
        {
          type: "matrixdynamic",
          name: "mapa_ruta",
          title: "Mapa de ruta",
          columns: [
            { name: "plan", title: "Plan o proyecto" },
            { name: "corto", title: "Corto plazo (1 año)" },
            { name: "mediano", title: "Mediano plazo (1-4 años)" },
            { name: "largo", title: "Largo plazo" }
          ]
        }
      ]
    },

    // 14. MEDICIÓN
    {
      name: "medicion",
      elements: [
        {
          type: "matrixdynamic",
          name: "medicion",
          title: "Herramienta de medición",
          columns: [
            { name: "indicador", title: "Indicador" },
            { name: "meta", title: "Meta" },
            { name: "t1", title: "T1" },
            { name: "t2", title: "T2" },
            { name: "t3", title: "T3" },
            { name: "t4", title: "T4" }
          ]
        }
      ]
    }

  ]
};

export default pinarConfig;