---
tags: ['#para/p/proyecto', '#para/p/glitchcatv3-website-inteligente']
aliases: ['GLitchCatV3 - Website Inteligente', 'GlitchCat']
created: 2026-03-28
updated: 2026-03-28
status: active
priority: medium
---

#GLitchCatV3 - Website Inteligente

**Estado:** activo 
**Fecha inicio:** 2026-03-28 
**Fecha objetivo:** 2026-04-12 
**Deadline:** 12 días restantes (hoy: 07/04)


# Descripción

Tengo que hacer el website de ventas para el proyecto GlitchCat V3.0.


# Objetivos

1. El website debe poder recoger toda la información que se le da mediante un ADR (Architectural Decision Recording) y actualizar toda la información del website
2. Debe poder tener toda la info del roadmap
3. Ir informando de los avances del proyecto para comunicárselo a toda la comunidad
4. Tener un newsletter donde se manden las actualizaciones semanales
5. Tener un blog interno
6. Otros apartados según se defina


#️ Arquitectura Técnica

## Stack Elegido
- **Framework:** Astro (ideal para landing + blog estático)
- **Hosting:** Vercel (deploy automático desde GitHub)
- **Contenido:** Archivos Markdown en el repo
- **Estilos:** Tailwind CSS (compatible con maquetación existente de Carlos)
- **Updates:** GitHub Actions rebuild automático

## Estructura del Proyecto
```
glitchcatv3/
 src/
 pages/
 index.astro (Landing page principal)
 blog/
 [slug].astro (Blog posts dinámicos)
 roadmap.astro (Roadmap del proyecto)
 newsletter.astro (Página de signup)
 components/
 Hero.astro
 Features.astro
 RoadmapCard.astro
 NewsletterForm.astro
 content/
 blog/ (Archivos MD del blog)
 public/
 assets/
 astro.config.mjs
 package.json
```

## Flujo de Trabajo (CI/CD)
1. **Crear contenido:** Escribir `.md` en `content/blog/`
2. **Commit:** `git add . && git commit -m "Nuevo post"`
3. **Push:** `git push origin main`
4. **Auto-deploy:** Vercel rebuild automático
5. **Listo:** Sitio actualizado


# ADRs (Architectural Decision Records)

## ADR-001: Stack Tecnológico - Astro
**Fecha:** 2026-04-07 
**Contexto:** Website inteligente tipo landing page que se auto-actualiza 
**Decisión:** Usar Astro + Markdown + Vercel 
**Razón:** 
- Más liviano que Next.js para contenido estático
- Built-in support para content collections (blog)
- Deploy automático con Vercel
- Componente-friendly para reutilizar UI

**Alternativas consideradas:**
- Next.js: Más pesado, overkill para landing estática
- Hugo: Menos flexible para componentes interactivos
- plain HTML: Difícil mantener y escalar

## ADR-002: Sistema de Contenido - Markdown en Repo
**Fecha:** 2026-04-07 
**Contexto:** El equipo ya trabaja con Markdown en Obsidian 
**Decisión:** Contenido en archivos `.md` dentro del repositorio Git 
**Razón:**
- Workflow familiar para el equipo
- Version control del contenido
- No requiere CMS adicional
- Updates automáticos via GitHub Actions

**Alternativas consideradas:**
- Notion API: Necesita API key, más complejo
- Headless CMS: Overkill para este caso
- DB dinámica: Añade complejidad innecesaria

## ADR-003: Newsletter Integration
**Fecha:** 2026-04-07 
**Contexto:** Se necesitan actualizaciones semanales por email 
**Decisión:** Integrar con servicio externo (Mailchimp/ConvertKit) vía API o embed 
**Razón:**
- No reinventar la rueda para email
- Servicios especializados tienen mejor deliverability
- Form embebido o API simple de integrar

**Pendiente:** Definir proveedor según costos y necesidades


# Prototipo UI (Para Carlos)

## Landing Page - Secciones

### 1. Hero Section
- **Título principal:** "GLitchCat V3 - Tu Asistente Digital Inteligente"
- **Subtítulo:** "La próxima evolución de tu segundo cerebro digital"
- **CTA:** "Ver Demo" + "Comenzar Ahora"
- **Fondo:** Gradient animado o imagen representativa

### 2. Features Section (3-4 cards)
- AI Assistant integrado
- Sincronización inteligente 
- Búsqueda semántica
- Analytics avanzada

### 3. Roadmap Section
- Timeline visual de features
-Estados: Done | In Progress | Planned
- Links a blog posts de updates

### 4. Blog Preview
- Últimos 3 posts del blog
- Thumbnail + título + excerpt
- "Ver más posts" /blog

### 5. Newsletter Section
- Título: "Stay Updated"
- Email input + Subscribe button
- Texto: "Recibe las últimas actualizaciones"

### 6. Footer
- Links: Home | Blog | Roadmap | Contact
- Social icons
- Copyright

## Páginas Adicionales
- `/blog` - Listado de todos los posts
- `/blog/[slug]` - Post individual
- `/roadmap` - Roadmap completo
- `/newsletter` - Página de signup


# Responsabilidades del Equipo

| Rol | Tareas |
|-----|--------|
| **Carlos Mattey** | Maquetación,部署, código Astro, estructura repo |
| **Dangelo Arrivillaga** | Testing, QA, control de calidad |
| **Arrigobaggio** | Contenido MD, blog posts, roadmap updates, coordinación |


#️ Pendiente (Para Carlos)

- [ ] Repo Git creado? Si no, inicializar
- [ ] Proyecto Astro inicializado
- [ ] Configurar Vercel deploy
- [ ] Maquetar landing page según prototipo
- [ ] Implementar blog con content collections
- [ ] Crear página roadmap
- [ ] Integrar newsletter form


# Completado (Lado Arrigobaggio)

- [x] Definir arquitectura técnica
- [x] Documentar ADRs
- [x] Crear prototipo UI conceptual


# Decisiones clave

- **2026-03-28** Carlos Mattey va a terminar de hacer el despliegue y el desarrollo de la maqueta que yo le entregué
- **2026-03-28** Yo me voy a encargar únicamente del website para la comunidad
- **2026-03-28** Dangelo Arrivillaga va a hacer el control y testing del software
- **2026-03-28** Ya se tienen especificaciones sobre los requisitos
- **2026-04-07** Definida arquitectura: Astro + Markdown + Vercel


# Próximos pasos

- [ ] Carlos: Setup repo + Astro + deploy
- [ ] Carlos: Maquetación landing page
- [ ] Arrigobaggio: Crear contenido inicial blog (3 posts)
- [ ] Dangelo: Plan de testing QA
- [ ] Revisión semanal de avances


# Relacionado
- [[2026-03-28]]
- [[herramientas-gestion-proyectos-agiles-equipos-distribuidos]]
- [[architectural-decision-records-adr-mejores-practicas]]

#proyecto #estado/activo