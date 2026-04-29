import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runApifyActor, pollApifyResults } from '@/lib/apify';

// ─── Mock global fetch ────────────────────────────────────────────────
const mockFetch = vi.fn();
global.fetch = mockFetch;

// ─── Helper para resetar mocks ─────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();
  // Reset env
  process.env.APIFY_API_KEY = 'test-api-key-123';
});

afterEach(() => {
  delete process.env.APIFY_API_KEY;
});

// ─── TC401: runApifyActor ──────────────────────────────────────────
describe('runApifyActor', () => {
  it('[TC401] lanza error si APIFY_API_KEY no está configurado', async () => {
    delete process.env.APIFY_API_KEY;
    
    await expect(runApifyActor('actor-123', { searchString: 'test' }))
      .rejects.toThrow('APIFY_API_KEY not configured');
  });

  it('[TC402] hace POST correcto a APIFY y devuelve runId', async () => {
    // Mock respuesta exitosa de APIFY
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 'run-abc-123', status: 'RUNNING' }),
    });

    const runId = await runApifyActor('actor-123', { searchString: 'restaurants BA' });

    expect(runId).toBe('run-abc-123');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    // El código real hace JSON.stringify(input), no { input }
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.apify.com/v2/actor-tasks/actor-123/runs',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key-123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchString: 'restaurants BA' }),
      }
    );
  });

  it('[TC403] lanza error si APIFY responde con status no-OK', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: () => Promise.resolve('Rate limit exceeded'),
    });

    await expect(runApifyActor('actor-123', {}))
      .rejects.toThrow('APIFY error: 429 - Rate limit exceeded');
  });
});

// ─── TC404: pollApifyResults ────────────────────────────────────────
describe('pollApifyResults', () => {
  it('[TC404] hace polling hasta que status sea SUCCEEDED y devuelve items', async () => {
    // Mock 1: GET run (SUCCEEDED inmediato, no RUNNING)
    // Mock 2: GET dataset
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          id: 'run-123', 
          status: 'SUCCEEDED',
          defaultDatasetId: 'dataset-456' 
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          items: [
            { title: 'Lead 1', email: 'lead1@test.com' },
            { title: 'Lead 2', email: 'lead2@test.com' },
          ]
        }),
      });

    const results = await pollApifyResults('run-123', 5000); 

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('Lead 1');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('[TC405] lanza error si el actor falla (FAILED)', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        id: 'run-123', 
        status: 'FAILED',
        statusMessage: 'Actor crashed' 
      }),
    });

    await expect(pollApifyResults('run-123', 5000))
      .rejects.toThrow('APIFY actor failed: Actor crashed');
  });

  it('[TC406] hace polling hasta timeout y lanza error', async () => {
    // Todas las respuestas siguen RUNNING (nunca terminan)
    // Configurar mock para que siempre devuelva RUNNING
    let callCount = 0;
    mockFetch.mockImplementation(async () => {
      callCount++;
      return {
        ok: true,
        json: () => Promise.resolve({ 
          id: 'run-123', 
          status: 'RUNNING',
          defaultDatasetId: 'dataset-456' 
        }),
      };
    });

    await expect(pollApifyResults('run-123', 3000)) // 3 seg timeout
      .rejects.toThrow('APIFY polling timeout after 5 minutes');
    
    // Verificar que hizo al menos 1 llamada
    expect(callCount).toBeGreaterThan(0);
  }, 10000); // vitest timeout 10 seg

  it('[TC407] usa APIFY_API_KEY para autorización en polling', async () => {
    // Reset mock para este test
    mockFetch.mockReset();
    
    // Mock 1: GET run (SUCCEEDED)
    // Mock 2: GET dataset
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          id: 'run-123', 
          status: 'SUCCEEDED',
          defaultDatasetId: 'dataset-456' 
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

    await pollApifyResults('run-123', 5000);

    // Verificar que se usó la API key en el header de TODAS las llamadas
    expect(mockFetch).toHaveBeenCalledTimes(2);
    
    // Verificar headers de la primera llamada (GET run)
    const firstCall = mockFetch.mock.calls[0];
    expect(firstCall[1].headers['Authorization']).toBe('Bearer test-api-key-123');
    
    // Verificar headers de la segunda llamada (GET dataset)
    const secondCall = mockFetch.mock.calls[1];
    expect(secondCall[1].headers['Authorization']).toBe('Bearer test-api-key-123');
  });
});
