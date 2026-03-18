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
