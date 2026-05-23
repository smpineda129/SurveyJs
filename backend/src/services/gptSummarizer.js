import OpenAI from 'openai';

/**
 * Sintetiza observaciones de una sección del diagnóstico usando GPT.
 * @param {string} sectionTitle - Nombre de la sección
 * @param {Array<{key, title, value, observation}>} items - Items con observación
 * @returns {Promise<string[]>} Array de 3–5 bullets, o [] si no hay obs o falla
 */
export async function summarizeObservaciones(sectionTitle, items) {
  const obsItems = (items || []).filter(i => i.observation?.trim());
  if (obsItems.length === 0) return [];

  const obsText = obsItems
    .map(i => `- [${i.key}] ${i.title} (${i.value}): ${i.observation}`)
    .join('\n');

  const prompt = `Eres un experto en gestión documental archivística. Analiza las siguientes observaciones de la sección "${sectionTitle}" de un diagnóstico institucional y genera exactamente 3 a 5 puntos clave en español. Cada punto debe ser una oración concisa que sintetice hallazgos, riesgos o recomendaciones prioritarias. Responde SOLO con los puntos, uno por línea, sin numeración ni viñetas adicionales.

Observaciones:
${obsText}`;

  try {
    const client = new OpenAI({ apiKey: process.env.GPT_API });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.4,
    });
    const text =
      response?.choices?.[0]?.message?.content;

    if (!text) {

      console.error(
        'GPT EMPTY RESPONSE'
      );

      return [];

    }
    return text
      .trim()
      .split('\n').filter(l => l.trim().length > 0).slice(0, 5);
  } catch (err) {
    console.error('GPT summarizer error:', err.message);
    return [];
  }
}

export async function generatePlanAccionIA(
  sectionTitle,
  items
) {

  const obsItems =
    (items || [])
      .filter(i =>
        i.observation?.trim()
      );

  if (obsItems.length === 0)
    return [];

  const obsText =
    obsItems
      .map(i =>
        `- ${i.title}: ${i.observation}`
      )
      .join('\n');

  const prompt = `
Eres un experto archivístico colombiano.

Analiza los siguientes hallazgos y genera
máximo 5 acciones concretas de mejora.

Responde SOLO con una acción por línea.
No uses numeración.

Hallazgos:
${obsText}
`;

  try {

    const client =
      new OpenAI({
        apiKey:
          process.env.GPT_API
      });

    const response =
      await client.chat.completions.create({

        model: 'gpt-4o-mini',

        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],

        max_tokens: 400,

        temperature: 0.4,
      });

    const text =
      response?.choices?.[0]?.message?.content;

    if (!text)
      return [];

    return text
      .trim()
      .split('\n')
      .filter(line =>
        line.trim().length > 0
      );

  } catch (err) {

    console.error(
      'GPT PLAN ERROR:',
      err.message
    );

    return [];

  }

}

export async function
  generateAspectosCriticosIA(
    observaciones
  ) {

  if (
    !observaciones ||
    observaciones.length === 0
  ) {

    return [];

  }

  const obsText =
    observaciones
      .map(
        (o) =>
          `- ${o.observacion}`
      )
      .join("\n");

  const prompt = `

Eres un experto archivístico colombiano especializado en PINAR y gestión documental.

Analiza las siguientes observaciones obtenidas de un diagnóstico archivístico institucional.

Debes identificar los aspectos críticos y su riesgo asociado.

Devuelve únicamente un JSON válido.

Formato esperado:

[
  {
    "aspecto": "...",
    "riesgo": "..."
  }
]

Máximo 10 resultados.

Observaciones:
${obsText}

`;

  try {

    const client =
      new OpenAI({
        apiKey:
          process.env.GPT_API
      });

    const response =
      await client.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.3,

        max_tokens: 1200

      });

    const text =
      response
        .choices[0]
        .message
        .content
        .trim();

    const cleanText =
      text
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    return JSON.parse(
      cleanText
    );

  } catch (error) {

    console.error(
      "ERROR ASPECTOS IA:",
      error
    );

    return [];

  }

}

export async function
  generateObjetivosIA(
    aspectos
  ) {

  if (
    !aspectos ||
    aspectos.length === 0
  ) {

    return [];

  }

  const aspectosTexto =
    aspectos
      .map(
        (a) =>
          `- ${a.aspecto}`
      )
      .join("\n");

  const prompt = `

Eres un experto archivístico colombiano especializado en PINAR.

A partir de los siguientes aspectos críticos institucionales, redacta objetivos estratégicos específicos para fortalecer la gestión documental.

Los objetivos deben:

- tener tono técnico institucional
- iniciar con verbos en infinitivo
- ser claros y profesionales
- estar alineados con archivística colombiana
- enfocarse en mejora institucional

Devuelve únicamente un JSON válido.

Formato:

[
  {
    "objetivo": "..."
  }
]

Aspectos críticos:
${aspectosTexto}

`;

  try {

    const client =
      new OpenAI({
        apiKey:
          process.env.GPT_API
      });

    const response =
      await client.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.4,

        max_tokens: 1200

      });

    const text =
      response
        .choices[0]
        .message
        .content
        .trim();

    const cleanText =
      text
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    return JSON.parse(
      cleanText
    );

  } catch (error) {

    console.error(
      "ERROR OBJETIVOS IA:",
      error
    );

    return [];

  }

}

