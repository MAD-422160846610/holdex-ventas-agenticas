"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Building2, Briefcase, Zap, Settings, Shield } from "lucide-react";

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const allItems = [
    { name: "PROSPECTOS_", icon: Users, href: "/dashboard", roles: ['admin', 'vendedor', 'cliente'] },
    { name: "CUENTAS_", icon: Building2, href: "/dashboard/companies", roles: ['admin', 'vendedor'] },
    { name: "OPORTUNIDADES_", icon: Briefcase, href: "/dashboard/opportunities", roles: ['admin', 'vendedor'] },
    { name: "INTELIGENCIA_", icon: Zap, href: "/dashboard/intelligence", roles: ['admin'] },
  ];

  const navItems = allItems.filter(item => item.roles.includes(role));

  return (
    <aside className="sidebar-container" style={{
      width: '240px',
      height: '100vh',
      background: 'black',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      padding: '1.5rem',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
        <h2 className="glow-text" style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-1px' }}>
          SABUESO_V2
        </h2>
        <div style={{ fontSize: '0.6rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>MASTER_SUITE</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                fontSize: '0.7rem',
                fontWeight: '700',
                textDecoration: 'none',
                color: isActive ? 'var(--accent-green)' : '#8b949e',
                background: isActive ? 'rgba(0, 255, 140, 0.05)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent-green)' : 'transparent',
                transition: 'all 0.2s ease',
                letterSpacing: '1px'
              }}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {role !== 'cliente' && (
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
            <Shield size={14} className="text-[#555]" />
            <span style={{ fontSize: '0.6rem', color: '#555', fontWeight: '900' }}>SISTEMA_SOBERANO</span>
          </div>
          
          <Link 
            href="/dashboard/settings" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.75rem 1rem', 
              fontSize: '0.7rem', 
              color: '#8b949e', 
              textDecoration: 'none' 
            }}
          >
            <Settings size={16} />
            CONFIG_
          </Link>
        </div>
      )}
    </aside>
  );
}
