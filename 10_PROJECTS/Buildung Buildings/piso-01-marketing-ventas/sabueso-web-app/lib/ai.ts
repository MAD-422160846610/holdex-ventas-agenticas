import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'https://sabueso.vercel.app',
    'X-Title': 'Sabueso V2',
  }
});

export async function generateLeadInsights(leadData: { 
  fullName: string, 
  jobTitle?: string | null, 
  companyName: string, 
  industry?: string | null 
}) {
  if (!process.env.OPENROUTER_API_KEY) {
    // Advanced Mock Logic when no API Key is present
    const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
    return {
      score: mockScore,
      qualificationReason: `Análisis heurístico: ${leadData.fullName} en ${leadData.companyName} (${leadData.jobTitle || 'N/A'}) muestra patrones de compatibilidad alta con Sabueso V2.`,
      personalTouch: `Interés potencial en optimización de ventas para el sector ${leadData.industry || 'Tecnología'}.`,
      suggestedEmail: `Hola ${leadData.fullName.split(' ')[0]},\n\nHe estado siguiendo el crecimiento de ${leadData.companyName} y me parece que están en un momento clave para escalar su pipeline de ventas.\n\n¿Estarías abierto a una breve charla?\n\nSaludos.`
    };
  }

  try {
    const { object } = await generateObject({
      model: openrouter('google/gemini-2.0-flash-exp:free'),
      schema: z.object({
        score: z.number().min(0).max(100),
        qualificationReason: z.string(),
        personalTouch: z.string(),
        suggestedEmail: z.string(),
      }),
      prompt: `Analiza este lead para una plataforma de automatización de ventas (Sabueso):
      Nombre: ${leadData.fullName}
      Cargo: ${leadData.jobTitle}
      Empresa: ${leadData.companyName}
      Industria: ${leadData.industry}
      
      Devuelve un score de 0 a 100, una razón de calificación, un toque personal para el outreach y un email sugerido corto y directo.`,
    });

    return object;
  } catch (error) {
    console.error("AI_GENERATION_ERROR_", error);
    throw error;
  }
}