export async function
  generatePlanesIA(
    objetivos
  ) {

  if (
    !objetivos ||
    objetivos.length === 0
  ) {

    return [];

  }

  const objetivosTexto =
    objetivos
      .map(
        (o) =>
          `- ${o.objetivo}`
      )
      .join("\n");

  const prompt = `

Eres un experto archivístico colombiano especializado en formulación de PINAR.

A partir de los siguientes objetivos estratégicos, genera proyectos institucionales archivísticos.

Cada proyecto debe incluir:

- nombre del proyecto
- descripción técnica institucional
- máximo 4 actividades concretas

Los proyectos deben:

- ser coherentes con archivística colombiana
- tener tono técnico institucional
- ser realistas
- estar orientados a fortalecimiento documental

Devuelve únicamente un JSON válido.

Formato:

[
  {
    "proyecto": "...",
    "descripcion": "...",
    "actividades": [
      "...",
      "..."
    ]
  }
]

Objetivos:
${objetivosTexto}

`;

  try {

    const client =
      new OpenAI({
        apiKey:
          process.env.GPT_API
      });

    const response =
      await client.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.4,

        max_tokens: 2000

      });

    const text =
      response
        .choices[0]
        .message
        .content
        .trim();

    const cleanText =
      text
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    return JSON.parse(
      cleanText
    );

  } catch (error) {

    console.error(
      "ERROR PLANES IA:",
      error
    );

    return [];

  }

}

export async function generatePinarIntroduction(data) {

  try {

    const entidad =

      data.nombre_empresa ||

      data.nombre_entidad ||

      data.NOMBRE_ENTIDAD ||

      data.razon_social ||

      "la entidad";

    const vigencia =
      data.vigencia ||
      "2026";

    const aspectos =
      (data.aspectos_criticos || [])
        .map(a => a.aspecto)
        .join(", ");

    const objetivos =
      (data.objetivos_estrategicos || [])
        .map(o => o.objetivo)
        .join(", ");

    const prompt =
      `
Eres un experto archivístico colombiano especializado en formulación de PINAR según lineamientos del Archivo General de la Nación.

Redacta una introducción institucional formal para un Plan Institucional de Archivos - PINAR.

DATOS:

Entidad: ${entidad}

Vigencia:
${vigencia}

Aspectos críticos:
${aspectos}

Objetivos estratégicos:
${objetivos}

La introducción debe:

- tener tono técnico institucional
- ser formal
- mencionar fortalecimiento archivístico
- mencionar gestión documental
- mencionar normatividad archivística
- mencionar preservación y acceso a la información
- tener entre 1 y 2 párrafos
- sonar como documento oficial colombiano

NO uses listas.
NO uses títulos.
`;

    const client =
      new OpenAI({
        apiKey:
          process.env.GPT_API
      });

    const response =
      await client.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        max_tokens: 500,

        temperature: 0.5,

      });

    return response
      .choices[0]
      .message
      .content
      .trim();

  } catch (err) {

    console.error(
      "GPT PINAR INTRO ERROR:",
      err.message
    );

    return "La entidad formula el presente Plan Institucional de Archivos - PINAR con el propósito de fortalecer la gestión documental institucional y garantizar el cumplimiento de la normatividad archivística vigente.";
  }

}

export async function generatePinarVision(data) {

  try {

    const entidad =

      data.nombre_empresa ||

      data.nombre_entidad ||

      data.NOMBRE_ENTIDAD ||

      data.razon_social ||

      "la entidad";

    const aspectos =
      (data.aspectos_criticos || [])
        .map(a => a.aspecto)
        .join(", ");

    const objetivos =
      (data.objetivos_estrategicos || [])
        .map(o => o.objetivo)
        .join(", ");

    const prompt =
      `
Eres un experto archivístico colombiano especializado en formulación de PINAR según lineamientos del Archivo General de la Nación.

Redacta una visión estratégica institucional para un Plan Institucional de Archivos - PINAR.

DATOS:

Entidad:
${entidad}

Aspectos críticos:
${aspectos}

Objetivos estratégicos:
${objetivos}

La visión estratégica debe:

- tener tono institucional
- sonar técnica
- mencionar fortalecimiento archivístico
- mencionar preservación documental
- mencionar acceso a la información
- mencionar mejora continua
- mencionar modernización documental
- ser máximo 1 párrafo
- sonar como documento oficial colombiano

NO uses títulos.
NO uses listas.
`;

    const client =
      new OpenAI({
        apiKey:
          process.env.GPT_API
      });

    const response =
      await client.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        max_tokens: 300,

        temperature: 0.5,

      });

    return response
      .choices[0]
      .message
      .content
      .trim();

  } catch (err) {

    console.error(
      "GPT PINAR VISION ERROR:",
      err.message
    );

    return "La entidad orientará sus esfuerzos al fortalecimiento de la gestión documental institucional mediante estrategias archivísticas orientadas a la preservación, acceso y administración de la información institucional.";

  }

}
