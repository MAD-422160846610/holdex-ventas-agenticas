---
tags: ['#para/p/proyecto', '#glitchcat', '#handover']
created: 2026-04-07
updated: 2026-04-07
status: pending
destinatario: Carlos Mattey
prioridad: high
aliases: ['HANDOVER-glitchcatv3-carlos']
---


# 📤 Handover - GLitchCatV3 Website
## Para: Carlos Mattey (Talgidi-Codes)

**Fecha:** 07/04/2026  
**Deadline:** 12/04/2026 (12 días)  
**Tu contacto:** Arrigobaggio


---

## 🎯 Contexto del Proyecto

**GLitchCatV3** es un website inteligente de ventas para el proyecto GlitchCat. 
- Landing page + Blog + Newsletter
- Auto-actualizable mediante contenido Markdown
- Stack: Astro + Vercel + Tailwind


---

## ✅ Lo QUE YA ESTÁ DEFINIDO (Yo hice esto)

### Arquitectura Técnica (ya decidido)
- **Framework:** Astro
- **Hosting:** Vercel
- **Estilos:** Tailwind CSS
- **Contenido:** Markdown en el repo
- **Deploy:** GitHub Actions auto-deploy

### Documentación
- ADRs documentados en la nota del proyecto
- Prototipo UI con secciones definidas
- Estructura del proyecto planificada

### Tu Rol
- 🚀 **Maquetación y desarrollo** del sitio
- 🖥️ **Setup del repo** Git (si no lo tenés)
- ⚙️ **Configuración** de Vercel + deploy
- 🧪 **Code review** antes de testing


---

## 📋 LO QUE TENÉS QUE HACER (Tu Checklist)

### Phase 1: Setup (Esta semana)
- [ ] **1.** Crear/inicializar repo Git (si no existe)
- [ ] **2.** Inicializar proyecto Astro (`npm create astro@latest`)
- [ ] **3.** Agregar Tailwind CSS (`npx astro add tailwind`)
- [ ] **4.** Conectar repo con Vercel (import desde GitHub)
- [ ] **5.** Verificar deploy inicial funciona

### Phase 2: Desarrollo (Próximas 1-2 semanas)
- [ ] **6.** Maquetar **Landing Page** con las secciones:
  - Hero section (título + CTA + background)
  - Features (3-4 cards con iconos)
  - Roadmap preview
  - Blog preview (últimos 3 posts)
  - Newsletter signup form
  - Footer
- [ ] **7.** Implementar **Blog** con Astro Content Collections
  - Crear `src/content/blog/`
  - Configurar content collections en `astro.config.mjs`
  - Crear página `/blog` y `/blog/[slug]`
- [ ] **8.** Crear página **Roadmap** 
  - Timeline visual
  - Estados: Done | In Progress | Planned
- [ ] **9.** Integrar **Newsletter form**
  - Mailchimp o ConvertKit embed
  - O formulario con API
- [ ] **10.** Testing local y verification

### Phase 3: Handoff
- [ ] **11.** Deploy a producción
- [ ] **12.** Notification a Dangelo para QA testing


---

## 🎨 Prototipo UI - Referencia

### Landing Page (index.astro)
```
┌─────────────────────────────────────────┐
│  GLitchCat V3                          │
│  "Tu Asistente Digital Inteligente"     │
│  [Ver Demo] [Comenzar]                 │
├─────────────────────────────────────────┤
│  Features                               │
│  🤖 AI | 🔄 Sync | 🔍 Search | 📊      │
├─────────────────────────────────────────┤
│  Roadmap (preview)                      │
│  Q1: ✅ | Q2: 🔄 | Q3: 📅              │
├─────────────────────────────────────────┤
│  Latest Blog Posts                      │
│  [Post 1] [Post 2] [Post 3]             │
├─────────────────────────────────────────┤
│  Newsletter                             │
│  [Tu email] [Suscribirse]              │
├─────────────────────────────────────────┤
│  Footer: Home | Blog | Roadmap | Contact│
└─────────────────────────────────────────┘
```

### Pages adicionales
- `/blog` - Listado de posts
- `/blog/[slug]` - Post individual (dinámico)
- `/roadmap` - Roadmap completo
- `/newsletter` - Página de signup


---

## 🔗 Recursos

- **Repo Git:** (crear o indicarme URL)
- **Vercel:** (project URL una vez creado)
- **Documentación Astro:** https://docs.astro.build
- **Tailwind en Astro:** https://docs.astro.build/en/guides/integrations-guide


---

## 👥 Equipo

| Rol | Nombre | Qué hace |
|-----|--------|----------|
| Dev | **Carlos Mattey** | Maquetación, código, deploy |
| QA | **Dangelo Arrivillaga** | Testing, control de calidad |
| PM/Content | **Arrigobaggio** | Contenido, coordinación |


---

## 📞 Comunicación

- **Daily sync:** Mañana 9:00 (o cuando acuerden)
- **Updates:** Por Discord o en el daily
- **Repo:** Todo código en GitHub para seguir progreso

**Nota:** Si tenés blockers, avisá inmediatamente para coordinar解决方案.


---

## ⏰ Fechas Clave

| Fecha | Milestone |
|-------|-----------|
| 07/04 | Setup repo + Astro |
| 09/04 | Landing page maquetada |
| 11/04 | Blog implementado |
| 12/04 | **DEADLINE** - Sitio debe estar live |
| 13/04 | Dangelo starts QA |


---

## ❓ Preguntas?

Si algo no está claro o necesitás más info, escribime.

¡Gracias! 🙌