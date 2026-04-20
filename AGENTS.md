---
aliases: ['Protocolo Agente', 'Wiki Schema']
tags: ['#glitchbrain/meta']
version: 1.0
---

# 🤖 Protocolo AGENTS (LLM-Wiki Schema)

Este documento define las reglas de operación para las IAs (como Antigravity) que interactúan con el vault **GLitchBrain**. Sigue el patrón propuesto por Karpathy para un LLM-Wiki persistente y acumulativo.

## 📝 Reglas de Mantenimiento (The Wiki Layer)
- **Normalización NFC:** Todos los nombres de archivos y contenidos deben estar en NFC Unicode (estándar Linux).
- **Aliases:** Toda nota principal DEBE tener un campo `aliases` en el YAML para permitir resolución de links descriptivos.
- **Wikilinks:** Preferir `[[Nombre de Nota]]` plano sobre rutas absolutas o relativas largas.
- **Código:** Los links dentro de bloques de código deben ser ignorados por los scripts de auditoría.

## 📥 Flujo de Ingesta (Ingest Operation)
Cada vez que se procesa una nueva fuente o se genera un hito importante:
1. Leer la fuente y extraer entidades/conceptos clave.
2. Actualizar las notas de entidad existentes o crear nuevas si el conocimiento es sustancial.
3. Registrar la operación en `log.md`.
4. Refrescar el `index.md` si se crearon nuevas áreas de conocimiento.

## 🛡️ Control de Salud (Lint Operation)
- Ejecutar periódicamente `scripts/check_links.py`.
- Generar reporte en `REPORTES/enlaces-rotos.md`.
- No permitir enlaces que apunten a carpetas; siempre crear una nota índice o MOC.
- **LINT avanzado:**Ejecutar `scripts/llm_wiki_lint.py` para detectar:
  - Notas orphan (sin inbound links)
  - Claims stale (>60 días)
  - Conceptos mencionados sin página propia
  - Posibles contradicciones

## 📥 Pipeline de Ingesta (Automático)
Para procesar nuevas fuentes:
1. **Capturar:** Agregar fuente a `RAW-LLM/` o carpeta del proyecto
2. **Extraer:** Leer y resumir contenido, identificar entidades clave
3. **Integrar:** Actualizar notas existentes o crear nuevas entidades
4. **Categorizar:** Agregar frontmatter consistente con tags estándar
5. **Registrar:** Agregar entrada a `log.md` con formato `## [YYYY-MM-DD] ingest | titulo`
6. **Indexar:** Refrescar `index.md` si hay nuevas categorías

## 🔍 Query (Búsqueda)
- Usar búsqueda nativa de Obsidian para queries rápidas
- Para búsqueda semántica: ejecutar `scripts/rag/query_rag.py`
- Respuestas importantes deben guardarse como notas nuevas (no evaporate)

## 🗂️ Estructura de Directorios
- `000 - 🧭 VISIÓN - OBJETIVOS`: Estrategia y Dashboard.
- `100 - ✅ PROYECTOS`: Notas activas de trabajo.
- `200 - 🌍 MEMORIA DIGITAL`: Conocimiento permanente.
- `900 - 📆 DIARIO`: Bitácora diaria y Planning (Log cronológico).
- `_assets`: Recursos binarios inmutables (Raw Sources).

---
*Este protocolo es dinámico y evolucionará con el sistema.*
