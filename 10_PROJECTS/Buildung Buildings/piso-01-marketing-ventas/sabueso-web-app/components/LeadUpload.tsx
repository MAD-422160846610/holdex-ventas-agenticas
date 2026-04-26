'use client';

import { useState, useRef } from 'react';
import { uploadLeadsAction } from '../lib/actions/leads';
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText, ChevronRight, Settings2 } from 'lucide-react';

type Status = 'idle' | 'mapping' | 'loading' | 'success' | 'error';

export default function LeadUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({
    name: '',
    company: '',
    email: '',
    website: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseHeaders = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const firstLine = text.split('\n')[0];
      const detectedHeaders = firstLine.split(',').map(h => h.trim().replace(/"/g, ''));
      setHeaders(detectedHeaders);
      
      // Auto-mapping attempt
      const newMapping = { ...mapping };
      detectedHeaders.forEach(h => {
        const lower = h.toLowerCase();
        if (lower.includes('nombre') || lower.includes('name')) newMapping.name = h;
        if (lower.includes('empresa') || lower.includes('company')) newMapping.company = h;
        if (lower.includes('email') || lower.includes('correo')) newMapping.email = h;
        if (lower.includes('web') || lower.includes('site')) newMapping.website = h;
      });
      setMapping(newMapping);
      setStatus('mapping');
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    parseHeaders(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('loading');
    setMsg('Sincronizando con la red neuronal...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mapping', JSON.stringify(mapping));

    try {
      const result = await uploadLeadsAction(formData);
      if (result.success) {
        setStatus('success');
        setMsg(`${result.count} leads inyectados con éxito.`);
      } else {
        setStatus('error');
        setMsg(result.error ?? 'Error en la transferencia de datos');
      }
    } catch (error: unknown) {
      setStatus('error');
      setMsg(error instanceof Error ? error.message : 'Error crítico del sistema');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {status === 'idle' && (
        <div
          className={`glass-panel p-10 text-center transition-all duration-300 border-dashed border-2 ${
            isDragging ? 'border-[#00ff8c] bg-[#00ff8c]/5 scale-[1.01]' : 'border-white/10 hover:border-white/20'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) handleFileSelect(droppedFile);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 glass-panel flex items-center justify-center border-white/10 text-[#8b949e]">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="font-mono text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-2">SELECCIONAR_BASE_DATOS_CSV</h3>
              <p className="font-mono text-[9px] text-[#8b949e] uppercase tracking-wider">Arrastrá el archivo o hacé click para explorar</p>
            </div>
          </div>
        </div>
      )}

      {status === 'mapping' && (
        <div className="glass-panel p-6 border-[#00d1ff]/20 bg-[#00d1ff]/2 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Settings2 size={14} className="text-[#00d1ff]" />
            <h3 className="font-mono text-[10px] text-white tracking-[0.2em] uppercase">Confirmar_Mapeo_de_Columnas</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {Object.entries(mapping).map(([field, selectedHeader]) => (
              <div key={field} className="flex flex-col gap-2">
                <label className="font-mono text-[8px] text-[#8b949e] uppercase tracking-widest">{field}</label>
                <select
                  id={`map-${field}-select`}
                  value={selectedHeader}
                  onChange={(e) => setMapping(prev => ({ ...prev, [field]: e.target.value }))}
                  className="bg-black/60 border border-white/10 rounded-sm py-2 px-3 font-mono text-[10px] text-white outline-none focus:border-[#00d1ff]/40"
                >
                  <option value="">-- Ignorar Columna --</option>
                  {headers.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2 font-mono text-[9px] uppercase tracking-widest text-[#8b949e] hover:text-white transition-colors"
            >
              CANCELAR
            </button>
            <button
              id="confirm-mapping-btn"
              onClick={handleUpload}
              className="px-8 py-2 bg-[#00d1ff] text-black font-mono text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#00b8e6] transition-all"
            >
              CONFIRMAR_Y_CARGAR <ChevronRight size={10} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {(status === 'loading' || status === 'success' || status === 'error') && (
        <div className="glass-panel p-10 text-center flex flex-col items-center gap-6 animate-in fade-in duration-300">
          <div className={`w-16 h-16 glass-panel flex items-center justify-center border-white/10 ${
            status === 'loading' ? 'text-[#00d1ff]' : status === 'success' ? 'text-[#00ff8c]' : 'text-[#ff5050]'
          }`}>
            {status === 'loading' ? <Loader2 size={24} className="animate-spin" /> : 
             status === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <h3 className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{
              color: status === 'loading' ? '#00d1ff' : status === 'success' ? '#00ff8c' : '#ff5050'
            }}>
              {status === 'loading' ? 'PROCESANDO_TRANSACCIÓN' : status === 'success' ? 'SINCRO_EXITOSA' : 'ERROR_DE_SISTEMA'}
            </h3>
            <p id="upload-status-msg" className="font-mono text-[9px] text-[#8b949e] uppercase tracking-wider">{msg}</p>
          </div>
          
          {(status === 'success' || status === 'error') && (
            <button
              id="upload-another-btn"
              onClick={() => { setStatus('idle'); setFile(null); }}
              className="mt-2 px-6 py-2 border border-white/10 font-mono text-[9px] text-[#8b949e] uppercase tracking-widest hover:border-white/30 hover:text-white transition-all"
            >
              VOLVER_AL_INICIO
            </button>
          )}
        </div>
      )}
    </div>
  );
}
