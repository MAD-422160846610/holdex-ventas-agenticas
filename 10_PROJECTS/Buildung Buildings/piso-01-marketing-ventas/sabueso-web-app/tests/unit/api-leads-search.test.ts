import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runApifyActor, pollApifyResults } from '@/lib/apify';
import { db } from '@/lib/db';

// Mock de los módulos externos
vi.mock('@/lib/apify', () => ({
  runApifyActor: vi.fn(),
  pollApifyResults: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([]),
  },
}));

// Mock de NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status || 200,
      json: async () => data,
    }),
  },
}));

describe('API Route: /api/leads/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock de process.env
    vi.stubEnv('APIFY_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('POST /api/leads/search', () => {
    it('debería ejecutar actor de APIFY y devolver resultados', async () => {
      // Arrange
      const mockRunId = 'run-123';
      const mockResults = [
        { title: 'Empresa 1', address: 'Calle 1' },
        { title: 'Empresa 2', address: 'Calle 2' },
      ];

      (runApifyActor as any).mockResolvedValueOnce(mockRunId);
      (pollApifyResults as any).mockResolvedValueOnce(mockResults);

      // Simular el request (TDD: definimos el contrato primero)
      const requestBody = {
        actorId: 'apify/google-maps-scraper',
        searchString: 'restaurantes',
        location: 'Buenos Aires',
        maxPlaces: 50,
      };

      // Aquí importamos dinámicamente después de los mocks
      const { POST } = await import('@/app/api/leads/search/route');

      const request = new Request('http://localhost/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.results).toEqual(mockResults);
      expect(runApifyActor).toHaveBeenCalledWith(
        'apify/google-maps-scraper',
        expect.objectContaining({
          searchString: 'restaurantes',
          location: 'Buenos Aires',
          maxPlaces: 50,
        })
      );
    });

    it('debería devolver error 400 si no se provee actorId', async () => {
      // Arrange
      const { POST } = await import('@/app/api/leads/search/route');

      const request = new Request('http://localhost/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('actorId');
    });

    it('debería devolver error 500 si falla APIFY', async () => {
      // Arrange - Usar un actorId válido para pasar la validación inicial
      const validActorId = 'apify/google-maps-scraper';
      (runApifyActor as any).mockRejectedValueOnce(new Error('APIFY connection failed'));

      const { POST } = await import('@/app/api/leads/search/route');

      const request = new Request('http://localhost/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: validActorId }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('APIFY');
    });
  });
});
