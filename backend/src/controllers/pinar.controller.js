import {
  generatePinarIntroduction,
  generatePinarVision
} from "../services/gptSummarizer.js";

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

    const priorizados =
      data.priorizacion_criticos || [];

    const objetivos =
      data.objetivos_estrategicos || [];

    const riesgos =
      data.riesgos_automaticos || [];

    const planes =
      data.planes_proyectos || [];

    const mapaRuta =
      data.mapa_ruta_generado || [];

    // DATOS GENERALES
    const entidad =
      data.nombre_empresa ||
      "la entidad";

    const vigencia =
      data.vigencia ||
      new Date().getFullYear();

    const aspectos =
      data.aspectos_criticos || [];

    const totalAspectos =
      aspectos.length;

    const totalObjetivos =
      objetivos.length;

    console.log("LLAMANDO GPT PINAR");

    //INTRODUCCIÓN IA
    const introduccionIA =
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
      sections: [
        {
          children: [

            // PORTADA
            new Paragraph({
              text:
                "PLAN INSTITUCIONAL DE ARCHIVOS - PINAR",

              heading: HeadingLevel.TITLE,

              alignment: AlignmentType.CENTER,

              spacing: {
                after: 400,
              },
            }),

            new Paragraph({
              text:
                data.nombre_empresa ||
                data.entidad ||
                data.nombreEntidad ||
                "NOMBRE DE LA ENTIDAD",

              alignment: AlignmentType.CENTER,

              spacing: {
                after: 200,
              },
            }),

            new Paragraph({
              text:
                new Date()
                  .getFullYear()
                  .toString(),

              alignment: AlignmentType.CENTER,

              spacing: {
                after: 800,
              },
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
                  font: "Times New Roman",
                }),
              ],

              spacing: {
                after: 300,
                line: 360,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            // MARCO NORMATIVO
            new Paragraph({
              text: "2. MARCO NORMATIVO",
              heading: HeadingLevel.HEADING_1,
            }),

            new Paragraph({
              text:
                "El presente PINAR se fundamenta en la Ley 594 de 2000, la Ley 1712 de 2014, el Decreto 1080 de 2015 y los lineamientos emitidos por el Archivo General de la Nación.",

              spacing: {
                after: 300,
              },

              alignment:
                AlignmentType.JUSTIFIED,
            }),

            // VISIÓN ESTRATÉGICA
            new Paragraph({
              text:
                "3. VISIÓN ESTRATÉGICA DEL PINAR",

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
                  font: "Times New Roman",
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
                "4. ASPECTOS CRÍTICOS",

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
                "5. OBJETIVOS ESTRATÉGICOS",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
              },
            }),

            ...objetivos.map((item) =>

              new Paragraph({
                text:
                  `• ${item.objetivo}`,
              })

            ),

            // RIESGOS
            new Paragraph({
              text:
                "6. RIESGOS DOCUMENTALES",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
              },
            }),

            ...riesgos.map((item) =>

              new Paragraph({
                text:
                  `• ${item.descripcion || item.riesgo || ""}`,
              })

            ),

            // PLANES
            new Paragraph({
              text:
                "7. PLANES Y PROYECTOS",

              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 400,
              },
            }),

            new Table({
              width: {
                size: 100,
                type:
                  WidthType.PERCENTAGE,
              },

              rows: [

                // ENCABEZADOS
                new TableRow({
                  children: [

                    new TableCell({
                      children: [
                        new Paragraph(
                          "Plan / Proyecto"
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
                          "Indicador"
                        ),
                      ],
                    }),

                  ],
                }),

                // FILAS
                ...planes.map((item) =>

                  new TableRow({
                    children: [

                      new TableCell({
                        children: [
                          new Paragraph(
                            item.plan || ""
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            item.actividad || ""
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            responsableGeneral
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            indicadorGeneral
                          ),
                        ],
                      }),

                    ],
                  })

                ),

              ],
            }),

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
                          "Plan"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "2026"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "2027"
                        ),
                      ],
                    }),

                    new TableCell({
                      children: [
                        new Paragraph(
                          "2028"
                        ),
                      ],
                    }),

                  ],
                }),

                ...mapaRuta.map((item) =>

                  new TableRow({
                    children: [

                      new TableCell({
                        children: [
                          new Paragraph(
                            item.plan || ""
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            item.vigencia1 || ""
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            item.vigencia2 || ""
                          ),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph(
                            item.vigencia3 || ""
                          ),
                        ],
                      }),

                    ],
                  })

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

    console.error(error);

    res.status(500).json({
      message:
        "Error generando documento",
    });

  }
};