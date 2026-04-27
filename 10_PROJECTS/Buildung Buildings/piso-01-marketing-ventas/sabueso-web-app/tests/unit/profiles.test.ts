import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mockeamos el módulo de Stack server directamente para evitar
// el import de @stackframe/stack y sus dependencias de cliente
vi.mock('@/stack/server', () => ({
  stackServerApp: {
    getUser: vi.fn(),
  },
}));

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve()),
    })),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

import { createProfile } from '@/lib/actions/profiles';
import { stackServerApp } from '@/stack/server';

describe('Server Action: createProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC003: Sin autenticación
  it('[TC003] rechaza si el usuario NO está autenticado', async () => {
    vi.mocked(stackServerApp.getUser).mockResolvedValueOnce(null as any);

    const formData = new FormData();
    formData.append('fullName', 'Test User');
    await expect(createProfile(formData)).rejects.toThrow('No estás autenticado');
  });

  // Onboarding: nombre completo obligatorio
  it('[Onboarding] rechaza si fullName está vacío', async () => {
    vi.mocked(stackServerApp.getUser).mockResolvedValueOnce({
      id: 'user_123',
      displayName: 'Test User',
    } as any);

    const formData = new FormData();
    formData.append('fullName', '');
    await expect(createProfile(formData)).rejects.toThrow('El nombre es obligatorio');
  });

  // Onboarding: flujo completo — redirect lanza NEXT_REDIRECT (comportamiento esperado de Next.js)
  it('[Onboarding] crea el perfil y redirige si los datos son válidos', async () => {
    vi.mocked(stackServerApp.getUser).mockResolvedValueOnce({
      id: 'user_123',
      displayName: 'Test User',
    } as any);

    const formData = new FormData();
    formData.append('fullName', 'Juan Pérez');
    formData.append('company', 'ACME Corp');
    formData.append('phone', '+54 9 11 1234-5678');

    // redirect() en Next.js lanza un error — es el comportamiento correcto
    await expect(createProfile(formData)).rejects.toThrow('NEXT_REDIRECT');
  });
});
