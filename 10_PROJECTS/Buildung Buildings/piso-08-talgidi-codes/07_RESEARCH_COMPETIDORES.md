---
aliases: [Análisis de Competidores de Agentes, CrewAI vs AutoGen]
tags: [#pkm #agentes #investigación #crewai]
created: 2026-04-24
status: active
---

# 🤖 Competidores y Orquestación de Agentes

Investigación de mercado sobre herramientas de "Zero-Human Companies" y gestión de agentes autónomos.

## 1. Orquestación de Agentes (Competidores Directos)
| Herramienta | Tipo | Fortaleza |
| :--- | :--- | :--- |
| **CrewAI** 🏆 | Framework | Equipos de agentes que colaboran. Muy intuitivo y gran comunidad. |
| **Microsoft AutoGen** | Framework | Flujos conversacionales complejos. Muy flexible para expertos. |
| **AutoGPT / BabyAGI** | Pioneros | Ejecución autónoma por objetivos simples. |
| **OpenClaw** | Open Source | Ejecución de tareas específicas con estructura de código abierto. |
| **Stork.ai** | Plataforma | Colaboración híbrida agentes-humanos. |

## 2. Gestión de Notas e IA (Productividad)
Si se usa un sistema propio como PKM/Notas:
- **Notion AI**: Integración total de documentos y generación de texto.
- **Otter.ai / Fathom**: Transcripción y resumen de reuniones.
- **ClickUp / Monday.com**: Gestión de proyectos tradicional con capas de IA.

## 3. Estrategia de Costos (APIs Gratuitas)
Para que el sistema sea viable sin costos iniciales masivos, el stack recomendado es:
- **Google AI Studio (Gemini 1.5 Flash)**: Mejor relación velocidad/contexto (1M tokens).
- **Groq Cloud**: Acceso ultra-rápido a Llama 3 y Mixtral.
- **GitHub Models**: Acceso gratuito (con límites) a GPT-4o y modelos de Mistral.

## 💡 Conclusión y Decisión para Holdex
Para los proyectos del Holding (Piso 01 y GlitchCat):
1.  **Framework Central**: **CrewAI**. Es el estándar actual para orquestar equipos de ventas y contenido.
2.  **Backend LLM**: Híbrido Gemini Flash/Pro.
3.  **Filosofía**: Mantener el enfoque **Open-Source** para evitar el "vendor lock-in" de herramientas cerradas como Monday o Notion.

---
*Información provista por el Usuario el 2026-04-24.*
