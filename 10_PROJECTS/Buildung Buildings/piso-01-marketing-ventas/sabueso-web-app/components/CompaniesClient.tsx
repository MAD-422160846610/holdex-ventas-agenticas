"use client";

import { useState, useMemo } from "react";
import { Search, Building2, Users, Briefcase, Zap, ExternalLink } from "lucide-react";

interface Company {
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  annualRevenue: string | null;
  techStack: string[] | null;
  people: any[];
  opportunities: any[];
}

export function CompaniesClient({ initialCompanies }: { initialCompanies: Company[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    return initialCompanies.filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [initialCompanies, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 size={14} className="text-[var(--accent-blue)]" />
          <h3 className="font-mono text-[9px] text-white tracking-[0.3em] uppercase">Cuentas_Identificadas</h3>
          <span className="font-mono text-[8px] text-[#8b949e] border border-white/5 px-2 py-0.5 rounded-full uppercase">
            {filteredCompanies.length} empresas
          </span>
        </div>

        <div className="search-container" style={{ flexGrow: 1, maxWidth: '400px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }} />
          <input 
            type="text" 
            placeholder="BUSCAR_CUENTA_O_INDUSTRIA..."
            className="brutalist-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Companies */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {filteredCompanies.map(company => (
          <div key={company.id} className="brutalist-card hover-glow" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white', marginBottom: '0.2rem' }}>{company.name}</h4>
                <p style={{ color: 'var(--accent-blue)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {company.industry || 'INDUSTRIA_NO_ESPECIFICADA'}
                </p>
              </div>
              <div className="tag" style={{ background: 'rgba(0, 209, 255, 0.1)', color: 'var(--accent-blue)', borderColor: 'var(--accent-blue)', fontSize: '0.6rem' }}>
                {company.size || 'SIZE_UNKNOWN'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888' }}>
                <Users size={14} />
                <span style={{ fontSize: '0.8rem' }}>{company.people.length} Leads</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888' }}>
                <Briefcase size={14} />
                <span style={{ fontSize: '0.8rem' }}>{company.opportunities.length} Opps</span>
              </div>
            </div>

            {company.techStack && company.techStack.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.6rem', color: '#555', marginBottom: '0.5rem', fontWeight: '900' }}>TECH_STACK_</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {company.techStack.slice(0, 4).map((tech, i) => (
                    <span key={i} style={{ 
                      fontSize: '0.6rem', 
                      background: '#111', 
                      color: '#aaa', 
                      padding: '2px 6px', 
                      border: '1px solid #222',
                      borderRadius: '2px'
                    }}>
                      {tech}
                    </span>
                  ))}
                  {company.techStack.length > 4 && (
                    <span style={{ fontSize: '0.6rem', color: '#444' }}>+{company.techStack.length - 4}</span>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
              <button className="brutalist-button" style={{ flex: 1, fontSize: '0.7rem', padding: '0.5rem' }}>
                VER_DETALLES_
              </button>
              {company.domain && (
                <a 
                  href={`https://${company.domain}`} 
                  target="_blank" 
                  className="brutalist-button" 
                  style={{ width: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            
            {/* Visual Flair: Corner Accent */}
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '-10px', 
              width: '30px', 
              height: '30px', 
              background: 'var(--accent-blue)', 
              transform: 'rotate(45deg)',
              opacity: 0.2
            }} />
          </div>
        ))}

        {filteredCompanies.length === 0 && (
          <div className="brutalist-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', borderStyle: 'dashed' }}>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>NO_SE_ENCONTRARON_CUENTAS_CON_ESTE_FILTRO_</p>
          </div>
        )}
      </div>
    </div>
  );
}
