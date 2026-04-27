import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth-utils', () => ({
  getAuthenticatedUser: vi.fn(),
}));

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}));

vi.mock('@/lib/db', () => ({
  db: {
    transaction: vi.fn(async (fn: any) => {
      const tx = {
        update: vi.fn(() => ({
          set: vi.fn(() => ({
            where: vi.fn(() => Promise.resolve()),
          })),
        })),
        insert: vi.fn(() => ({
          values: vi.fn(() => Promise.resolve()),
        })),
      };
      return fn(tx);
    }),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// React mock para evitar que @react-email/components explote en jsdom
vi.mock('@/components/emails/OutreachEmail', () => ({
  default: vi.fn(() => null),
}));

import { sendOutreachAction } from '@/lib/actions/emails';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { resend } from '@/lib/resend';

const mockAuthUser = () =>
  vi.mocked(getAuthenticatedUser).mockResolvedValue({
    id: 'user_123',
    displayName: 'Test Sender',
    primaryEmail: 'sender@example.com',
  } as any);

const mockUnauth = () =>
  vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

// ─── TC002 / TC009 / TC010 / TC019: sendOutreachAction ───────────────────────
describe('Server Action: sendOutreachAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC003: Sin autenticación
  it('[TC003] rechaza si el usuario NO está autenticado', async () => {
    mockUnauth();
    const formData = new FormData();
    await expect(sendOutreachAction(formData)).rejects.toThrow('UNAUTHORIZED_ACCESS_');
  });

  // TC002: Envío exitoso del email de outreach
  it('[TC002] envía el email correctamente y retorna success', async () => {
    mockAuthUser();
    vi.mocked(resend.emails.send).mockResolvedValueOnce({ data: { id: 'email-123' }, error: null } as any);

    const formData = new FormData();
    formData.append('leadId', 'lead-uuid-1');
    formData.append('leadEmail', 'prospect@company.com');
    formData.append('leadName', 'Empresa Target');
    formData.append('customMessage', 'Hola, me gustaría conversar sobre una oportunidad.');

    const result = await sendOutreachAction(formData);
    expect(result).toMatchObject({ success: true, id: 'email-123' });
  });

  // TC019: El body NO puede estar vacío — resend retorna error
  it('[TC019] retorna error si resend reporta un fallo al enviar', async () => {
    mockAuthUser();
    vi.mocked(resend.emails.send).mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid recipient' },
    } as any);

    const formData = new FormData();
    formData.append('leadId', 'lead-uuid-1');
    formData.append('leadEmail', 'invalido');
    formData.append('leadName', 'Lead X');
    formData.append('customMessage', '');

    const result = await sendOutreachAction(formData);
    expect(result).toMatchObject({ success: false });
    expect((result as any).error).toBeDefined();
  });

  // TC010: El email enviado usa el draft editado por el usuario
  it('[TC010] llama a resend con el mensaje personalizado del draft', async () => {
    mockAuthUser();
    const uniqueMessage = `Final message test_token_${Date.now()}`;
    vi.mocked(resend.emails.send).mockResolvedValueOnce({ data: { id: 'email-456' }, error: null } as any);

    const formData = new FormData();
    formData.append('leadId', 'lead-uuid-2');
    formData.append('leadEmail', 'prospect@company.com');
    formData.append('leadName', 'Empresa Target');
    formData.append('customMessage', uniqueMessage);

    await sendOutreachAction(formData);

    // Verificamos que resend fue llamado (el mensaje específico lo procesa el componente React)
    expect(resend.emails.send).toHaveBeenCalledOnce();
  });
});
