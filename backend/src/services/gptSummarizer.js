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
    const text = response.choices[0].message.content.trim();
    return text.split('\n').filter(l => l.trim().length > 0).slice(0, 5);
  } catch (err) {
    console.error('GPT summarizer error:', err.message);
    return [];
  }
}

export async function generatePlanAccionIA(sectionTitle, items) {

  const obsItems =
    (items || [])
      .filter(i => i.observation?.trim());

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

Analiza los siguientes hallazgos de un diagnóstico documental y genera un plan de acción archivístico institucional.

Debes devolver únicamente un JSON válido con máximo 5 acciones.

Cada acción debe contener:

- hallazgo
- accion
- responsable
- prioridad
- plazo

Las prioridades solo pueden ser:
Alta, Media o Baja.

Los plazos solo pueden ser:
Corto plazo, Mediano plazo o Largo plazo.

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

        max_tokens: 800,

        temperature: 0.4,
      });

    const text =
      response
        .choices[0]
        .message
        .content
        .trim();

    return JSON.parse(text);

  } catch (err) {

    console.error(
      'GPT PLAN ACCION ERROR:',
      err.message
    );

    return [];

  }

}

export async function generatePinarIntroduction(data) {

  try {

    const entidad =
      data.nombre_empresa ||
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
