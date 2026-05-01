"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LeadUpload from "./LeadUpload";
import { 
  Upload, X, Database, Zap, Search, Filter, 
  ChevronDown, CheckCircle2, Trash2, ArrowRight,
  Users
} from "lucide-react";
import { SearchLeadsModal } from "@/components/SearchLeadsModal";
import { processAllLeadsAction, deleteLeadsAction } from "@/lib/actions/leads";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string | null;
  status: string;
  score: number | null;
  createdAt: Date;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  all:       { label: 'TODOS',      color: 'rgba(240, 246, 252, 0.6)',  bg: 'transparent' },
  new:       { label: 'NEW',       color: 'rgba(240, 246, 252, 0.8)',  bg: 'rgba(240, 246, 252, 0.05)' },
  qualified: { label: 'QUALIFIED', color: 'rgba(0, 255, 140, 0.9)',   bg: 'rgba(0, 255, 140, 0.08)'   },
  outreach:  { label: 'OUTREACH',  color: 'rgba(0, 209, 255, 0.9)',    bg: 'rgba(0, 209, 255, 0.08)'   },
  contacted: { label: 'CONTACTED', color: 'rgba(255, 200, 0, 0.9)',   bg: 'rgba(255, 200, 0, 0.08)'   },
  handover:  { label: 'HANDOVER',  color: 'rgba(191, 107, 255, 0.9)',  bg: 'rgba(191, 107, 255, 0.08)' },
  rejected:  { label: 'REJECTED',  color: 'rgba(255, 80, 80, 0.8)',   bg: 'rgba(255, 80, 80, 0.06)'   },
};

