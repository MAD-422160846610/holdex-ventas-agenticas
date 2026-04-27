import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardClient } from '@/components/DashboardClient';

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
  }),
}));

// Mock de las actions
vi.mock('@/lib/actions/leads', () => ({
  processAllLeadsAction: vi.fn(),
}));

const mockLeads = [
  {
    id: '1',
    name: 'Test Lead',
    company: 'Test Co',
    email: 'test@example.com',
    status: 'new',
    score: 85,
    createdAt: new Date(),
  }
];

describe('RBAC: DashboardClient', () => {
  it('VENDEDOR: debe ver todos los botones de acción (Importar, Procesar AI)', () => {
    render(<DashboardClient initialLeads={mockLeads} role="vendedor" />);
    
    expect(screen.getByText(/IMPORTAR LEADS CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/PROCESAR_TODOS_AI/i)).toBeInTheDocument();
  });

  it('ADMIN: debe ver todos los botones de acción', () => {
    render(<DashboardClient initialLeads={mockLeads} role="admin" />);
    
    expect(screen.getByText(/IMPORTAR LEADS CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/PROCESAR_TODOS_AI/i)).toBeInTheDocument();
  });

  it('CLIENTE: NO debe ver botones de Importar ni Procesar AI', () => {
    render(<DashboardClient initialLeads={mockLeads} role="cliente" />);
    
    expect(screen.queryByText(/IMPORTAR LEADS CSV/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/PROCESAR_TODOS_AI/i)).not.toBeInTheDocument();
  });

  it('CLIENTE: debe poder ver la lista de leads y buscarlos', () => {
    render(<DashboardClient initialLeads={mockLeads} role="cliente" />);
    
    expect(screen.getByText(/Test Co/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/BUSCAR_POR_NOMBRE_EMPRESA_EMAIL/i)).toBeInTheDocument();
  });
});
