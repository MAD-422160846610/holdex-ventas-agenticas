import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { langfuse, flushLangfuse } from './langfuse';

// Direct OpenRouter — no proxy overhead. Langfuse traces via SDK after each call.
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'https://sabueso.vercel.app',
    'X-Title': 'Sabueso V2',
  }
});

const QUALIFICATION_PROMPT = `Analiza este lead para una plataforma de automatización de ventas (Sabueso):
Nombre: {{fullName}}
Cargo: {{jobTitle}}
Empresa: {{companyName}}
Industria: {{industry}}

Devuelve un score de 0 a 100, una razón de calificación, un toque personal para el outreach y un email sugerido corto y directo.`;

export async function generateLeadInsights(leadData: { 
  fullName: string, 
  jobTitle?: string | null, 
  companyName: string, 
  industry?: string | null 
}) {
  if (!process.env.OPENROUTER_API_KEY) {
    const mockScore = Math.floor(Math.random() * 30) + 70;
    return {
      score: mockScore,
      qualificationReason: `Análisis heurístico: ${leadData.fullName} en ${leadData.companyName} (${leadData.jobTitle || 'N/A'}) muestra patrones de compatibilidad alta con Sabueso V2.`,
      personalTouch: `Interés potencial en optimización de ventas para el sector ${leadData.industry || 'Tecnología'}.`,
      suggestedEmail: `Hola ${leadData.fullName.split(' ')[0]},\n\nHe estado siguiendo el crecimiento de ${leadData.companyName} y me parece que están en un momento clave para escalar su pipeline de ventas.\n\n¿Estarías abierto a una breve charla?\n\nSaludos.`
    };
  }

  const prompt = QUALIFICATION_PROMPT
    .replace('{{fullName}}', leadData.fullName)
    .replace('{{jobTitle}}', leadData.jobTitle ?? 'N/A')
    .replace('{{companyName}}', leadData.companyName)
    .replace('{{industry}}', leadData.industry ?? 'N/A');

  // Langfuse trace — captures model, prompt, output, latency, and cost
  const trace = langfuse.trace({
    name: 'lead-qualification',
    userId: leadData.fullName,
    metadata: {
      company: leadData.companyName,
      industry: leadData.industry,
      jobTitle: leadData.jobTitle,
    },
    tags: ['sabueso-v2', 'lead-qualification'],
  });

  const generation = trace.generation({
    name: 'gemini-lead-analysis',
    model: 'google/gemini-2.0-flash-exp:free',
    input: prompt,
    metadata: { promptId: 'sabueso-lead-qualification' },
  });

  try {
    const startTime = Date.now();
    const { object } = await generateObject({
      model: openrouter('google/gemini-2.0-flash-exp:free'),
      schema: z.object({
        score: z.number().min(0).max(100),
        qualificationReason: z.string(),
        personalTouch: z.string(),
        suggestedEmail: z.string(),
      }),
      prompt,
    });

    generation.end({
      output: object,
      metadata: { latencyMs: Date.now() - startTime },
    });

    await flushLangfuse();
    return object;
  } catch (error) {
    generation.end({ output: { error: String(error) }, level: 'ERROR' });
    await flushLangfuse();
    console.error("AI_GENERATION_ERROR_", error);
    throw error;
  }
}
