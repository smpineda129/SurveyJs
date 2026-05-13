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

    throw new Error("TEST JSON");
    return;

    const priorizados = data.priorizacion_criticos || [];
    const objetivos = data.objetivos_estrategicos || [];
    const riesgos =
      data.riesgos_documentales ||
      data.riesgos_generados ||
      [];
    const planes =
      data.planes_mejoramiento ||
      data.planes_generados ||
      [];
    const mapaRuta = data.mapa_ruta_generado || [];

    const doc = new Document({
      sections: [
        {
          children: [

            // PORTADA
            new Paragraph({
              text: "PLAN INSTITUCIONAL DE ARCHIVOS - PINAR",
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
              text: new Date().getFullYear().toString(),
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
                  text:
                    `La ${data.nombre_empresa || "entidad"} formula el presente Plan Institucional de Archivos - PINAR con el propósito de fortalecer la gestión documental institucional, mejorar la administración de la información y garantizar el cumplimiento de la normatividad archivística vigente.`,
                }),
              ],
              spacing: {
                after: 300,
              },
            }),

            // MARCO NORMATIVO
            new Paragraph({
              text: "2. MARCO NORMATIVO",
              heading: HeadingLevel.HEADING_1,
            }),

            new Paragraph({
              text:
                "El presente PINAR se fundamenta en la Ley 594 de 2000, el Decreto 1080 de 2015 y los lineamientos emitidos por el Archivo General de la Nación.",
              spacing: {
                after: 300,
              },
            }),

            // ASPECTOS CRÍTICOS
            new Paragraph({
              text: "3. ASPECTOS CRÍTICOS",
              heading: HeadingLevel.HEADING_1,
            }),

            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("N°")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Aspecto Crítico")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Prioridad")],
                    }),
                  ],
                }),

                ...priorizados.map((item, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph(String(index + 1)),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(item.aspecto || ""),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(item.prioridad || ""),
                        ],
                      }),
                    ],
                  })
                ),
              ],
            }),

            // OBJETIVOS
            new Paragraph({
              text: "4. OBJETIVOS ESTRATÉGICOS",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400,
              },
            }),

            ...objetivos.map((item) =>
              new Paragraph({
                text: `• ${item.objetivo}`,
              })
            ),

            // RIESGOS
            new Paragraph({
              text: "5. RIESGOS DOCUMENTALES",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400,
              },
            }),

            ...riesgos.map((item) =>
              new Paragraph({
                text: `• ${item.riesgo}`,
              })
            ),

            // PLANES
            new Paragraph({
              text: "6. PLANES Y PROYECTOS",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400,
              },
            }),

            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Plan")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Objetivo")],
                    }),
                  ],
                }),

                ...planes.map((item) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph(item.plan || ""),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(item.objetivo || ""),
                        ],
                      }),
                    ],
                  })
                ),
              ],
            }),

            // MAPA DE RUTA
            new Paragraph({
              text: "7. MAPA DE RUTA",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400,
              },
            }),

            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Plan")],
                    }),
                    new TableCell({
                      children: [new Paragraph("2026")],
                    }),
                    new TableCell({
                      children: [new Paragraph("2027")],
                    }),
                    new TableCell({
                      children: [new Paragraph("2028")],
                    }),
                  ],
                }),

                ...mapaRuta.map((item) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph(item.plan || ""),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(item.vigencia1 || ""),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(item.vigencia2 || ""),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(item.vigencia3 || ""),
                        ],
                      }),
                    ],
                  })
                ),
              ],
            }),

            // CONCLUSIONES
            new Paragraph({
              text: "8. CONCLUSIONES",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400,
              },
            }),

            new Paragraph({
              text:
                "La entidad requiere fortalecer los procesos archivísticos mediante estrategias orientadas a la organización documental, implementación de instrumentos archivísticos y fortalecimiento de la gestión de la información.",
            }),

            // RECOMENDACIONES
            new Paragraph({
              text: "9. RECOMENDACIONES",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400,
              },
            }),

            new Paragraph({
              text:
                "Se recomienda implementar acciones de seguimiento periódico, fortalecer la capacitación archivística y asegurar el cumplimiento de la normatividad documental vigente.",
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

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
      message: "Error generando documento",
    });
  }
};