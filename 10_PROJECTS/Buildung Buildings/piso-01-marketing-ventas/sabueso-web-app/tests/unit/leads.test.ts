import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks deben ir ANTES del import de la action ────────────────────────────
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

// ─── Imports después de los mocks ─────────────────────────────────────────────
import { uploadLeadsAction, processLeadWithAIAction, processAllLeadsAction } from '@/lib/actions/leads';
import { getAuthenticatedUser } from '@/lib/auth-utils';

// ─── Helper ───────────────────────────────────────────────────────────────────
const mockAuthUser = () =>
  vi.mocked(getAuthenticatedUser).mockResolvedValue({
    id: 'user_123',
    displayName: 'Test User',
    primaryEmail: 'test@example.com',
  } as any);

const mockUnauth = () =>
  vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

// ─── TC006 / TC011 / TC018: uploadLeadsAction ─────────────────────────────────
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

  // TC006: CSV vacío o sin archivo
  it('[TC006] retorna error si no se proporciona archivo', async () => {
    mockAuthUser();
    const formData = new FormData();
    const result = await uploadLeadsAction(formData);
    expect(result).toEqual({ success: false, error: 'No se proporcionó ningún archivo.' });
  });

  // TC011: Validación — no se permiten archivos que no sean CSV
  it('[TC011] retorna error si el archivo no es .csv', async () => {
    mockAuthUser();
    const formData = new FormData();
    formData.append('file', new File(['a,b'], 'leads.xlsx', { type: 'application/vnd.ms-excel' }));
    const result = await uploadLeadsAction(formData);
    expect(result).toEqual({ success: false, error: 'Formato no permitido. Solo CSV.' });
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

  // TC011: CSV con solo cabecera (sin filas de datos)
  it('[TC011] retorna error si el CSV tiene solo la cabecera sin datos', async () => {
    mockAuthUser();
    const csvContent = 'nombre,empresa,email';
    const formData = new FormData();
    formData.append('file', new File([csvContent], 'leads.csv', { type: 'text/csv' }));
    const result = await uploadLeadsAction(formData);
    expect(result).toEqual({ success: false, error: 'El archivo está vacío o no tiene datos.' });
  });
});

// ─── TC007 / TC013 / TC015: processLeadWithAIAction ──────────────────────────
describe('Server Action: processLeadWithAIAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC003: Sin autenticación
  it('[TC003] rechaza si el usuario NO está autenticado', async () => {
    mockUnauth();
    await expect(processLeadWithAIAction('lead-123')).rejects.toThrow('UNAUTHORIZED_ACCESS_');
  });

  // TC007: Procesamiento exitoso de un lead individual
  it('[TC007/TC013] procesa un lead individual y retorna success', async () => {
    mockAuthUser();
    const result = await processLeadWithAIAction('lead-uuid-123');
    expect(result).toEqual({ success: true });
  });
});

// ─── TC015: processAllLeadsAction ────────────────────────────────────────────
describe('Server Action: processAllLeadsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC003: Sin autenticación
  it('[TC003] rechaza si el usuario NO está autenticado', async () => {
    mockUnauth();
    await expect(processAllLeadsAction()).rejects.toThrow('UNAUTHORIZED_ACCESS_');
  });

  // TC015: Sin leads en la DB — retorna success con count 0
  it('[TC015] retorna success con count 0 si no hay leads para procesar', async () => {
    mockAuthUser();
    const { db } = await import('@/lib/db');
    vi.mocked(db.query.people.findMany).mockResolvedValueOnce([]);
    const result = await processAllLeadsAction();
    expect(result).toEqual({ success: true, count: 0 });
  });
});
