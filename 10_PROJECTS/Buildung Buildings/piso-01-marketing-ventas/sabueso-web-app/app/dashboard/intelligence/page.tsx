import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import { userProfiles, activities } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Zap, Shield, Cpu, Network, Globe, MessageSquare } from "lucide-react";

export default async function IntelligencePage() {
  const user = await stackServerApp.getUser();
  if (!user) redirect('/handler/sign-in');

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, user.id)
  });

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  const recentLogs = await db.query.activities.findMany({
    orderBy: [desc(activities.createdAt)],
    limit: 15,
  });

  const nodes = [
    { name: "SABUESO_NODE_01", status: "ACTIVO", load: "12%", type: "SCRAPER" },
    { name: "SABUESO_NODE_02", status: "ACTIVO", load: "45%", type: "LLM_PROCESSOR" },
    { name: "SABUESO_NODE_03", status: "STANDBY", load: "0%", type: "ENRICHMENT" },
  ];

  return (
    <main className="scanlines flicker" style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <div className="cyber-bg" />
      
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(0, 255, 140, 0.2)', paddingBottom: '1rem' }}>
        <h1 className="glow-text-green" style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-2px', color: 'var(--accent-green)' }}>
          CENTRO_DE_INTELIGENCIA_
        </h1>
        <p className="font-mono" style={{ color: '#8b949e', marginTop: '0.5rem', fontSize: '0.8rem' }}>
          [ MONITOREO_DE_AGENTES_Y_AUTOMATIZACION ]
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* System Health */}
        <div className="brutalist-card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
          <h3 className="section-label" style={{ color: 'var(--accent-green)' }}>ESTADO_RED_</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            {nodes.map(node => (
              <div key={node.name} style={{ border: '1px solid #111', padding: '1rem', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'white' }}>{node.name}</span>
                  <span style={{ fontSize: '0.6rem', color: node.status === 'ACTIVO' ? 'var(--accent-green)' : '#555' }}>
                    [{node.status}]
                  </span>
                </div>
                <div style={{ width: '100%', height: '2px', background: '#222' }}>
                  <div style={{ width: node.load, height: '100%', background: 'var(--accent-green)' }} />
                </div>
                <p style={{ fontSize: '0.5rem', color: '#444', marginTop: '0.5rem' }}>TYPE: {node.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="brutalist-card">
          <h3 className="section-label">CAPACIDADES_ACTIVAS_</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="brutalist-card" style={{ padding: '1rem', textAlign: 'center', background: '#050505' }}>
              <Globe size={24} className="text-[var(--accent-blue)]" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: '0.6rem', fontWeight: '900' }}>WEB_SCRAPING</p>
            </div>
            <div className="brutalist-card" style={{ padding: '1rem', textAlign: 'center', background: '#050505' }}>
              <Cpu size={24} className="text-[var(--accent-purple)]" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: '0.6rem', fontWeight: '900' }}>QUALIFICATION</p>
            </div>
            <div className="brutalist-card" style={{ padding: '1rem', textAlign: 'center', background: '#050505' }}>
              <MessageSquare size={24} className="text-[var(--accent-green)]" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: '0.6rem', fontWeight: '900' }}>OUTREACH_GEN</p>
            </div>
            <div className="brutalist-card" style={{ padding: '1rem', textAlign: 'center', background: '#050505' }}>
              <Network size={24} className="text-[var(--accent-yellow)]" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: '0.6rem', fontWeight: '900' }}>DATA_ENRICH</p>
            </div>
          </div>
        </div>

        {/* Integration Logs */}
        <div className="brutalist-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="section-label">LOGS_DE_INTEGRACION_</h3>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#8b949e', background: 'black', padding: '1.5rem', marginTop: '1rem', overflowY: 'auto', maxHeight: '300px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {recentLogs.length === 0 ? (
              <p className="flicker">[WAIT] ESPERANDO_EVENTOS_...</p>
            ) : (
              recentLogs.map((log, i) => (
                <p key={log.id} style={{ marginBottom: '0.2rem' }}>
                  <span style={{ color: i === 0 ? 'var(--accent-green)' : '#555' }}>
                    [{new Date(log.createdAt).toLocaleTimeString()}]
                  </span>
                  {' '}
                  <span style={{ color: log.type === 'AI_PROCESSING' ? 'var(--accent-purple)' : '#8b949e' }}>
                    {log.type}:
                  </span>
                  {' '}
                  {log.description}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
