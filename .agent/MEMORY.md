---
tags: ['#agent/memory', '#agent/active']
created: 2026-04-02
updated: 2026-04-02
version: 1.0
---

# MEMORY.md - Memoria Activa

## Decisiones Arquitectónicas

| Fecha | Decisión | Razonamiento |
|-------|----------|--------------|
| 2026-04-02 | Usar `.agent/` para memoria del agente | Separado de notas personales, fácil de excluir de sync |
| 2026-04-02 | Git sync con `.gitignore` optimizado | Excluye archivos pesados, solo notas markdown |
| 2026-04-02 | Bot Discord como interface principal | Ya configurado, fácil de usar desde móvil |
| 2026-04-02 | Python CLI wrappers para APIs | Seguridad: agente nunca ve credenciales |
| 2026-04-02 | Nivel de proactividad: Advisor | Sugiere acciones, no ejecuta sin permiso |

## Lecciones Aprendidas

| Fecha | Lección | Contexto |
|-------|---------|----------|
| 2026-04-02 | Carpetas duplicadas por emojis diferentes | `` vs `` causó confusión, consolidado |
| 2026-04-02 | Plantillas dispersas en raíz | Reorganizadas en 6 categorías por propósito |
| 2026-04-02 | `venv/` y `.obsidian/` no deben sincronizarse | Archivos pesados, causan conflictos |

## Contexto Activo

### Proyectos en Foco
- **ITB:** Presupuesto urgente, documentación pendiente
- **GLitchCatV3:** Deadline 15 días, arquitectura por definir
- **Vescis.Space:** Automatizaciones con Dangelo

### Bloqueos
- Ninguno actualmente

### Pendientes Inmediatos
- [ ] Configurar Git sync (Fase 2)
- [ ] Crear bot Discord básico (Fase 3)
- [ ] Setup heartbeat scheduler (Fase 4)

## Patrones Establecidos

### Naming Convention
- Carpetas: `NUM - EMOJI NOMBRE/`
- Notas diarias: `YYYY-MM-DD.md`
- Plantillas: `plantilla_NOMBRE.md`

### Estructura de Daily
- Standup format: ¿Qué hice? ¿Qué haré? Blockers
- Métricas: Fecha, Sprint, Tareas pendientes
- Proyectos activos con links

### Tags
- `#daily` - Notas diarias
- `#proyecto/NOMBRE` - Por proyecto
- `#estado/VALOR` - Estados
- `#agent/*` - Archivos del agente

## Gotchas

| Problema | Solución |
|----------|----------|
| Obsidian MCP timeout en delete de carpetas | Usar `rm -rf` directo en bash |
| Archivos pesados en sync | `.gitignore` optimizado |
| Credenciales en vault | `.env` + CLI wrappers |

## Referencias

- [[SOUL.md]] - Identidad del agente
- [[USER.md]] - Perfil del usuario
- [[daily/]] - Logs de sesiones
