import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de módulos exclusivos de Next.js que Vitest no puede resolver
vi.mock('server-only', () => ({}));

// Mock de variables de entorno comunes de Next.js
process.env.NEXT_PUBLIC_STACK_PROJECT_ID = 'test-project-id';
process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY = 'test-client-key';
process.env.STACK_SECRET_SERVER_KEY = 'test-server-key';

