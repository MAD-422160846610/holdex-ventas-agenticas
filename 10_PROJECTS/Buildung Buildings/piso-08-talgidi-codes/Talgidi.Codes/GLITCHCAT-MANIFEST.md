---
project: GLitchCatV3
version: 3.0.0
status: active
priority: high
last_sync: 2026-04-21
sprint: W17-W18 (21/04 - 05/05)
launch_date: 2026-05-05
team:
  - name: GLitchMan
    role: Product Manager & Content
  - name: Carlos Mattey
    role: Lead Developer
  - name: Dangelo Arrivillaga
    role: QA & Testing
stack:
  framework: Astro
  styling: Tailwind CSS
  deployment: Vercel
  content: Markdown (Vault-first)
  integration: Discord (GlitchCat OS Bot - 19 Tools)
roadmap:
  Sprint_W17_W18:
    - task: Maquetación Final Website
      status: done
    - task: Implementación Autorelleno (Vault -> Astro)
      status: done
    - task: Ingesta de 3 Blog Posts Iniciales
      status: done
    - task: Dashboard de Status del Bot
      status: planned
metrics:
  development_progress: 70
  content_readiness: 80
  qa_verification: 0
---

# 🧬 GLitchCatV3: Manifiesto Maestro (SSOT)

Este archivo es la **Única Fuente de Verdad (SSOT)** para el proyecto. Está diseñado para ser leído por el script de despliegue del website y autorellenar las secciones correspondientes.

## 🎯 Visión del Proyecto
**GlitchCat** es un Sistema de Gestión y Manejo de Conocimiento basado en Markdown (Obsidian) diseñado para actuar como un Asistente Digital Omni-canal.

**La Escalabilidad del Ecosistema:**
1. **El Cubículo Digital (Tier 1):** Un "GlitchCat" (gato asistente) individual interconectado vía Discord, WhatsApp, Telegram y Email, que coordina y monta un cerebro digital personal.
2. **La Oficina Digital (Tier 2 - Básico):** Conexión de hasta 9 GlitchCats (1 Célula SCRUM) para compartir conocimiento y gestionar un departamento virtual.
3. **El Corporativo Virtual (Tier 3):** Enlace de hasta 3 departamentos/oficinas virtuales interactuando bajo un mismo súper-cerebro.

**El Roadmap Tecnológico:** Direccionamiento directo hacia la integración **Blockchain**. El actual website V3 tiene como objetivo vender esta visión, validar la viabilidad técnica y desarrollar la estética final del producto.

## 🏗️ Decisiones Arquitectónicas (ADRs)
> [!NOTE]
> Estas decisiones alimentan la sección de "Transparencia" del website.

### ADR-001: Astro como Framework
- **Estado:** Aceptado
- **Razón:** Rendimiento estático superior y facilidad para manejar colecciones de Markdown.

### ADR-002: Markdown-Driven Content
- **Estado:** Aceptado
- **Razón:** Permite que el equipo trabaje en Obsidian y el sitio se actualice vía Git/Vercel.

## 🚀 Roadmap del Sprint (Lanzamiento)
*Sincronizado con el timeline de Talgidi.Codes.*

- [x] Fase 1: Definición Técnica
- [/] Fase 2: Desarrollo de Maqueta (Carlos)
- [ ] Fase 3: Ingesta de Contenido Inicial (GLitchMan)
- [ ] Fase 4: QA y Testing (Dangelo)

## 📡 Integración de Datos
- **Blog:** `src/content/blog/*.md`
- **Status del Bot:** Monitorización de `GlitchCat OS` (19 tools activas).
- **Roadmap:** Se lee del bloque `roadmap` en el frontmatter de este archivo.

---
#proyecto #glitchcat #ssot #manifiesto
