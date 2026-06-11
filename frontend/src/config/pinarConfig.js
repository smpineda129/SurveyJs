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

    // 4. CALIFICACION EJES ARTICULADORES
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
    },

    {
      name: "ACCESO_INFORMACION",
      elements: [
        {
          type: "matrixdynamic",
          name: "acceso_informacion",
          title: "Acceso a la Información",
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
              name: "politicas",
              title: "Se cuenta con políticas que garanticen la disponibilidad y accesibilidad de la información.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "personal",
              title: "Se cuenta con personal idóneo y suficiente para atender las necesidades documentales y de archivo de los ciudadanos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "comunicacion",
              title: "Se cuenta con esquemas de comunicación en la entidad para difundir la importancia de la gestión de documentos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "capacitacion",
              title: "Se cuentan con esquemas de capacitación e información internos para la gestión de documentos articulados con el PIC.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "instrumentos",
              title: "Se cuenta con instrumentos archivísticos de descripción y clasificación para sus archivos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "herramientas",
              title: "El personal hace buen uso de las herramientas tecnológicas destinadas a la administración de la información.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "usuarios",
              title: "Se ha establecido la caracterización de usuarios de acuerdo con sus necesidades de información.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "nuevas_tecnologias",
              title: "Se cuenta con iniciativas para fomentar el uso de nuevas tecnologías para optimizar el uso del papel.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "gel",
              title: "Se tiene implementada la estrategia de Gobierno en Línea.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "canales",
              title: "Se cuenta con canales de servicio, atención y orientación al ciudadano.",
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
    },

    {
      name: "PRESERVACION_INFORMACION",
      elements: [
        {
          type: "matrixdynamic",
          name: "preservacion_informacion",
          title: "Preservación de la Información",

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
              name: "procesos_preservacion",
              title: "Se cuenta con procesos y herramientas normalizados para la preservación y conservación a largo plazo de los documentos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "metadatos",
              title: "Se cuenta con un esquema de metadatos integrado a otros sistemas de gestión.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "archivos_centrales",
              title: "Se cuenta con archivos centrales e históricos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "normativa",
              title: "La conservación y preservación se basa en la normativa y requisitos legales, administrativos y técnicos aplicables.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "sic",
              title: "Se cuenta con un Sistema Integrado de Conservación (SIC).",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "infraestructura",
              title: "Se cuenta con infraestructura adecuada para almacenamiento, conservación y preservación documental.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "valoracion",
              title: "Se cuenta con procesos documentados de valoración y disposición final.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "estandares",
              title: "Se tienen implementados estándares que garanticen la preservación y conservación de los documentos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "migracion",
              title: "Se cuenta con esquemas de migración y conversión normalizados.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "continuidad",
              title: "Se cuenta con modelos o esquemas de continuidad del negocio.",
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
    },

    {
      name: "TECNOLOGIA_SEGURIDAD",
      elements: [
        {
          type: "matrixdynamic",
          name: "tecnologia_seguridad",
          title: "Aspectos Tecnológicos y de Seguridad",

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
              name: "politicas_seguridad",
              title: "Se cuenta con políticas asociadas a herramientas tecnológicas que respalden la seguridad, accesibilidad, integridad y autenticidad de la información.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "herramientas",
              title: "Se cuenta con herramientas tecnológicas acordes a las necesidades de la entidad.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "confidencialidad",
              title: "Se cuenta con acuerdos de confidencialidad y políticas de protección de datos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "adopcion_tecnologias",
              title: "Se cuenta con políticas que permitan adoptar tecnologías orientadas a la gestión documental.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "aplicaciones",
              title: "Las aplicaciones son capaces de generar y gestionar documentos de valor archivístico.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "gestion_informacion",
              title: "Se encuentra estandarizada la administración y gestión de la información.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "mecanismos_tecnicos",
              title: "Se cuenta con mecanismos técnicos que permitan mejorar la adquisición, uso y mantenimiento de herramientas tecnológicas.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "servicio_ciudadano",
              title: "Se cuenta con tecnología asociada al servicio al ciudadano.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "riesgos",
              title: "Se cuenta con modelos para la identificación, evaluación y análisis de riesgos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "directrices_seguridad",
              title: "Se cuenta con directrices de seguridad de información relacionadas con el recurso humano, entorno físico y electrónico.",
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
    },

    {
      name: "FORTALECIMIENTO_ARTICULACION",
      elements: [
        {
          type: "matrixdynamic",
          name: "fortalecimiento_articulacion",
          title: "Fortalecimiento y Articulación",

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
              name: "mipg",
              title: "La gestión documental se encuentra implementada acorde con el Modelo Integrado de Planeación y Gestión.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "articulacion_politica",
              title: "Se tiene articulada la política de gestión documental con los sistemas y modelos de gestión de la entidad.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "alianzas",
              title: "Se cuenta con alianzas estratégicas que permitan mejorar e innovar la función archivística.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "marco_legal",
              title: "Se aplica el marco legal y normativo concerniente a la función archivística.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "sgd",
              title: "Se cuenta con un Sistema de Gestión Documental basado en estándares nacionales e internacionales.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "gestion_cambio",
              title: "Se tienen implementadas acciones para la gestión del cambio.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "mejora_continua",
              title: "Se cuenta con procesos de mejora continua.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "instancias_asesoras",
              title: "Se cuenta con instancias asesoras que formulen lineamientos para la aplicación de la función archivística.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "roles",
              title: "Se tienen identificados los roles y responsabilidades del personal y las áreas frente a los documentos.",
              cellType: "dropdown",
              choices: [0, 1]
            },

            {
              name: "alta_direccion",
              title: "La alta dirección está comprometida con el desarrollo de la función archivística.",
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
    },

    // TABLA PRIORIDADES
    {
      name: "PRIORIDADES",
      elements: [
        {
          type: "matrixdynamic",
          name: "priorizacion_criticos",
          title: "Aspectos críticos priorizados",
          allowAddRows: false,
          allowRemoveRows: false,
          columns: [
            {
              name: "numero",
              title: "N°",
              cellType: "text",
              readOnly: true
            },
            {
              name: "aspecto",
              title: "Aspecto crítico",
              cellType: "text",
              readOnly: true
            },
            {
              name: "admin",
              title: "Administración",
              cellType: "text",
              readOnly: true
            },
            {
              name: "acceso",
              title: "Acceso",
              cellType: "text",
              readOnly: true
            },
            {
              name: "preservacion",
              title: "Preservación",
              cellType: "text",
              readOnly: true
            },
            {
              name: "tecnologia",
              title: "Tecnología",
              cellType: "text",
              readOnly: true
            },
            {
              name: "fortalecimiento",
              title: "Fortalecimiento",
              cellType: "text",
              readOnly: true
            },
            {
              name: "total",
              title: "TOTAL",
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