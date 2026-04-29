"use client";

import { useState, useTransition } from 'react';
import { SUPPORTED_ACTORS, type ApifyActorConfig } from '@/lib/apify-actors-config';
import { Loader2, Check, X } from 'lucide-react';

interface SearchLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchLeadsModal({ isOpen, onClose }: SearchLeadsModalProps) {
  // Inicializar con el primer actor del Record
  const firstActorId = Object.keys(SUPPORTED_ACTORS)[0];
  const [selectedActor, setSelectedActor] = useState<string>(firstActorId);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Acceder directo al Record (no .find())
  const currentActor = SUPPORTED_ACTORS[selectedActor];

  async function handleSearch(formData: FormData) {
    setResults([]);
    setSelectedLeads(new Set());
    
    // Construir el body del request desde el FormData
    const body: Record<string, any> = { actorId: selectedActor };
    for (const [key, value] of formData.entries()) {
      if (value) {
        body[key] = isNaN(Number(value)) ? value : Number(value);
      }
    }

    setIsSearching(true);

    try {
      // LLAMADA AL API ROUTE EN LUGAR DE SERVER ACTION
      const response = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setIsSearching(false);

      if (data.success) {
        setResults(data.results || []);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setIsSearching(false);
      alert(`Error de conexión: ${error.message}`);
    }
  }

  function handleSelectLead(index: number) {
    setSelectedLeads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  async function handleImportSelected() {
    if (selectedLeads.size === 0) return;
    
    setIsImporting(true);
    const leadsToImport = Array.from(selectedLeads).map((index) => results[index]);
    
    // Usar startTransition para no bloquear la UI
    startTransition(async () => {
      try {
        // TODO: Crear API Route para import también, por ahora usamos Server Action
        // Por limpieza arquitectónica, deberíamos mover esto también a /api/leads/import
        const response = await fetch('/api/leads/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            results: leadsToImport, 
            actorId: selectedActor 
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert(`✅ ${data.count} leads importados correctamente.`);
          setResults([]);
          setSelectedLeads(new Set());
          onClose();
          // Refrescar el dashboard para mostrar los nuevos leads
          window.location.reload();
        } else {
          alert(`❌ Error al importar: ${data.error}`);
        }
      } catch (err: any) {
        alert(`❌ Error inesperado: ${err.message}`);
      } finally {
        setIsImporting(false);
      }
    });
  }

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative glass-panel border-[#00ff8c]/20 bg-[#05070a] text-[#f0f6fc] max-w-4xl max-h-[90vh] overflow-y-auto w-full m-4">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">
                Buscar Leads con <span className="text-[#00ff8c]">APIFY</span>
              </h2>
              <p className="text-[10px] font-mono text-[#8b949e] uppercase tracking-[0.2em] mt-2">
                Seleccioná un actor, definí los criterios y buscá leads automáticamente.
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(new FormData(e.target as HTMLFormElement)); }} className="p-6 flex flex-col gap-6">
          {/* Selector de Actor */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b949e]">
              Actor de APIFY
            </label>
            <select
              value={selectedActor}
              onChange={(e) => setSelectedActor(e.target.value)}
              className="w-full bg-[#0a1922] border border-[#00ff8c]/20 rounded-lg px-4 py-3 text-sm text-[#f0f6fc] focus:outline-none focus:border-[#00ff8c]/50"
            >
              {Object.values(SUPPORTED_ACTORS).map((actor) => (
                <option key={actor.id} value={actor.id}>
                  {actor.name} - {actor.description}
                </option>
              ))}
            </select>
          </div>

          {/* Campos dinámicos */}
          {currentActor?.inputFields.map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <label htmlFor={field.name} className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b949e]">
                {field.label} {field.required && <span className="text-[#ff5555]">*</span>}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type === 'number' ? 'number' : 'text'}
                defaultValue={field.defaultValue?.toString() || ''}
                required={field.required}
                className="bg-[#0a1922] border-[#00ff8c]/20 text-[#f0f6fc] placeholder:text-[#8b949e]/40 focus:border-[#00ff8c]/50 rounded-lg px-4 py-3 text-sm w-full focus:outline-none"
              />
            </div>
          ))}

          {/* Botón de búsqueda */}
          <button
            type="submit"
            disabled={isSearching}
            className="w-full bg-[#00ff8c]/10 border border-[#00ff8c]/30 text-[#00ff8c] hover:bg-[#00ff8c]/20 font-mono text-sm uppercase tracking-widest transition-all duration-300 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                Buscando...
              </>
            ) : (
              'Ejecutar Búsqueda'
            )}
          </button>
        </form>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="p-6 border-t border-white/10 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#00ff8c]">
              Resultados ({results.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b949e]">Sel</th>
                    <th className="text-left p-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b949e]">Nombre</th>
                    <th className="text-left p-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b949e]">Email</th>
                    <th className="text-left p-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b949e]">Ubicación</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((lead, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(index)}
                          onChange={() => handleSelectLead(index)}
                          className="w-4 h-4 accent-[#00ff8c]"
                        />
                      </td>
                      <td className="p-2 text-[#f0f6fc]">{lead.fullName || lead.title || 'N/A'}</td>
                      <td className="p-2 text-[#8b949e]">{lead.email || 'N/A'}</td>
                      <td className="p-2 text-[#8b949e]">{lead.location || lead.address || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleImportSelected}
              disabled={selectedLeads.size === 0 || isImporting}
              className="w-full bg-[#00d1ff]/10 border border-[#00d1ff]/30 text-[#00d1ff] hover:bg-[#00d1ff]/20 font-mono text-sm uppercase tracking-widest transition-all duration-300 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? 'Importando...' : `Importar Seleccionados (${selectedLeads.size})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
