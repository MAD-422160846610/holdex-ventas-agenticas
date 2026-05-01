import Link from 'next/link';
import { OutreachAction } from '@/components/OutreachAction';
import { db } from '@/lib/db';
import { people, userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { stackServerApp } from '@/stack/server';

export const dynamic = "force-dynamic";

export default async function LeadProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Fetch real person from Neon with company relation
  const person = await db.query.people.findFirst({
    where: eq(people.id, id),
    with: {
      company: true
    }
  });

  if (!person) {
    notFound();
  }

  const user = await stackServerApp.getUser();
  const profile = user ? await db.query.userProfiles.findFirst({ where: eq(userProfiles.id, user.id) }) : null;
  const isCliente = profile?.role === 'cliente';

  // SECURITY: Un cliente solo puede ver leads en estado 'handover'
  if (isCliente && person.status !== 'handover') {
    notFound();
  }

  // Extract AI insights from metadata
  const metadata = (person.metadata as any) || {};
  const qualificationReason = metadata.qualificationReason;
  const personalTouch = metadata.personalTouch;
  const draftEmail = metadata.suggestedEmail;

  return (
    <main className="scanlines flicker" style={{ minHeight: '100vh', padding: '2rem', position: 'relative', backgroundColor: '#05070a' }}>
      <div className="cyber-bg" />
      <div className="grid-bg-dots" />
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" className="cyber-button-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            {"< VOLVER_AL_PIPELINE"}
          </Link>
          <div className="tag" style={{ background: 'var(--accent-green)', color: 'black', border: 'none' }}>
            ID_{person.id.slice(0, 4)}
          </div>
        </div>
        <div className="tag glow-text-green" style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>
          [ OPERADOR_ACTIVO: {profile?.role?.toUpperCase() || 'SABUESO_MASTER_V2'} ]
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '2rem', position: 'relative', zIndex: 10 }}>
        {/* Left Column: Data */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="brutalist-card">
            <h3 className="section-label" style={{ marginBottom: '1rem' }}>INFO_PROSPECTO_</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>{person.fullName}</p>
            <p style={{ color: 'var(--accent-green)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold' }}>{person.company?.name || 'N/A'}</p>
            <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>Email: <span style={{ color: '#ccc' }}>{person.email || 'NO_DISPONIBLE_'}</span></p>
              <p>LinkedIn: <a href={person.linkedinUrl || '#'} style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>{person.linkedinUrl ? 'VER_PERFIL' : 'N/A'}</a></p>
            </div>
          </div>

          <div className="brutalist-card" style={{ borderColor: 'var(--accent-green)', boxShadow: '8px 8px 0px var(--accent-green)' }}>
            <h3 className="section-label" style={{ marginBottom: '1rem', color: 'var(--accent-green)' }}>AI_SCORE_</h3>
            <div style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--accent-green)', textAlign: 'center' }}>
              {person.score}<span style={{ fontSize: '1.5rem' }}>%</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#222', marginTop: '1rem' }}>
              <div style={{ width: `${person.score}%`, height: '100%', background: 'var(--accent-green)', boxShadow: '0 0 10px var(--accent-green)' }}></div>
            </div>
          </div>
        </aside>

        {/* Center: Intelligence */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="brutalist-card" style={{ flexGrow: 1, borderLeft: '4px solid var(--accent-green)' }}>
            <div className="tag" style={{ marginBottom: '1.5rem', background: '#111' }}>EVALUACION_SABUESO_AI</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1px', color: 'white' }}>ANALISIS_ESTRATEGICO_</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', fontStyle: qualificationReason ? 'normal' : 'italic' }}>
              {qualificationReason || "Análisis pendiente. El Sabueso AI está procesando la información de este prospecto..."}
            </p>
            
            {personalTouch && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0, 255, 140, 0.05)', border: '1px dashed var(--accent-green)' }}>
                <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '900' }}>GANCHO_PERSONALIZADO:</h4>
                <p style={{ fontStyle: 'italic', color: '#eee', lineHeight: '1.6' }}>"{personalTouch}"</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Actions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isCliente && (
            <OutreachAction 
              leadId={person.id}
              leadEmail={person.email || ''}
              leadName={person.fullName}
              defaultDraft={draftEmail || `Hola ${person.fullName}, estuve analizando a ${person.company?.name || 'tu empresa'} y...`}
            />
          )}

          <div className="brutalist-card" style={{ background: '#0a0a0a', borderStyle: 'dashed' }}>
            <h3 className="section-label" style={{ marginBottom: '1rem' }}>ESTADO_SISTEMA_</h3>
            <div className="tag" style={{ 
              width: '100%', 
              justifyContent: 'center',
              background: 'black', 
              color: 'var(--accent-green)', 
              borderColor: 'var(--accent-green)',
              padding: '0.5rem'
            }}>
              {person.status.toUpperCase()}
            </div>
            {isCliente && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 200, 0, 0.05)', border: '1px solid rgba(255, 200, 0, 0.2)' }}>
                <p style={{ fontSize: '0.7rem', color: '#ffc800', textAlign: 'center', fontWeight: 'bold' }}>
                  MODO_LECTURA_CLIENTE: Las acciones de outreach están bloqueadas para este rol.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
