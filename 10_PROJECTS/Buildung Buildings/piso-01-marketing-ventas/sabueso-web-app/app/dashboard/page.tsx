import Link from 'next/link';
import { UserButton } from '@stackframe/stack';
import { DashboardClient } from '@/components/DashboardClient';
import { stackServerApp } from '@/stack/server';
import { db } from '@/lib/db';
import { people, activities, userProfiles, companies } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Activity, TrendingUp, Users, Zap, Shield, Briefcase } from 'lucide-react';

export default async function Dashboard() {
  const user = await stackServerApp.getUser();
  if (!user) redirect('/handler/sign-in');

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, user.id)
  });
  if (!profile) redirect('/onboarding');

  const allPeople = await db.query.people.findMany({
    with: {
      company: true,
    },
    orderBy: [desc(people.createdAt)],
    limit: 50,
  });

  const allLeads = allPeople.map(p => ({
    id: p.id,
    name: p.fullName,
    company: p.company?.name || 'S/E',
    email: p.email,
    status: p.status,
    score: p.score,
    createdAt: p.createdAt,
  }));

  const recentActivities = await db.query.activities.findMany({
    orderBy: [desc(activities.createdAt)],
    limit: 5,
  });

  const totalLeads = allLeads.length;
  const qualifiedLeads = allLeads.filter(l => l.status === 'qualified').length;
  const handoverLeads = allLeads.filter(l => l.status === 'handover').length;
  const conversionRate = totalLeads > 0
    ? ((handoverLeads / totalLeads) * 100).toFixed(1)
    : '0.0';
  const qualifyRate = totalLeads > 0
    ? ((qualifiedLeads / totalLeads) * 100).toFixed(1)
    : '0.0';

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    new:       { label: 'NEW',       color: 'rgba(240, 246, 252, 0.8)',  bg: 'rgba(240, 246, 252, 0.05)' },
    qualified: { label: 'QUALIFIED', color: 'rgba(0, 255, 140, 0.9)',   bg: 'rgba(0, 255, 140, 0.08)'   },
    outreach:  { label: 'OUTREACH',  color: 'rgba(0, 209, 255, 0.9)',    bg: 'rgba(0, 209, 255, 0.08)'   },
    contacted: { label: 'CONTACTED', color: 'rgba(255, 200, 0, 0.9)',   bg: 'rgba(255, 200, 0, 0.08)'   },
    handover:  { label: 'HANDOVER',  color: 'rgba(191, 107, 255, 0.9)',  bg: 'rgba(191, 107, 255, 0.08)' },
    rejected:  { label: 'REJECTED',  color: 'rgba(255, 80, 80, 0.8)',   bg: 'rgba(255, 80, 80, 0.06)'   },
  };

  const isCliente = profile.role === 'cliente';
  const isAdmin = profile.role === 'admin';

  return (
    <main className="min-h-screen relative flex flex-col bg-[#05070a] text-[#f0f6fc] font-sans">
      {/* Background */}
      <div className="cyber-bg" />
      <div className="grid-bg" />
      <div className="scanlines opacity-[0.08]" />

      {/* Nav */}
      <div className="w-full border-b border-white/5 bg-black/30 backdrop-blur-md relative z-50">
        <nav className="flex items-center justify-between px-6 py-4 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#00ff8c]/20 blur-lg group-hover:bg-[#00ff8c]/40 transition-all duration-500" />
                <div className="relative w-9 h-9 glass-panel flex items-center justify-center font-black text-base text-[#00ff8c] border border-[#00ff8c]/30">
                  S
                </div>
              </div>
              <div>
                <div className="text-base font-extrabold tracking-tighter text-white uppercase leading-none">
                  Sabueso<span className="text-[#00ff8c]">_</span>
                </div>
                <div className="text-[7px] font-mono text-[#8b949e] tracking-[0.4em] uppercase">PISO_01 // DASHBOARD</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1 text-[8px] font-mono text-[#8b949e] tracking-widest uppercase">
              <span className="text-[#8b949e]/40">/</span>
              <span className="text-[#00ff8c]/70">COMMAND_CENTER</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#00ff8c]/5 border border-[#00ff8c]/15 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff8c] animate-pulse" />
              <span className="text-[8px] font-mono text-[#00ff8c]/70 tracking-widest uppercase">
                {profile.role.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[8px] font-mono text-[#8b949e] tracking-widest uppercase">
              <Shield size={10} className="text-[#00d1ff]/60" />
              <span className="hidden sm:inline">{profile.company || 'BIENVENIDO'}</span>
            </div>
            <UserButton />
          </div>
        </nav>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-10 max-w-[1600px] mx-auto w-full relative z-10">

        {!isCliente && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              {
                label: 'TOTAL LEADS',
                value: totalLeads,
                suffix: '',
                icon: <Users size={16} />,
                color: '#f0f6fc',
                glow: 'rgba(240,246,252,0.1)',
                border: 'rgba(48,54,61,0.5)',
              },
              {
                label: 'QUALIFICADOS',
                value: qualifiedLeads,
                suffix: '',
                icon: <Zap size={16} />,
                color: '#00ff8c',
                glow: 'rgba(0,255,140,0.15)',
                border: 'rgba(0,255,140,0.2)',
              },
              {
                label: 'QUALIFY RATE',
                value: qualifyRate,
                suffix: '%',
                icon: <TrendingUp size={16} />,
                color: '#00d1ff',
                glow: 'rgba(0,209,255,0.15)',
                border: 'rgba(0,209,255,0.2)',
              },
              {
                label: 'CONVERSION',
                value: conversionRate,
                suffix: '%',
                icon: <Activity size={16} />,
                color: '#ffc800',
                glow: 'rgba(255,200,0,0.15)',
                border: 'rgba(255,200,0,0.2)',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-panel p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01]"
                style={{ borderColor: stat.border, boxShadow: `0 0 30px ${stat.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono tracking-[0.25em] uppercase" style={{ color: stat.color }}>{stat.label}</span>
                  <div style={{ color: stat.color, opacity: 0.6 }}>{stat.icon}</div>
                </div>
                <div className="text-4xl font-black tracking-tight" style={{ color: stat.color }}>
                  {stat.value}<span className="text-xl opacity-60">{stat.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

          {/* Main Content Area */}
          <section>
            {isCliente ? (
              <div className="flex flex-col gap-6">
                <div className="glass-panel p-8 border-[#00ff8c]/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight uppercase">Mis_Leads_Calificados</h2>
                      <p className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] mt-1">
                        [ ENTREGA_DE_PROSPECTOS: LISTOS_PARA_CONTACTO ]
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-[#00ff8c]/10 border border-[#00ff8c]/30 rounded text-[10px] font-mono text-[#00ff8c] uppercase tracking-widest">
                      {allLeads.filter(l => l.status === 'handover').length} DISPONIBLES
                    </div>
                  </div>
                  <DashboardClient initialLeads={allLeads.filter(l => l.status === 'handover')} role={profile.role} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {isAdmin && (
                  <div className="glass-panel p-6 border-[#00d1ff]/20 bg-[#00d1ff]/5 mb-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className="text-[#00d1ff]" size={18} />
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-[#00d1ff]">Panel de Administración</h3>
                          <p className="text-[9px] font-mono text-[#8b949e] uppercase">Gestión de sistema y usuarios activos</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 font-mono text-[9px] bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all uppercase tracking-widest">
                        Configurar Sistema
                      </button>
                    </div>
                  </div>
                )}
                <DashboardClient initialLeads={allLeads} role={profile.role} />
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">

            {/* Activity Feed */}
            <div className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity size={12} className="text-[#00ff8c]" />
                <h4 className="font-mono text-[9px] text-white tracking-[0.3em] uppercase">Ultima_Actividad</h4>
              </div>
              <ul className="flex flex-col gap-4">
                {recentActivities.length === 0 ? (
                  <li className="font-mono text-[10px] text-[#8b949e]/40 uppercase tracking-wider">ESPERANDO_ACTIVIDAD_...</li>
                ) : (
                  recentActivities.map(activity => (
                    <li key={activity.id} className="flex items-start gap-3">
                      <span className="font-mono text-[8px] text-[#00ff8c] mt-0.5 shrink-0">[OK]</span>
                      <span className="font-mono text-[10px] text-[#8b949e] leading-relaxed">{activity.description}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Pipeline Status */}
            {!isCliente && (
              <div className="glass-panel p-6 border-[#00ff8c]/10">
                <h4 className="font-mono text-[9px] text-white tracking-[0.3em] uppercase mb-6">Pipeline_Status</h4>
                <div className="flex flex-col gap-3">
                  {Object.entries(statusConfig).map(([key, cfg]) => {
                    const count = allLeads.filter(l => l.status === key).length;
                    const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: cfg.color }}>{cfg.label}</span>
                          <span className="font-mono text-[10px] text-[#8b949e]">{count}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}60` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* System Info */}
            <div className="glass-panel p-6 border-white/5">
              <h4 className="font-mono text-[9px] text-white tracking-[0.3em] uppercase mb-5">System_Node</h4>
              <div className="flex flex-col gap-3 font-mono text-[9px] uppercase tracking-wider text-[#8b949e]">
                <div className="flex justify-between">
                  <span>Stack Auth</span>
                  <span className="text-[#00ff8c]">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>Neon DB</span>
                  <span className="text-[#00ff8c]">CONNECTED</span>
                </div>
                <div className="flex justify-between">
                  <span>Resend API</span>
                  <span className="text-[#00ff8c]">READY</span>
                </div>
                <div className="flex justify-between">
                  <span>GPT-4o Engine</span>
                  <span className="text-[#ffc800]">STANDBY</span>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}
