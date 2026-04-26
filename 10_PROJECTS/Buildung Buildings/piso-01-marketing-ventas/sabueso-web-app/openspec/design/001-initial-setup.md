# Design: Initial Setup & Architecture

## Technical Approach

### 1. Persistence Layer
- **Provider**: Neon Postgres.
- **ORM**: Drizzle ORM for type-safe database access and migrations.
- **Rationale**: Drizzle provides a near-zero overhead compared to Prisma, which is essential for serverless performance in Next.js.

### 2. Authentication & Identity
- **Provider**: Stack Auth (`@stackframe/stack`).
- **Implementation**:
    - `stack.ts` configuration for `StackServerApp`.
    - Middleware for route protection.
    - Custom Auth Handler at `app/handler/[...stack]/page.tsx`.
- **Rationale**: Fast setup, handles RBAC easily, and integrates perfectly with Neon.

### 3. Styling System (Cyber-Brutalism)
- **Foundation**: `app/globals.css` using custom utility classes for the "Piso 01" look.
- **Components**: Brutalist borders, sharp shadows, and high-contrast typography.
- **Design Tokens**:
    - `--bg-black`: `#000000`
    - `--accent-green`: `#00ff00`
    - `--accent-gold`: `#c9a227`
    - `--shadow-brutal`: `10px 10px 0px var(--accent-green)`
- **Effects**: Scanlines overlay, flicker animation, and JetBrains Mono for a terminal feel.

### 4. Project Structure
- `lib/db/`: Schema and client definitions.
- `components/ui/`: Atomic components (Buttons, Cards, Inputs) with glassmorphism.
- `app/dashboard/`: Protected area for lead management.

## Database Schema (Drizzle-style)

```typescript
export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull(),
  website: text('website'),
  email: text('email'),
  status: leadStatusEnum('status').default('new').notNull(),
  qualificationReason: text('qualification_reason'),
  draftEmail: text('draft_email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## Risks & Tradeoffs
- **Tradeoff**: Vanilla CSS requires more manual writing than Tailwind, but allows for pixel-perfect glassmorphism and custom animations that give it the "Premium" feel requested.
