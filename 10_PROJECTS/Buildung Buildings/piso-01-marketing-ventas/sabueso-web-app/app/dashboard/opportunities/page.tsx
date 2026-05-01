import { db } from '@/lib/db';
import { opportunities, userProfiles } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { OpportunitiesClient } from '@/components/OpportunitiesClient';
import { stackServerApp } from '@/stack/server';
import { redirect } from 'next/navigation';

export default async function OpportunitiesPage() {
  const user = await stackServerApp.getUser();
  if (!user) redirect('/handler/sign-in');

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, user.id)
  });

  if (!profile || profile.role === 'cliente') {
    redirect('/dashboard');
  }
  const allOpps = await db.query.opportunities.findMany({
    orderBy: [desc(opportunities.createdAt)],
    with: {
      company: true,
      person: true
    }
  });

  return (
    <main className="scanlines flicker" style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <div className="cyber-bg" />
      
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="glow-text" style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-2px' }}>
            PIPELINE_VENTAS_
          </h1>
          <div className="tag" style={{ background: 'var(--accent-purple)', color: 'white', border: 'none' }}>
            MASTER_VIEW
          </div>
        </div>
        <p className="font-mono" style={{ color: '#8b949e', marginTop: '0.5rem', fontSize: '0.8rem' }}>
          [ GESTION_DE_DEALS: SEGUIMIENTO_DE_CONVERSION ]
        </p>
      </header>

      <OpportunitiesClient initialOpportunities={allOpps as any} />
    </main>
  );
}
