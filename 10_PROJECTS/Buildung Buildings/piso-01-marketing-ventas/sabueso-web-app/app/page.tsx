'use client';

import Link from 'next/link';
import { Terminal, Search, Zap, Send, Shield, Activity, ArrowRight, User, Cpu, Network, Globe, Boxes } from 'lucide-react';
import AsciiBg from '@/components/AsciiBg';

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col selection:bg-accent-green selection:text-black font-sans">
      {/* Infrastructure Layers */}
      <AsciiBg file="/ascii/cinema1.json" opacity={0.06} />
      <div className="cyber-bg" />
      <div className="grid-bg" />
      <div className="grid-bg-dots" />
      <div className="scanlines opacity-[0.1]" />

      {/* Header / Command Center */}
      <div className="w-full border-b border-white/5 bg-black/20 backdrop-blur-sm relative z-50">
        <nav className="flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-accent-green/20 blur-xl group-hover:bg-accent-green/40 transition-all duration-500" />
              <div className="relative w-10 h-10 glass-panel-accent flex items-center justify-center font-black text-xl text-accent-green border-accent-green/40">
                S
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tighter text-white uppercase">Sabueso<span className="text-accent-green">_</span></h1>
                <span className="px-1.5 py-0.5 bg-accent-green/5 border border-accent-green/20 text-[8px] text-accent-green/70 font-mono rounded-sm">V1.0.4</span>
              </div>
              <div className="text-[7px] font-mono text-text-dim tracking-[0.4em] uppercase opacity-70">PISO_01 // MK_VENTAS</div>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-10">
            <div className="hidden xl:flex items-center gap-8 text-[9px] font-mono tracking-widest uppercase text-text-dim">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                STATUS: <span className="text-white">OPERATIONAL</span>
              </div>
            </div>
            
            <Link href="/dashboard">
              <button className="cyber-button-outline text-[9px] border-white/10 text-white hover:border-accent-green hover:text-accent-green h-9 px-6 transition-all duration-300">
                <User size={14} />
                <span className="hidden sm:inline">LOGIN_PORTAL</span>
              </button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Tactical Display (Hero) */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-6xl mx-auto w-full">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 glass-panel border-accent-green/20 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Terminal size={12} className="text-accent-green" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-accent-green/80 uppercase">Iniciando protocolo de ventas autónomas...</span>
        </div>

        <h2 className="hero-title mb-8 tracking-[-0.03em]">
          Ventas <br />
          <span className="text-white">Autónomas.</span>
        </h2>

        <p className="max-w-2xl text-lg md:text-xl text-text-dim mb-16 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Implementamos <span className="text-white font-medium">arquitecturas de IA</span> que automatizan el ciclo de prospección: desde el scraping masivo hasta el outreach ultra-personalizado.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-32 w-full max-w-md justify-center">
          <Link href="/dashboard" className="flex-1">
            <button className="cyber-button w-full justify-center h-14">
              DESPLEGAR_OPERACION <ArrowRight size={18} />
            </button>
          </Link>
          <button className="cyber-button-outline w-full flex-1 justify-center h-14 border-white/10 text-white">
            EXPLORAR_STACK
          </button>
        </div>

        {/* Feature Grid - Tactical Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Module 1 */}
          <div className="cyber-card group flex flex-col text-left">
            <div className="px-4 py-2 border-b border-border-dim bg-white/[0.02] flex justify-between items-center">
              <span className="text-[9px] font-mono text-text-dim tracking-widest uppercase">Module_01 // Hunting</span>
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green/30 group-hover:bg-accent-green transition-colors" />
            </div>
            <div className="p-8 space-y-6">
              <div className="w-12 h-12 glass-panel-accent flex items-center justify-center border-accent-green/20 group-hover:border-accent-green/50 transition-all duration-500">
                <Search className="text-accent-green" size={20} />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold tracking-tight text-white uppercase group-hover:text-accent-green transition-colors">Massive_Scraping_</h3>
                <p className="text-sm text-text-dim leading-relaxed font-light">
                  Extracción distribuida de datos estructurados. Validación de emails y perfiles sociales con precisión técnica.
                </p>
              </div>
            </div>
          </div>

          {/* Module 2 */}
          <div className="cyber-card group flex flex-col text-left border-accent-blue/20">
            <div className="px-4 py-2 border-b border-accent-blue/10 bg-accent-blue/[0.02] flex justify-between items-center">
              <span className="text-[9px] font-mono text-accent-blue/60 tracking-widest uppercase">Module_02 // Evaluation</span>
              <div className="w-1.5 h-1.5 rounded-full bg-accent-blue/30 group-hover:bg-accent-blue transition-colors" />
            </div>
            <div className="p-8 space-y-6">
              <div className="w-12 h-12 glass-panel flex items-center justify-center border-accent-blue/20 bg-accent-blue/5 group-hover:border-accent-blue/50 transition-all duration-500">
                <Cpu className="text-accent-blue" size={20} />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold tracking-tight text-white uppercase group-hover:text-accent-blue transition-colors">AI_Qualification_</h3>
                <p className="text-sm text-text-dim leading-relaxed font-light">
                  Motores GPT-4o analizan el DNA de cada prospecto para asegurar un fit perfecto con tu Ideal Customer Profile.
                </p>
              </div>
            </div>
          </div>

          {/* Module 3 */}
          <div className="cyber-card group flex flex-col text-left">
            <div className="px-4 py-2 border-b border-border-dim bg-white/[0.02] flex justify-between items-center">
              <span className="text-[9px] font-mono text-text-dim tracking-widest uppercase">Module_03 // Outreach</span>
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green/30 group-hover:bg-accent-green transition-colors" />
            </div>
            <div className="p-8 space-y-6">
              <div className="w-12 h-12 glass-panel-accent flex items-center justify-center border-accent-green/20 group-hover:border-accent-green/50 transition-all duration-500">
                <Send className="text-accent-green" size={20} />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold tracking-tight text-white uppercase group-hover:text-accent-green transition-colors">Smart_Outreach_</h3>
                <p className="text-sm text-text-dim leading-relaxed font-light">
                  Generación de copys ultra-personalizados y orquestación de envíos mediante la infraestructura de Resend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating System Stats */}
      <div className="fixed bottom-10 left-10 hidden 2xl:flex flex-col gap-5 z-20">
        <div className="flex items-center gap-3 text-[8px] font-mono text-text-dim/50 tracking-[0.5em] uppercase">
          <Globe size={10} className="text-accent-green/40" /> SYSTEM_NODES: 42_ACTIVE
        </div>
        <div className="flex items-center gap-3 text-[8px] font-mono text-text-dim/50 tracking-[0.5em] uppercase">
          <Network size={10} className="text-accent-blue/40" /> LATENCY: 14MS_STABLE
        </div>
        <div className="flex items-center gap-3 text-[8px] font-mono text-text-dim/50 tracking-[0.5em] uppercase">
          <Boxes size={10} className="text-accent-green/40" /> BLOCKS: 1024_SYNCED
        </div>
      </div>

      {/* Footer / Legal */}
      <footer className="relative z-10 px-8 py-12 border-t border-white/5 mt-auto bg-black/60 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 glass-panel flex items-center justify-center text-accent-green border-accent-green/20 font-bold">S</div>
              <h3 className="text-white font-bold tracking-tighter">SABUESO<span className="text-accent-green">_</span></h3>
            </div>
            <p className="text-[10px] font-mono text-text-dim leading-relaxed uppercase tracking-wider max-w-xs">
              Protocolo de ventas autónomas diseñado para el piso_01 de Buildung Buildings. outreach masivo con inteligencia artificial.
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-mono text-white tracking-[0.3em] uppercase">Security_Protocols</h4>
            <div className="flex flex-col gap-3 text-[9px] font-mono text-text-dim uppercase tracking-widest">
              <a href="#" className="hover:text-accent-green transition-colors">Endpoint_Encryption</a>
              <a href="#" className="hover:text-accent-green transition-colors">Identity_Vault_v2</a>
              <a href="#" className="hover:text-accent-green transition-colors">Access_Control_Logs</a>
            </div>
          </div>

          <div className="flex flex-col gap-6 items-start md:items-end">
            <h4 className="text-[10px] font-mono text-white tracking-[0.3em] uppercase">System_Metadata</h4>
            <div className="text-right flex flex-col gap-2">
              <div className="text-[10px] font-mono text-text-dim uppercase tracking-[0.2em]">
                © 2024 <span className="text-white">BUILDUNG_BUILDINGS</span>
              </div>
              <div className="text-[10px] font-mono text-accent-green/60 uppercase tracking-[0.2em]">
                SABUESO_DEPLOYMENT_ACTIVE
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
