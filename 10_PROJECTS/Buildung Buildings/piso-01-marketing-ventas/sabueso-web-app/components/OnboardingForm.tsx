'use client';

import { createProfile } from '@/lib/actions/profiles';
import { Shield } from 'lucide-react';
import { useTransition } from 'react';

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form 
      action={(formData) => startTransition(() => createProfile(formData))}
      className="glass-panel p-8 max-w-md w-full mx-auto flex flex-col gap-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff8c] to-transparent opacity-50" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#00ff8c] font-mono text-[10px] tracking-[0.3em] uppercase">
          <Shield size={12} />
          <span>Seguridad de Acceso</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white uppercase">Perfil Requerido</h2>
        <p className="text-sm text-[#8b949e]">Para acceder a la oficina virtual, necesitamos que completes tus datos profesionales.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="font-mono text-[9px] text-[#8b949e] uppercase tracking-widest">Nombre Completo *</label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            required 
            className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#00ff8c]/50 focus:ring-1 focus:ring-[#00ff8c]/50 transition-all font-mono text-sm"
            placeholder="Juan Pérez"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="font-mono text-[9px] text-[#8b949e] uppercase tracking-widest">Empresa / Proyecto</label>
          <input 
            type="text" 
            id="company" 
            name="company" 
            className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#00ff8c]/50 focus:ring-1 focus:ring-[#00ff8c]/50 transition-all font-mono text-sm"
            placeholder="Holdex Group"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="font-mono text-[9px] text-[#8b949e] uppercase tracking-widest">Teléfono</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#00ff8c]/50 focus:ring-1 focus:ring-[#00ff8c]/50 transition-all font-mono text-sm"
            placeholder="+54 9 11 1234-5678"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-[#00ff8c] text-black font-black uppercase tracking-widest text-xs py-4 px-6 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex justify-center items-center gap-2"
      >
        {isPending ? 'CREANDO_PERFIL...' : 'INGRESAR_A_LA_OFICINA'}
      </button>
    </form>
  );
}
