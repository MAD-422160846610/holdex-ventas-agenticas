---
title: MOC de Metadatos y Estados
tags: [#glitchbrain/meta #protocolo]
status: active
parent: [[50_SYSTEM/000_SYSTEM_INDEX]]
---

# 🏷️ Protocolo de Metadatos

Este documento define cómo "hablamos" con el sistema para que Antigravity y Dataview entiendan qué está pasando.

## 🚦 Estados de Proyecto (`status`)
- `active`: En ejecución ahora mismo.
- `planned`: Idea aprobada pero no iniciada.
- `stale`: Detenido por falta de recursos o interés.
- `done`: Finalizado exitosamente.
- `archived`: Movido al cementerio de proyectos.

## 🔗 Relaciones (`parent`)
- Siempre usa `parent: [[Nota Padre]]` en el Frontmatter.
- Esto crea la "jerarquía semántica" que permite navegar el edificio corporativo.

## #️⃣ Etiquetas Clave (`tags`)
- `#negocio`: Notas relacionadas con Holdex / Dinero.
- `#aprendizaje`: Notas de estudio (GlitchBro).
- `#sistema`: Notas de configuración de Obsidian.
- `#persona`: Fichas de contactos.

---
## 🔗 Navegación
- Volver a Sistema: [[50_SYSTEM/000_SYSTEM_INDEX]]
