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

    // INTRODUCCIÓN DINÁMICA
    const introduccionIA =
      `${entidad} formula el presente Plan Institucional de Archivos - PINAR para la vigencia ${vigencia}, con el propósito de fortalecer la gestión documental institucional, mejorar la administración de la información y garantizar el cumplimiento de la normatividad archivística vigente. El presente instrumento archivístico se desarrolla teniendo en cuenta ${totalAspectos} aspectos críticos identificados en la función archivística institucional y ${totalObjetivos} objetivos estratégicos orientados al fortalecimiento de la preservación documental, el acceso a la información y la modernización de los procesos archivísticos.`;

    // VISIÓN ESTRATÉGICA
    const visionEstrategica =
      `La ${entidad} orientará sus esfuerzos al fortalecimiento de la gestión documental institucional mediante la implementación de estrategias archivísticas orientadas a la preservación documental, organización de la información, fortalecimiento tecnológico y mejora continua de los procesos de acceso y administración documental, con el fin de garantizar la transparencia, conservación y disponibilidad de la información institucional.`;

    // PLANES
    const responsableGeneral =
      "Área de Gestión Documental";

    const indicadorGeneral =
      "Cumplimiento de actividades archivísticas";

    // CONCLUSIONES DINÁMICAS
    const conclusionDinamica =
      `De acuerdo con los resultados obtenidos en el diagnóstico archivístico institucional, se identificaron ${totalAspectos} aspectos críticos que requieren fortalecimiento mediante la implementación de estrategias orientadas a la organización documental, preservación de la información, actualización de instrumentos archivísticos y fortalecimiento de la gestión documental institucional.`;

    const recomendacionDinamica =
      `Se recomienda fortalecer los procesos archivísticos institucionales mediante acciones de seguimiento continuo, implementación de instrumentos archivísticos, capacitación al personal y adopción de estrategias orientadas a garantizar el acceso, preservación y seguridad de la información institucional.`;

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