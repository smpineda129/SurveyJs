import {
  generatePinarIntroduction,
  generatePinarVision,
  generateAspectosCriticosIA,
  generateObjetivosIA,
  generatePlanesIA
} from "../services/gptSummarizer.js";

import Survey
  from "../models/Survey.js";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from "docx";

console.log(generatePinarIntroduction);

export const generatePinarDocx = async (req, res) => {

  try {

    const data = req.body.surveyData || req.body;

    console.log(
      "DATA DOCX:",
      data
    );

    const aspectosCriticos =

      data.aspectos_criticos ||

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
            aspecto: String(value),
            riesgo:
              "Riesgo identificado en el diagnóstico archivístico"
          })
        );

    const matrizCalificacion =
      data.matriz_calificacion || [];

    const priorizados =
      data.priorizacion_criticos || [];

    const objetivos =

      data.objetivos_ia ||

      await generateObjetivosIA(
        aspectosCriticos
      );

    const planesIA =

      data.planes_ia ||

      await generatePlanesIA(
        objetivos
      );

    if (data._id) {

      await Survey.findByIdAndUpdate(

        data._id,

        {

          $set: {

            "surveyData.introduccion_ia":
              introduccionIA,

            "surveyData.vision_ia":
              visionEstrategica,

            "surveyData.objetivos_ia":
              objetivos,

            "surveyData.planes_ia":
              planesIA,

          }

        }

      );

    }

    const riesgos =
      data.riesgos_automaticos || [];

    const planes =
      data.planes_proyectos || [];

    const mapaRuta =
      data.mapa_ruta_generado || [];

    // DATOS GENERALES
    const entidad =

      data.nombre_empresa ||

      data.nombre_entidad ||

      data.NOMBRE_ENTIDAD ||

      data.razon_social ||

      "la entidad";

    const vigencia =
      data.vigencia ||
      new Date().getFullYear();

    const fechaPortada =
      new Date()
        .toLocaleDateString(
          "es-CO",
          {
            month: "long",
            year: "numeric"
          }
        );

    const objetivoGeneral =
      `Lograr en el período ${vigencia}, la implementación de planes y proyectos institucionales orientados al fortalecimiento de la gestión documental, garantizando el cumplimiento de la normatividad archivística vigente y la mejora continua de los procesos documentales de ${entidad}.`;

    const yearStart =
      Number(vigencia);

    const years = [
      yearStart,
      yearStart + 1,
      yearStart + 2,
      yearStart + 3
    ];

    const aspectos =
      aspectosCriticos || [];

    const totalAspectos =
      aspectos.length;

    const totalObjetivos =
      objetivos.length;

    //INTRODUCCIÓN IA
    const introduccionIA =

      data.introduccion_ia ||

      await generatePinarIntroduction(data);

    console.log(introduccionIA);

    // PLANES
    const responsableGeneral =
      "Área de Gestión Documental";

    const indicadorGeneral =
      "Cumplimiento de actividades archivísticas";

    // CONCLUSIONES CONTEXTUALES
    const tieneDigitalizacion =
      aspectos.some((item) =>
        (item.aspecto || "")
          .toLowerCase()
          .includes("digital")
      );

    const tieneTRD =
      aspectos.some((item) =>
        (item.aspecto || "")
          .toLowerCase()
          .includes("trd")
      );

    const tieneOrganizacion =
      aspectos.some((item) =>
        (item.aspecto || "")
          .toLowerCase()
          .includes("organiz")
      );

    // VISIÓN ESTRATÉGICA IA

    const visionEstrategica =

      data.vision_ia ||

      await generatePinarVision(data);

    let conclusionDinamica =
      `De acuerdo con los resultados obtenidos en el diagnóstico archivístico institucional, se identificaron ${totalAspectos} aspectos críticos que requieren fortalecimiento mediante estrategias orientadas a la gestión documental, preservación de la información y fortalecimiento institucional.`;
    if (tieneTRD) {

      conclusionDinamica +=
        ` Se evidenció la necesidad de fortalecer la actualización e implementación de las Tablas de Retención Documental como instrumento fundamental para la organización archivística institucional.`;

    }

    if (tieneDigitalizacion) {

      conclusionDinamica +=
        ` Asimismo, se identificó la necesidad de fortalecer los procesos de digitalización documental y modernización tecnológica para garantizar el acceso y disponibilidad de la información.`;

    }

    if (tieneOrganizacion) {

      conclusionDinamica +=
        ` También se identificaron oportunidades de mejora relacionadas con la organización documental y aplicación de buenas prácticas archivísticas.`;

    }

    let recomendacionDinamica =
      `Se recomienda fortalecer la gestión documental institucional mediante acciones de seguimiento continuo, implementación de instrumentos archivísticos y fortalecimiento de los procesos administrativos relacionados con la función archivística.`;

    if (riesgos.length >= 3) {

      recomendacionDinamica +=
        ` Igualmente, se recomienda priorizar acciones orientadas a mitigar los riesgos documentales identificados durante el diagnóstico archivístico institucional.`;

    }

    const doc = new Document({

      styles: {

        default: {

          heading1: {
            run: {
              font: "Arial",
              size: 28,
              bold: true
            }
          },

          heading2: {
            run: {
              font: "Arial",
              size: 24,
              bold: true
            }
          },

          document: {
            run: {
              font: "Arial",
              size: 24
            }
          }

        }

      },

      sections: [
        {
          children: [

            // PORTADA

            new Paragraph({
              text:
                "PLAN INSTITUCIONAL DE ARCHIVOS - PINAR",

              heading: HeadingLevel.TITLE,

              alignment:
                AlignmentType.CENTER,

              spacing: {
                before: 5000,
                after: 400,
              },
            }),

            new Paragraph({
              text:
                fechaPortada,

              alignment:
                AlignmentType.CENTER,

              spacing: {
                after: 400,
              },
            }),

            new Paragraph({
              text:
                String(entidad),

              alignment:
                AlignmentType.CENTER,

              spacing: {
                after: 200,
              },
            }),

            new Paragraph({
              text:
                String(vigencia),

              alignment:
                AlignmentType.CENTER,
            }),

            // SALTO DE PÁGINA

            new Paragraph({
              pageBreakBefore: true,
            }),

            // TABLA CONTENIDO

            new Paragraph({
              text: "TABLA DE CONTENIDO",

              heading:
                HeadingLevel.HEADING_1,
            }),

            new Paragraph({
              text:
                "1. INTRODUCCIÓN",
            }),

            new Paragraph({
              text:
                "2. CONTEXTO INSTITUCIONAL"
            }),

            new Paragraph({
              text:
                "3. MARCO NORMATIVO",
            }),

            new Paragraph({
              text:
                "4. VISIÓN ESTRATÉGICA DEL PINAR",
            }),

            new Paragraph({
              text:
                "5. ASPECTOS CRÍTICOS",
            }),

            new Paragraph({
              text:
                "6. OBJETIVOS ESTRATÉGICOS",
            }),

            new Paragraph({
              text:
                "7. RIESGOS DOCUMENTALES",
            }),

            new Paragraph({
              text:
                "8. PLANES Y PROYECTOS",
            }),

            new Paragraph({
              text:
                "9. MAPA DE RUTA",
            }),

            new Paragraph({
              text:
                "10. CONCLUSIONES",
            }),

            new Paragraph({
              text:
                "11. RECOMENDACIONES",
            }),

            // OTRO SALTO

            new Paragraph({
              pageBreakBefore: true,
            }),

            // INTRODUCCIÓN
            new Paragraph({
              text: "1. INTRODUCCIÓN",
              heading: HeadingLevel.HEADING_1,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: introduccionIA,
                  size: 24,
                  font: "Arial",
                }),
              ],

              spacing: {
                after: 300,
                line: 360,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            // CONTEXTO INSTITUCIONAL

            new Paragraph({
              text:
                "2. CONTEXTO INSTITUCIONAL",

              heading:
                HeadingLevel.HEADING_1,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Misión institucional: ",
                  bold: true,
                }),
                new TextRun(
                  data.mision || ""
                ),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Visión institucional: ",
                  bold: true,
                }),
                new TextRun(
                  data.vision || ""
                ),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text:
                    "Naturaleza jurídica: ",
                  bold: true,
                }),
                new TextRun(
                  data.naturaleza_juridica || ""
                ),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text:
                    "Funciones principales: ",
                  bold: true,
                }),
                new TextRun(
                  data.funciones_principales || ""
                ),
              ],
            }),
            // CONTEXTO ADICIONAL

            ...(data.contexto_adicional || [])
              .flatMap(item => [

                new Paragraph({
                  children: [
                    new TextRun({
                      text:
                        `${item.titulo}: `,
                      bold: true,
                    }),

                    new TextRun(
                      item.contenido || ""
                    ),
                  ],

                  spacing: {
                    after: 200,
                  },
                }),

              ]),

            //MARCO NORMATIVO
            new Paragraph({
              text:
                "3. MARCO NORMATIVO",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
                after: 300
              }
            }),
            // MARCO NORMATIVO
            new Paragraph({
              children: [

                new TextRun({
                  text:
                    "LEY 594 DE 2000:",
                  bold: true,
                  break: 1
                }),

                new TextRun({
                  text:
                    " Por medio de la cual se dicta la Ley General de Archivos y se dictan otras disposiciones.",
                }),

              ],

              spacing: {
                after: 200,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            new Paragraph({
              children: [

                new TextRun({
                  text:
                    "LEY 1712 DE 2014:",
                  bold: true,
                  break: 1
                }),

                new TextRun({
                  text:
                    " Por medio de la cual se crea la Ley de Transparencia y del Derecho de Acceso a la Información Pública Nacional y se dictan otras disposiciones.",
                }),

              ],

              spacing: {
                after: 200,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            new Paragraph({
              children: [

                new TextRun({
                  text:
                    "DECRETO 1080 DE 2015:",
                  bold: true,
                  break: 1
                }),

                new TextRun({
                  text:
                    " Por medio del cual se expide el Decreto Único Reglamentario del Sector Cultura.",
                }),

              ],

              spacing: {
                after: 200,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            new Paragraph({
              children: [

                new TextRun({
                  text:
                    "DECRETO 1499 DE 2017:",
                  bold: true,
                  break: 1
                }),

                new TextRun({
                  text:
                    " Por medio del cual se modifica el Decreto 1083 de 2015, Decreto Único Reglamentario del Sector Función Pública, en lo relacionado con el Sistema de Gestión establecido en el artículo 133 de la Ley 1753 de 2015.",
                }),

              ],

              spacing: {
                after: 200,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            new Paragraph({
              children: [

                new TextRun({
                  text:
                    "DECRETO 612 DE 2018:",
                  bold: true,
                  break: 1
                }),

                new TextRun({
                  text:
                    " Por el cual se fijan directrices para la integración de los planes institucionales y estratégicos al Plan de Acción por parte de las entidades del Estado.",
                }),

              ],

              spacing: {
                after: 200,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            new Paragraph({
              children: [

                new TextRun({
                  text:
                    "ACUERDO 001 DE 2024:",
                  bold: true,
                  break: 1
                }),

                new TextRun({
                  text:
                    " Por el cual se establece el Acuerdo Único de la Función Archivística, se definen los criterios técnicos y jurídicos para su implementación en el Estado Colombiano y se fijan otras disposiciones.",
                }),

              ],

              spacing: {
                after: 200,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            // VISIÓN ESTRATÉGICA
            new Paragraph({
              text:
                "4. VISIÓN ESTRATÉGICA DEL PINAR",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
              },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: visionEstrategica,
                  size: 24,
                  font: "Arial",
                }),
              ],

              spacing: {
                after: 300,
                line: 360,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            // ASPECTOS CRÍTICOS
            new Paragraph({
              text:
                "5. ASPECTOS CRÍTICOS",

              heading:
                HeadingLevel.HEADING_1,
            }),

            new Table({
              width: {
                size: 100,
                type:
                  WidthType.PERCENTAGE,
              },

              rows: [

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph("N°"),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Aspecto Crítico"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Riesgo"
                        ),
                      ],
                    }),

                  ],
                }),

                ...aspectosCriticos.map(
                  (item, index) =>

                    new TableRow({
                      children: [

                        new TableCell({
                          children: [
                            new Paragraph(
                              String(index + 1)
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              item.aspecto || ""
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              item.riesgo || ""
                            ),
                          ],
                        }),

                      ],
                    })
                ),

              ],
            }),

            // EJES ARTICULADORES
            new Paragraph({
              text:
                "5.2. Ejes articuladores",

              heading:
                HeadingLevel.HEADING_2,

              spacing: {
                before: 300,
                after: 200
              }
            }),

            new Paragraph({
              text:
                "Teniendo en cuenta los principios de la función archivística contemplados en la Ley 594 de 2000, artículo 4, se establecen los siguientes ejes articuladores con los cuales se realiza el análisis de aspectos críticos de la gestión documental institucional, permitiendo su valoración y priorización.",

              alignment:
                AlignmentType.JUSTIFIED,

              spacing: {
                after: 200
              }
            }),

            new Table({

              width: {
                size: 100,
                type:
                  WidthType.PERCENTAGE,
              },

              rows: [

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph("EJE"),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph("DESCRIPCIÓN"),
                      ],
                    }),

                  ],
                }),

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Administración de archivos"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Involucra aspectos de infraestructura, presupuesto, normatividad, política, procesos, procedimientos y personal."
                        ),
                      ],
                    }),

                  ],
                }),

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Acceso a la información"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Comprende aspectos relacionados con transparencia, participación, servicio al ciudadano y organización documental."
                        ),
                      ],
                    }),

                  ],
                }),

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Preservación de la información"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Incluye aspectos relacionados con conservación y almacenamiento de la información."
                        ),
                      ],
                    }),

                  ],
                }),

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Aspectos tecnológicos y de seguridad"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Abarca aspectos relacionados con seguridad de la información e infraestructura tecnológica."
                        ),
                      ],
                    }),

                  ],
                }),

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Fortalecimiento y articulación"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Involucra aspectos relacionados con armonización de la gestión documental y otros modelos de gestión."
                        ),
                      ],
                    }),

                  ],
                }),

              ],

            }),

            new Paragraph({
              text:
                "5.3. Priorización de aspectos críticos",

              heading:
                HeadingLevel.HEADING_2,

              spacing: {
                before: 300,
                after: 200
              }
            }),

            new Paragraph({
              text:
                "Los aspectos críticos institucionales fueron evaluados frente a los ejes articuladores de la gestión documental, permitiendo establecer su nivel de impacto y prioridad para la formulación de planes y proyectos institucionales.",

              alignment:
                AlignmentType.JUSTIFIED,

              spacing: {
                after: 200
              }
            }),

            new Table({

              width: {
                size: 100,
                type:
                  WidthType.PERCENTAGE,
              },

              rows: [

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph("N°"),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Aspecto crítico"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Administración"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Acceso"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Preservación"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Tecnología"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Fortalecimiento"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Total"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Prioridad"
                        ),
                      ],
                    }),

                  ],
                }),

                ...priorizados.map(
                  (item, index) =>

                    new TableRow({
                      children: [

                        new TableCell({
                          children: [
                            new Paragraph(
                              String(item.numero || index + 1)
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              item.aspecto || ""
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              String(item.admin || "")
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              String(item.acceso || "")
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              String(item.preservacion || "")
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              String(item.tecnologia || "")
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              String(item.fortalecimiento || "")
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              String(item.total || "")
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              item.prioridad || ""
                            ),
                          ],
                        }),

                      ],
                    })

                ),

              ],

            }),

            // OBJETIVOS
            new Paragraph({
              text:
                "6. OBJETIVOS ESTRATÉGICOS",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
              },
            }),

            new Paragraph({
              text:
                "6.1. Objetivo general",

              heading:
                HeadingLevel.HEADING_2,

              spacing: {
                before: 200,
                after: 200
              }
            }),

            new Paragraph({
              text:
                objetivoGeneral,

              alignment:
                AlignmentType.JUSTIFIED,

              spacing: {
                after: 300,
              },
            }),

            new Paragraph({
              text:
                "6.2. Objetivos específicos",

              heading:
                HeadingLevel.HEADING_2,

              spacing: {
                before: 200,
                after: 200
              }
            }),

            ...objetivos.map((item) =>

              new Paragraph({
                text:
                  `• ${item.objetivo}`,
              })

            ),

            // PLANES Y PROYECTOS
            new Paragraph({
              text:
                "7. FORMULACIÓN DE PLANES Y PROYECTOS",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
                after: 200
              }
            }),

            new Paragraph({
              text:
                "Con base en los aspectos críticos identificados, se definieron los planes y proyectos institucionales orientados al fortalecimiento de la gestión documental, siguiendo lineamientos archivísticos y metodologías institucionales para la formulación de proyectos.",

              alignment:
                AlignmentType.JUSTIFIED,

              spacing: {
                after: 300
              }
            }),

            ...planesIA.flatMap(
              (plan, index) => [

                new Paragraph({
                  text:
                    `7.${index + 1}. ${plan.proyecto}`,

                  heading:
                    HeadingLevel.HEADING_2,

                  spacing: {
                    before: 300,
                    after: 200
                  }
                }),

                new Paragraph({
                  text:
                    plan.descripcion ||

                    "",

                  alignment:
                    AlignmentType.JUSTIFIED,

                  spacing: {
                    after: 200
                  }
                }),

                new Table({

                  width: {
                    size: 100,
                    type:
                      WidthType.PERCENTAGE,
                  },

                  rows: [

                    new TableRow({
                      children: [

                        new TableCell({
                          children: [
                            new Paragraph(
                              "N°"
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              "Actividad"
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              "Responsable"
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              "Recursos"
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(
                              "Plazo"
                            ),
                          ],
                        }),

                      ],
                    }),

                    ...plan.actividades.map(
                      (
                        actividad,
                        idx
                      ) =>

                        new TableRow({
                          children: [

                            new TableCell({
                              children: [
                                new Paragraph(
                                  String(idx + 1)
                                ),
                              ],
                            }),

                            new TableCell({
                              children: [
                                new Paragraph(
                                  actividad
                                ),
                              ],
                            }),

                            new TableCell({
                              children: [
                                new Paragraph(
                                  "Gestión Documental"
                                ),
                              ],
                            }),

                            new TableCell({
                              children: [
                                new Paragraph(
                                  "Talento humano, herramientas archivísticas y recursos administrativos"
                                ),
                              ],
                            }),

                            new TableCell({
                              children: [
                                new Paragraph(
                                  "Mediano plazo"
                                ),
                              ],
                            }),

                          ],
                        })

                    ),

                  ],

                }),

              ]
            ),

            // MAPA DE RUTA
            new Paragraph({
              text:
                "8. MAPA DE RUTA",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
              },
            }),

            new Paragraph({
              text:
                "El mapa de ruta consolida la asignación de tiempos para la ejecución de los planes y proyectos definidos en el presente PINAR, permitiendo establecer acciones a corto, mediano y largo plazo.",

              alignment:
                AlignmentType.JUSTIFIED,

              spacing: {
                after: 300
              }
            }),

            new Table({

              width: {
                size: 100,
                type:
                  WidthType.PERCENTAGE,
              },

              rows: [

                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Plan o Proyecto"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          String(years[0])
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          String(years[1])
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          String(years[2])
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          String(years[3])
                        ),
                      ],
                    }),

                  ],
                }),

                // FILAS DINÁMICAS
                ...planesIA.map(
                  (plan, index) => {

                    let y1 = "";
                    let y2 = "";
                    let y3 = "";
                    let y4 = "";

                    if (index % 3 === 0) {

                      y1 = "X";
                      y2 = "X";

                    }

                    else if (
                      index % 3 === 1
                    ) {

                      y2 = "X";
                      y3 = "X";

                    }

                    else {

                      y3 = "X";
                      y4 = "X";

                    }

                    return new TableRow({
                      children: [

                        new TableCell({
                          children: [
                            new Paragraph(
                              plan.proyecto || ""
                            ),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(y1),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(y2),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(y3),
                          ],
                        }),

                        new TableCell({
                          children: [
                            new Paragraph(y4),
                          ],
                        }),

                      ],
                    });

                  }

                ),

              ],

            }),

            // CONCLUSIONES
            new Paragraph({
              text: "9. CONCLUSIONES",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
              },
            }),

            new Paragraph({
              text: conclusionDinamica,

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            // RECOMENDACIONES
            new Paragraph({
              text:
                "10. RECOMENDACIONES",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
              },
            }),

            new Paragraph({
              text:
                recomendacionDinamica,

              alignment:
                AlignmentType.JUSTIFIED,
            }),
          ],
        },
      ],
    });

    const buffer =
      await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=PINAR.docx"
    );

    res.send(buffer);

  } catch (error) {

    console.error(
      "ERROR DOCX:",
      error
    );

    res.status(500).json({

      message:
        String(error),

      stack:
        error?.stack || "NO STACK",

      name:
        error?.name || "NO NAME"

    });

  }
};

