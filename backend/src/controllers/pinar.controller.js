import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel
} from "docx";

export const generatePinarDocx = async (req, res) => {

  try {

    const data = req.body.surveyData || req.body;

    const doc = new Document({
      sections: [
        {
          children: [

            // PORTADA
            new Paragraph({
              text: "PLAN INSTITUCIONAL DE ARCHIVOS - PINAR",
              heading: HeadingLevel.TITLE,
              spacing: {
                after: 400
              }
            }),

            new Paragraph({
              text: data.nombre_empresa || "NOMBRE DE LA EMPRESA",
              spacing: {
                after: 300
              }
            }),

            new Paragraph({
              text: new Date().getFullYear().toString(),
              spacing: {
                after: 600
              }
            }),

            // INTRODUCCIÓN
            new Paragraph({
              text: "1. INTRODUCCIÓN",
              heading: HeadingLevel.HEADING_1
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text:
                    `La ${data.nombre_empresa || "entidad"} desarrolla el presente Plan Institucional de Archivos - PINAR con el propósito de fortalecer la gestión documental institucional y establecer acciones orientadas al mejoramiento archivístico.`,
                })
              ]
            }),

            // ASPECTOS CRÍTICOS
            new Paragraph({
              text: "2. ASPECTOS CRÍTICOS",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400
              }
            }),

            ...(data.priorizacion_criticos || []).map(item =>
              new Paragraph({
                text: `• ${item.aspecto} (${item.prioridad})`
              })
            ),

            // OBJETIVOS
            new Paragraph({
              text: "3. OBJETIVOS ESTRATÉGICOS",
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400
              }
            }),

            ...(data.objetivos_estrategicos || []).map(item =>
              new Paragraph({
                text: `• ${item.objetivo}`
              })
            )

          ]
        }
      ]
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
      message: "Error generando documento"
    });

  }
};