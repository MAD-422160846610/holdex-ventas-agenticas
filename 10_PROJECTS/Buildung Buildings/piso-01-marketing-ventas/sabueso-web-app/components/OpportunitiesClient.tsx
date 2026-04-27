"use client";

import { Briefcase, Clock, DollarSign, Target } from "lucide-react";

const STAGE_CONFIG: Record<string, { label: string; color: string }> = {
  discovery:   { label: 'DESCUBRIMIENTO', color: 'var(--accent-blue)' },
  proposal:    { label: 'PROPUESTA',      color: 'var(--accent-purple)' },
  negotiation: { label: 'NEGOCIACION',    color: 'var(--accent-yellow)' },
  closed_won:  { label: 'GANADO',         color: 'var(--accent-green)' },
  closed_lost: { label: 'PERDIDO',         color: '#ff5050' },
};

interface Opportunity {
  id: string;
  name: string;
  amount: number | null;
  stage: string;
  company: { name: string };
  person: { fullName: string } | null;
  createdAt: string;
}

export function OpportunitiesClient({ initialOpportunities }: { initialOpportunities: Opportunity[] }) {
  const grouped = initialOpportunities.reduce((acc, opp) => {
    if (!acc[opp.stage]) acc[opp.stage] = [];
    acc[opp.stage].push(opp);
    return acc;
  }, {} as Record<string, Opportunity[]>);

  const stages = ['discovery', 'proposal', 'negotiation', 'closed_won'];

  return (
    <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem' }}>
      {stages.map(stage => {
        const config = STAGE_CONFIG[stage];
        const items = grouped[stage] || [];
        const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);

        return (
          <div key={stage} style={{ minWidth: '320px', flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem',
              padding: '0.5rem',
              borderBottom: `2px solid ${config.color}`
            }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: '900', color: config.color }}>{config.label}</h3>
              <span className="tag" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>{items.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(opp => (
                <div key={opp.id} className="brutalist-card hover-glow" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>{opp.name}</h4>
                    <Target size={14} className="text-[#333]" />
                  </div>
                  
                  <p style={{ fontSize: '0.7rem', color: '#8b949e', marginBottom: '1rem' }}>{opp.company.name}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-green)' }}>
                      <DollarSign size={12} />
                      <span style={{ fontSize: '0.8rem', fontWeight: '900' }}>
                        {(opp.amount || 0).toLocaleString()} <span style={{ fontSize: '0.6rem' }}>USD</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#555' }}>
                      <Clock size={12} />
                      <span style={{ fontSize: '0.6rem' }}>{new Date(opp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div style={{ 
                  height: '100px', 
                  border: '1px dashed #222', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}>
                  <p style={{ fontSize: '0.6rem', color: '#333' }}>SIN_DEALS_</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <p style={{ fontSize: '0.6rem', color: '#555' }}>VALOR_TOTAL:</p>
              <p style={{ fontSize: '1rem', fontWeight: '900', color: 'white' }}>${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
