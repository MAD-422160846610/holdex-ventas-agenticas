---
tags: ['#glitchbrain/meta', '#llm-wiki']
created: 2026-04-16
updated: 2026-04-16
status: active
---

# LLM-Wiki en GlitchBrain (Basado en Karpathy)

Este documento documenta la implementación del patrón [LLM-Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) en GlitchBrain.

## ️ Arquitectura (Las 3 Capas)

### 1. Raw Sources (`RAW-LLM/`)
- Documentos fuente immutables (PDFs, DOCX, artículos)
- Nunca se modifican directamente
- Fuente de verdad

### 2. The Wiki (`200 - MEMORIA DIGITAL/`)
- Notas generadas por el LLM
- Entidades, conceptos, resúmenes, comparaciones
- El LLM crea,actualiza, y mantiene

### 3. The Schema (`AGENTS.md`)
- Define convenciones y workflows
- Instruct the LLM how to operate

---

## ️ Operaciones

### Ingest (Procesar nuevas fuentes)

```bash
# 1. Agregar fuente a RAW-LLM/
# 2. El LLM procesa y:
# - Lee y resume
# - Crea/actualiza notas de entidad
# - Actualiza index.md
# - Registra en log.md
```

**Formato del log:**
```markdown
## [YYYY-MM-DD] ingest | Titulo
- **Fuente:** archivo original
- **Acción:** qué se hizo
- **Resultado:** notas creadas/actualizadas
```

### Query (Búsqueda)

- **Rápida:** Buscador nativo de Obsidian (`Ctrl+Shift+F`)
- **Semántica:** `scripts/rag/query_rag.py`
- **Sintetizada:** El LLM responde y guarda como nota nueva

### Lint (Mantenimiento)

```bash
# Básico (Enlaces rotos)
python3 scripts/check_links.py

# Avanzado ( contradicciones, orphans, stale)
python3 scripts/llm_wiki_lint.py
```

**Tipos de análisis:**
| Tipo | descripción |
|------|-------------|
| Orphan notes | Sin inbound links |
| Stale claims | Notas >60 días sin actualizar |
| Missing concepts | Palabras frecuentes sin página propia |
| Contradictions | Possible contradictions entre notas |

---

## Archivos Especiales

### index.md
- Catálogo del wiki
- Link con summary de cada nota
- Actualizado automáticamente en ingest

### log.md (Cronológico)
- Append-only record de operaciones
- Formato: `## [YYYY-MM-DD] operation | titulo`
- Parseable: `grep "^## \[" log.md | tail -5`

---

## Scripts Disponibles

| Script | Función |
|--------|---------|
| `auto_frontmatter.py` | Agrega frontmatter a notas nuevas |
| `check_links.py` | Detecta enlaces rotos |
| `llm_wiki_lint.py` | Lint avanzado (nuevo) |
| `rag/query_rag.py` | Búsqueda semántica |
| `rag/reindex.py` | Reconstruye índice RAG |
| `productivity_stats.py` | Métricas del vault |

---

## Rutinas Recomendadas

### Diario
- `check_links.py` - Verificar enlaces
- Actualizar frontmatter si hay notas nuevas

### Semanal
- `llm_wiki_lint.py` - Lint completo
- `productivity_stats.py` - Ver métricas

### Mensual
- Reconstruir índice RAG (`rag/reindex.py`)
- Revisar notes stale
- Actualizar index.md

---

## ️ Frontmatter Estándar

```yaml
---
tags: ['#para/c/categoria']
aliases: ['Nombre Alternativo']
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: active | completed | archived
priority: high | medium | low
---
```

### Tags Estándar

| Carpeta | Tag |
|--------|-----|
| Proyectos | #para/p/proyecto |
| Memoria | #para/r/memoria-digital |
| Diario | #para/a/diario |
| Plantillas | #para/x/plantillas |
| Research | #para/r/research |

---

*Basado en el patrón LLM-Wiki de Andrej Karpathy*
*Última actualización: 2026-04-16*