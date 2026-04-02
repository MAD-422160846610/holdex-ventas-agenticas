---
tags: ['#para/r/memoria-digital', '#zk/permanent', '#naming']
created: 2025-01-08
updated: 2026-03-29
status: active
priority: high
---

# 📜 Convenciones de Nomenclatura de Notas

Este documento describe las reglas recomendadas para nombrar notas en el vault, con el fin de mantener cohesión, facilitar búsquedas y promover una arquitectura clara.

## Reglas básicas
- Usa nombres descriptivos y consistentes en kebab-case (guiones): ejemplo `presupuesto-itb.md`.
- Evita espacios y caracteres especiales; usa guiones para separar palabras.
- Las fechas deben ir en formato ISO: `YYYY-MM-DD` (para notas diarias es común, p. ej. `000 - 🧭 VISIÓN - OBJETIVOS`).
- Prefiere notas atómicas: cada nota debe expresar una idea o concepto único.
- Mantén una estructura de carpetas que permita enlazar notas con facilidad (PARA + Zettelkasten, o HUB/MOC si aplica).
- Las etiquetas deben ser específicas y consistentes, p. ej. `#proyecto/presupuesto-itb`, `#idea/crecimiento`.

## Estructura de nombres y ejemplos
- Bueno: `cómo-configurar-observabilidad.md`
- Malo: `nota de 1.md`
- Notas de proyecto: `presupuesto-itb.md`, `reporte-de-ventas.md`.
- Notas diarias: `000 - 🧭 VISIÓN - OBJETIVOS` o `diario-000 - 🧭 VISIÓN - OBJETIVOS`.

## Enlaces y relaciones
- Usar enlaces bidireccionales cuando sea posible: [[Nota Relacionada]]
- Mantener consistencia entre el frontmatter y el contenido (title, date, tags, status, etc.).

## Consejos de mantenimiento
- Revisa y limpia nombres cada 6-12 meses para evitar drift.
- Si migras notas, conserva un alias o redirección para no romper enlaces antiguos.

## 🔗 Relacionado
- [[Notas]]
- [[Contenedores]]
- [[Líneas de pensamiento o conocimiento]]

#naming #convenciones #organizacion