export const
  generateAspectosCriticos =
    async (req, res) => {

      try {

        const {
          observaciones
        } = req.body;

        if (!observaciones) {

          throw new Error(
            JSON.stringify(req.body)
          );

        }
        console.log(
          "OBSERVACIONES:",
          observaciones
        );

        const aspectos =
          await generateAspectosCriticosIA(
            observaciones
          );

        res.json({
          success: true,
          data: aspectos
        });

      } catch (error) {

        console.error(
          "ERROR GENERANDO ASPECTOS:",
          error
        );

        res.status(500).json({

          success: false,

          error:
            "Error generando aspectos críticos"

        });

      }

    };

export const
  generatePinarIA =
    async (req, res) => {

      try {

        const data =
          req.body;

        const aspectosCriticos =

          data.aspectos_criticos?.length

            ? data.aspectos_criticos

            : Object.entries(data)
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
                  aspecto:
                    String(value),

                  riesgo:
                    "Riesgo identificado en el diagnóstico archivístico"
                })
              );

        const introduccionIA =
          await generatePinarIntroduction(data);

        const visionIA =
          await generatePinarVision(data);

        const objetivosIA =
          await generateObjetivosIA(
            aspectosCriticos
          );

        const planesIA =
          await generatePlanesIA(
            objetivosIA
          );

        res.json({

          success: true,

          data: {

            introduccion_ia:
              introduccionIA,

            vision_ia:
              visionIA,

            objetivos_ia:
              objetivosIA,

            planes_ia:
              planesIA

          }

        });

      } catch (error) {

        console.error(
          "ERROR IA PINAR:",
          error
        );

        res.status(500).json({

          success: false,

          error:
            "Error generando IA del PINAR"

        });

      }

    };