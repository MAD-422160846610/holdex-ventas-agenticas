/**
 * Langfuse SDK singleton for LLM observability.
 * SDK-based (no proxy) — zero added latency to OpenRouter calls.
 * Traces: lead qualification, embedding generation, semantic search.
 */

import { Langfuse } from 'langfuse';

// Singleton — safe in Next.js server actions and API routes
export const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
  secretKey: process.env.LANGFUSE_SECRET_KEY || '',
  baseUrl: process.env.LANGFUSE_BASE_URL || 'https://us.cloud.langfuse.com',
  flushAt: 1,      // flush immediately in serverless (no long-lived process)
  flushInterval: 0, // don't wait for interval
});

// Flush pending traces before the serverless function cold-shuts
export async function flushLangfuse() {
  await langfuse.shutdownAsync();
}