export function DashboardClient({ initialLeads, role }: { initialLeads: Lead[], role: string }) {
  const isCliente = role === 'cliente';
  const isAdmin = role === 'admin';
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return initialLeads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [initialLeads, searchQuery, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  async function handleProcessAll() {
    setIsProcessing(true);
    const result = await processAllLeadsAction();
    setIsProcessing(false);
    if (result.success) {
      router.refresh();
    } else {
      alert("Error al procesar leads");
    }
  }

  async function handleDeleteSelected() {
    if (!confirm(`¿Estás seguro de que querés eliminar ${selectedIds.size} leads? Esta acción es irreversible.`)) return;
    
    setIsProcessing(true);
    const result = await deleteLeadsAction(Array.from(selectedIds));
    setIsProcessing(false);
    
    if (result.success) {
      setSelectedIds(new Set());
      router.refresh();
    } else {
      alert("Error al eliminar leads");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database size={14} className="text-[#00ff8c]" />
          <h3 className="font-mono text-[9px] text-white tracking-[0.3em] uppercase">Pipeline_Activo</h3>
          <span className="font-mono text-[8px] text-[#8b949e] border border-white/5 px-2 py-0.5 rounded-full uppercase">
            {filteredLeads.length} de {initialLeads.length} leads
          </span>
        </div>
        
          {!isCliente && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-widest transition-all duration-300"
              style={showUpload 
                ? { background: 'transparent', color: '#f0f6fc', border: '1px solid rgba(48,54,61,0.5)' }
                : { background: 'rgba(0,255,140,0.1)', color: '#00ff8c', border: '1px solid rgba(0,255,140,0.25)' }
              }
            >
              {showUpload
                ? <><X size={11} /> CERRAR</>
                : <><Upload size={11} /> IMPORTAR LEADS CSV</>
              }
            </button>

            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-widest transition-all duration-300"
              style={{ 
                background: 'rgba(0,209,255,0.1)', 
                color: '#00d1ff', 
                border: '1px solid rgba(0,209,255,0.25)'
              }}
            >
              <Search size={11} /> BUSCAR LEADS
            </button>
            
            <button
              id="process-all-ai-btn"
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-widest transition-all duration-300"
              style={{ 
                background: 'rgba(0,209,255,0.1)', 
                color: '#00d1ff', 
                border: '1px solid rgba(0,209,255,0.25)',
                opacity: isProcessing ? 0.5 : 1,
                cursor: isProcessing ? 'wait' : 'pointer'
              }}
            >
              <Zap size={11} /> {isProcessing ? 'PROCESANDO...' : 'PROCESAR_TODOS_AI'}
            </button>
          </div>
        )}
      </div>

      {showUpload && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <LeadUpload />
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="glass-panel p-2 flex flex-wrap items-center gap-3 border-white/5 bg-white/2">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
          <input
            id="search-input"
            type="text"
            placeholder="BUSCAR_POR_NOMBRE_EMPRESA_EMAIL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-sm py-2 pl-9 pr-4 font-mono text-[10px] text-white placeholder:text-[#8b949e]/40 focus:border-[#00ff8c]/30 outline-none transition-all"
          />
        </div>

        <div className="relative">
          <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-black/40 border border-white/10 rounded-sm py-2 pl-9 pr-8 font-mono text-[10px] text-white outline-none focus:border-[#00ff8c]/30 cursor-pointer"
          >
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <option key={key} value={key} className="bg-[#0d1117]">{cfg.label}</option>
            ))}
          </select>
          <ChevronDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] pointer-events-none" />
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[#ff5050]/10 border border-[#ff5050]/20 animate-in fade-in zoom-in-95 duration-200">
            <span className="font-mono text-[9px] text-[#ff5050] uppercase tracking-wider">{selectedIds.size} SELECCIONADOS</span>
            <button 
              id="bulk-delete-btn"
              onClick={handleDeleteSelected}
              className="p-1 hover:bg-[#ff5050]/20 rounded text-[#ff5050] transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Leads List */}
      <div className="flex flex-col gap-3">
        {filteredLeads.length === 0 ? (
          <div className="glass-panel p-16 text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 glass-panel flex items-center justify-center border-white/10">
              <Users size={24} className="text-[#8b949e]/20" />
            </div>
            <div>
              <p className="font-mono text-sm text-[#8b949e] uppercase tracking-widest">
                {searchQuery || statusFilter !== "all" ? "NO_HAY_RESULTADOS_CON_LOS_FILTROS_ACTUALES" : "NO_HAY_LEADS_EN_EL_SISTEMA"}
              </p>
              <p className="font-mono text-[10px] text-[#8b949e]/40 mt-2 uppercase tracking-wider">
                {searchQuery || statusFilter !== "all" ? "Intentá ajustar los parámetros de búsqueda" : "Subí un CSV para iniciar el hunting masivo"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Select All Row */}
            <div className="flex items-center px-6 py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    id="select-all-checkbox"
                    type="checkbox"
                    className="sr-only"
                    checked={selectedIds.size === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                  />
                  <div className={`w-3.5 h-3.5 border transition-all duration-200 ${
                    selectedIds.size === filteredLeads.length && filteredLeads.length > 0
                    ? "bg-[#00ff8c] border-[#00ff8c]" 
                    : "border-white/20 group-hover:border-white/40"
                  }`}>
                    {selectedIds.size === filteredLeads.length && filteredLeads.length > 0 && <CheckCircle2 size={10} className="text-black" />}
                  </div>
                </div>
                <span className="font-mono text-[8px] text-[#8b949e] uppercase tracking-widest group-hover:text-white transition-colors">Seleccionar todos</span>
              </label>
            </div>

            {/* List Items */}
            {filteredLeads.map((lead, i) => {
              const cfg = statusConfig[lead.status] ?? statusConfig['new'];
              const isSelected = selectedIds.has(lead.id);
              return (
                <div
                  key={lead.id}
                  className={`glass-panel flex items-center justify-between px-6 py-4 transition-all duration-300 group ${
                    isSelected ? 'border-[#00ff8c]/30 bg-[#00ff8c]/2' : 'hover:border-white/10'
                  }`}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <div className="flex items-center gap-6">
                    {/* Checkbox */}
                    <div 
                      className="relative flex items-center justify-center cursor-pointer"
                      onClick={() => toggleSelect(lead.id)}
                    >
                      <input
                        id={`lead-checkbox-${lead.id}`}
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        readOnly
                      />
                      <div className={`w-3.5 h-3.5 border transition-all duration-200 ${
                        isSelected ? "bg-[#00ff8c] border-[#00ff8c]" : "border-white/10 group-hover:border-[#00ff8c]/30"
                      }`}>
                        {isSelected && <CheckCircle2 size={10} className="text-black" />}
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-[#8b949e]/40 w-4 select-none">{String(i + 1).padStart(2, '0')}</span>
                    
                    <div>
                      <div className="font-bold text-white tracking-tight group-hover:text-[#00ff8c] transition-colors duration-300">
                        {lead.company}
                      </div>
                      <div className="font-mono text-[10px] text-[#8b949e] mt-0.5 tracking-widest uppercase flex items-center gap-2">
                        {lead.name} 
                        {lead.email && <span className="text-[#8b949e]/40 text-[9px] lowercase opacity-0 group-hover:opacity-100 transition-opacity">&lt;{lead.email}&gt;</span>}
                        <span className="text-[#8b949e]/20">// ID_{lead.id.slice(0, 6)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div
                      className="px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] uppercase rounded-sm border"
                      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.color + '40' }}
                    >
                      {cfg.label}
                    </div>
                    
                    <span className="hidden sm:flex flex-col items-end w-12">
                      <span className="font-mono text-[8px] text-[#8b949e] uppercase tracking-wider">Score</span>
                      <span className="font-mono text-xs font-bold" style={{ color: (lead.score ?? 0) >= 70 ? '#00ff8c' : (lead.score ?? 0) >= 40 ? '#00d1ff' : '#8b949e' }}>
                        {lead.score ?? '—'}
                      </span>
                    </span>

                    <Link
                      href={`/dashboard/lead/${lead.id}`}
                      className="flex items-center gap-1.5 px-4 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-black bg-[#00ff8c] hover:bg-[#00e07a] transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      VER <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>

    {/* Modal de Búsqueda APIFY */}
    <SearchLeadsModal 
      isOpen={isSearchModalOpen} 
      onClose={() => setIsSearchModalOpen(false)} 
    />
    </>
  );
}
