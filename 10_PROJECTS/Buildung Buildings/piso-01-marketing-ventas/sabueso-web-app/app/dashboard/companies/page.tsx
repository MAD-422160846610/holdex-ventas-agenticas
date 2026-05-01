import { db } from '@/lib/db';
import { companies, userProfiles } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { CompaniesClient } from '@/components/CompaniesClient';
import { stackServerApp } from '@/stack/server';
import { redirect } from 'next/navigation';

export default async function CompaniesPage() {
  const user = await stackServerApp.getUser();
  if (!user) redirect('/handler/sign-in');

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, user.id)
  });

  if (!profile || profile.role === 'cliente') {
    redirect('/dashboard');
  }
  // Fetch all companies sorted by newest
  const allCompanies = await db.query.companies.findMany({
    orderBy: [desc(companies.createdAt)],
    with: {
      people: true,
      opportunities: true
    }
  });

  return (
    <main className="scanlines flicker" style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <div className="cyber-bg" />
      
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="glow-text" style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-2px' }}>
            DIRECTORIO_CUENTAS_
          </h1>
          <div className="tag" style={{ background: 'var(--accent-blue)', color: 'black', border: 'none' }}>
            V2_MASTER_SUITE
          </div>
        </div>
        <p className="font-mono" style={{ color: '#8b949e', marginTop: '0.5rem', fontSize: '0.8rem' }}>
          [ INTELIGENCIA_DE_CUENTA: APOLLO + CLAY_INTEGRATION ]
        </p>
      </header>

      <CompaniesClient initialCompanies={allCompanies as any} />
    </main>
  );
}
