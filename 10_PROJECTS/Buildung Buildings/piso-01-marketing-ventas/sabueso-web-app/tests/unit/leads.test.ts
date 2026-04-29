import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks deben ir ANTES del import de la action ────────────────────
vi.mock('@/lib/auth-utils', () => ({
  getAuthenticatedUser: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onConflictDoUpdate: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{ id: 'lead-uuid-1' }])),
        })),
        returning: vi.fn(() => Promise.resolve([{ id: 'lead-uuid-1' }])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve()),
      })),
    })),
    query: {
      people: {
        findMany: vi.fn(() => Promise.resolve([])),
        findFirst: vi.fn(() => Promise.resolve({ id: 'lead-uuid-123', email: 'test@example.com', fullName: 'John Doe', company: { name: 'Acme Corp' } })),
      },
      companies: {
        findMany: vi.fn(() => Promise.resolve([])),
      },
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock de lib/apify-actors-config.ts
vi.mock('@/lib/apify-actors-config', () => ({
  SUPPORTED_ACTORS: {
    'google-maps-scraper': {
      id: 'google-maps-scraper',
      name: 'Google Maps Scraper',
      description: 'Busca empresas por ubicación',
      inputFields: [
        { name: 'searchString', label: 'Qué buscar', required: true, type: 'text' },
        { name: 'maxPlaces', label: 'Cantidad', required: false, type: 'number', defaultValue: 50 },
      ],
      outputMapping: {},
    },
    'google-search-scraper': {
      id: 'google-search-scraper',
      name: 'Google Search Scraper',
      description: 'Búsqueda web',
      inputFields: [
        { name: 'queries', label: 'Queries', required: true, type: 'text' },
      ],
      outputMapping: {},
    },
  },
}));

// Mock de lib/apify.ts
vi.mock('@/lib/apify', () => ({
  runApifyActor: vi.fn(() => Promise.resolve('run-123')),
  pollApifyResults: vi.fn(() => Promise.resolve([
    { title: 'Lead 1', email: 'lead1@test.com', address: 'Calle 1' },
    { title: 'Lead 2', email: 'lead2@test.com', address: 'Calle 2' },
  ])),
}));

// ─── Imports después de los mocks ─────────────────────────────────────
import { uploadLeadsAction, processLeadWithAIAction, processAllLeadsAction, searchLeadsWithApify } from '@/lib/actions/leads';
import { getAuthenticatedUser } from '@/lib/auth-utils';

// ─── Helper ───────────────────────────────────────────────────────────
const mockAuthUser = () =>
  vi.mocked(getAuthenticatedUser).mockResolvedValue({
    id: 'user_123',
    displayName: 'Test User',
    primaryEmail: 'test@example.com',
  } as any);

const mockUnauth = () =>
  vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

// ─── TC006 / TC011 / TC018: uploadLeadsAction ──────────────────────
describe('Server Action: uploadLeadsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC003: Autenticación requerida
  it('[TC003/TC006] rechaza si el usuario NO está autenticado', async () => {
    mockUnauth();
    const formData = new FormData();
    formData.append('file', new File(['a,b'], 'leads.csv', { type: 'text/csv' }));
    await expect(uploadLeadsAction(formData)).rejects.toThrow('UNAUTHORIZED_ACCESS_');
  });

  // TC006: CSV válido procesa leads correctamente
  it('[TC006] importa leads con CSV válido y mapping estándar', async () => {
    mockAuthUser();
    const csvContent = 'nombre,empresa,email,web\nJuan Pérez,ACME,juan@acme.com,acme.com';
    const formData = new FormData();
    formData.append('file', new File([csvContent], 'leads.csv', { type: 'text/csv' }));
    formData.append('mapping', JSON.stringify({ name: 'nombre', company: 'empresa', email: 'email', website: 'web' }));
    const result = await uploadLeadsAction(formData);
    expect(result).toMatchObject({ success: true, count: 1 });
  });
});

// ─── TC007 / TC013 / TC015: processLeadWithAIAction ──────────────────
describe('Server Action: processLeadWithAIAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC003: Sin autenticación
  it('[TC003] rechaza si el usuario NO está autenticado', async () => {
    mockUnauth();
    await expect(processLeadWithAIAction('lead-123')).rejects.toThrow('UNAUTHORIZED_ACCESS_');
  });

  // TC007: Procesamiento exitoso
  it('[TC007/TC013] procesa un lead individual y retorna success', async () => {
    mockAuthUser();
    const result = await processLeadWithAIAction('lead-uuid-123');
    expect(result).toEqual({ success: true });
  });
});

// ─── TC015: processAllLeadsAction ──────────────────────────────────
describe('Server Action: processAllLeadsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC003: Sin autenticación
  it('[TC003] rechaza si el usuario NO está autenticado', async () => {
    mockUnauth();
    await expect(processAllLeadsAction()).rejects.toThrow('UNAUTHORIZED_ACCESS_');
  });

  // TC015: Sin leads en la DB
  it('[TC015] retorna success con count 0 si no hay leads', async () => {
    mockAuthUser();
    const { db } = await import('@/lib/db');
    vi.mocked(db.query.people.findMany).mockResolvedValueOnce([]);
    const result = await processAllLeadsAction();
    expect(result).toEqual({ success: true, count: 0 });
  });
});

// ─── TC408: searchLeadsWithApify ──────────────────────────────────
describe('Server Action: searchLeadsWithApify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC003: Sin autenticación
  it('[TC003] rechaza si el usuario NO está autenticado', async () => {
    mockUnauth();
    const formData = new FormData();
    formData.append('actorId', 'google-maps-scraper');
    await expect(searchLeadsWithApify(formData)).rejects.toThrow('UNAUTHORIZED_ACCESS_');
  });

  // TC408: Ejecución exitosa
  it('[TC408] ejecuta búsqueda y devuelve resultados', async () => {
    mockAuthUser();
    
    const formData = new FormData();
    formData.append('actorId', 'google-maps-scraper');
    formData.append('searchString', 'restaurantes BA');
    formData.append('maxPlaces', '50');

    const result = await searchLeadsWithApify(formData);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].title).toBe('Lead 1');
  });

  // TC409: Actor no soportado
  it('[TC409] retorna error si el actor no está soportado', async () => {
    mockAuthUser();
    const formData = new FormData();
    formData.append('actorId', 'actor-inexistente');
    
    const result = await searchLeadsWithApify(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Actor no soportado');
  });

  // TC410: Error en APIFY
  it('[TC410] propaga error si APIFY falla', async () => {
    mockAuthUser();
    
    // Sobreescribir el mock para que rechace
    const { runApifyActor } = await import('@/lib/apify');
    vi.mocked(runApifyActor).mockRejectedValueOnce(new Error('APIFY timeout'));
    
    const formData = new FormData();
    formData.append('actorId', 'google-maps-scraper');
    
    const result = await searchLeadsWithApify(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Error en búsqueda APIFY');
  });
});
