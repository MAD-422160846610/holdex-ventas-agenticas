/**
 * Embedding generation via OpenRouter → OpenAI text-embedding-3-small
 * Produces 1536-dimensional vectors for semantic similarity search.
 */

const OPENROUTER_EMBED_URL = 'https://openrouter.ai/api/v1/embeddings';
const EMBED_MODEL = 'text-embedding-3-small';

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const response = await fetch(OPENROUTER_EMBED_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sabueso.vercel.app',
      'X-Title': 'Sabueso V2',
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: text.slice(0, 8191), // max tokens safety
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Embedding API error: ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding as number[];
}

/**
 * Build the text representation of a person for embedding.
 */
export function buildPersonEmbedText(person: {
  fullName: string;
  jobTitle?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  companyName?: string | null;
  industry?: string | null;
  metadata?: Record<string, unknown> | null;
}): string {
  const parts = [
    `Nombre: ${person.fullName}`,
    person.jobTitle ? `Cargo: ${person.jobTitle}` : null,
    person.companyName ? `Empresa: ${person.companyName}` : null,
    person.industry ? `Industria: ${person.industry}` : null,
    person.email ? `Email: ${person.email}` : null,
  ].filter(Boolean);

  if (person.metadata && typeof person.metadata === 'object') {
    const meta = person.metadata as Record<string, unknown>;
    if (meta.qualificationReason) {
      parts.push(`Calificación: ${meta.qualificationReason}`);
    }
    if (meta.personalTouch) {
      parts.push(`Contexto: ${meta.personalTouch}`);
    }
  }

  return parts.join('. ');
}

/**
 * Build the text representation of an activity for embedding.
 */
export function buildActivityEmbedText(activity: {
  type: string;
  description: string;
  transcription?: string | null;
  personName?: string | null;
  companyName?: string | null;
}): string {
  const parts = [
    `Tipo: ${activity.type}`,
    `Descripción: ${activity.description}`,
    activity.personName ? `Contacto: ${activity.personName}` : null,
    activity.companyName ? `Empresa: ${activity.companyName}` : null,
    activity.transcription
      ? `Transcripción: ${activity.transcription.slice(0, 1000)}`
      : null,
  ].filter(Boolean);

  return parts.join('. ');
}
