---
aliases: [Gemini 1.5 Flash Specs, Configuración LLM GlitchCat]
tags: [#piso-08 #glitchcat #llm #gemini #infraestructura]
created: 2026-04-24
status: active
---

# ⚡ Gemini 1.5 Flash: Implementación en GlitchCat

Investigación técnica para la orquestación de agentes con **CrewAI** dentro del ecosistema GlitchCat.

## 💰 Compromiso "Zero-Cost Pilot"
**REGLA DE ORO**: Durante la fase de inicio y escalado inicial, toda la infraestructura de IA debe ser **100% GRATUITA**. 
- Se priorizará el uso de las APIs gratuitas de **Google AI Studio**.
- No se activarán servicios de facturación ni suscripciones premium hasta que el departamento genere ingresos auditables.

## 🚀 Perfil de Rendimiento (Fase Gratuita)

## 🧠 Estrategia de Orquestación con CrewAI (Híbrida)
Para optimizar costos y eficiencia en **GlitchCat**, usaremos **CrewAI** como orquestador central con la siguiente lógica de modelos:

1.  **Gemini 1.5 Flash (Los Músculos en CrewAI)**:
    - Agentes de búsqueda y recopilación de datos (Scouts).
    - Procesamiento masivo del Master Manifest.
    - Respuestas rápidas en flujos de conversación.
2.  **Gemini 1.5 Pro (El Cerebro Central / Manager)**:
    - Agente "Manager" de CrewAI para delegación de tareas.
    - Toma de decisiones críticas y Tool Calling complejo.

## 🚨 Limitaciones Conocidas
- Menor precisión en **Tool Calling** comparado con GPT-4o mini.
- Razonamiento matemático avanzado inferior a la versión Pro.

---
## 🔗 Referencias
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini Developer Blog](https://developers.googleblog.com/build-scalable-ai-agents-langbase-and-the-gemini-api/)
