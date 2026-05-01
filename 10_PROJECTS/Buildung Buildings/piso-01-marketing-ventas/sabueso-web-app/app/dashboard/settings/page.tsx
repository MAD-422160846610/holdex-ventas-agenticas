import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Settings, Shield, Key, Bell, Database, Cpu } from "lucide-react";

export default async function SettingsPage() {
  const user = await stackServerApp.getUser();
  if (!user) redirect('/handler/sign-in');

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, user.id)
  });

  if (!profile || (profile.role !== 'admin' && profile.role !== 'vendedor')) {
    redirect('/dashboard');
  }

  const isAdmin = profile.role === 'admin';

  return (
    <main className="scanlines flicker" style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <div className="cyber-bg" />
      
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
        <h1 className="glow-text" style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-2px' }}>
          CONFIGURACION_SISTEMA_
        </h1>
        <p className="font-mono" style={{ color: '#8b949e', marginTop: '0.5rem', fontSize: '0.8rem' }}>
          [ CONTROL_DE_PARAMETROS_Y_SEGURIDAD ]
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Profile Settings */}
        <div className="brutalist-card">
          <h3 className="section-label">PERFIL_USUARIO_</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.6rem', color: '#8b949e' }}>NOMBRE_DISPLAY</p>
              <p style={{ fontWeight: 'bold' }}>{user.displayName || 'S/N'}</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.6rem', color: '#8b949e' }}>ROL_ASIGNADO</p>
              <p style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{profile.role.toUpperCase()}</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.6rem', color: '#8b949e' }}>EMPRESA</p>
              <p style={{ fontWeight: 'bold' }}>{profile.company || 'S/E'}</p>
            </div>
          </div>
        </div>

        {/* AI & Automation (Admin Only) */}
        {isAdmin && (
          <div className="brutalist-card" style={{ borderLeft: '4px solid var(--accent-yellow)' }}>
            <h3 className="section-label" style={{ color: 'var(--accent-yellow)' }}>PARAMETROS_IA_</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.7rem' }}>MODELO_PREDETERMINADO</p>
                  <span className="tag" style={{ fontSize: '0.5rem' }}>GPT-4O</span>
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.7rem' }}>UMBRAL_CALIFICACION (0-100)</p>
                <input type="range" disabled defaultValue="70" style={{ width: '100%', marginTop: '0.5rem' }} />
                <p style={{ fontSize: '0.5rem', color: '#555', marginTop: '0.2rem' }}>LEADS BAJO 70 SERAN MARCADOS COMO 'REJECTED' AUTOMATICAMENTE.</p>
              </div>
              <button disabled className="px-4 py-2 bg-[var(--accent-yellow)] text-black font-black text-[10px] uppercase tracking-widest mt-2 opacity-50 cursor-not-allowed">
                Actualizar Motor
              </button>
            </div>
          </div>
        )}

        {/* System Integrations (Admin Only) */}
        {isAdmin && (
          <div className="brutalist-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
            <h3 className="section-label" style={{ color: 'var(--accent-blue)' }}>INTEGRACIONES_</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key size={14} className="text-[#555]" />
                  <span style={{ fontSize: '0.7rem' }}>RESEND_API</span>
                </div>
                <span style={{ fontSize: '0.5rem', color: 'var(--accent-green)' }}>CONECTADO</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={14} className="text-[#555]" />
                  <span style={{ fontSize: '0.7rem' }}>NEON_DB</span>
                </div>
                <span style={{ fontSize: '0.5rem', color: 'var(--accent-green)' }}>SINCRONIZADO</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={14} className="text-[#555]" />
                  <span style={{ fontSize: '0.7rem' }}>APOLLO_ENRICH</span>
                </div>
                <span style={{ fontSize: '0.5rem', color: '#555' }}>MOCK_MODE</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
