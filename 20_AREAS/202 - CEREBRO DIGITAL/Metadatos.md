---
aliases: [Estándar de Metadatos, YAML, Frontmatter Protocol]
tags: [#metadatos #arquitectura #protocolo]
created: 2026-04-20
status: active
---

# Estándar de Metadatos GLitchBrain

El Frontmatter es el ADN de cada nota en el **GLitchBrain**. Permite que la IA y Dataview procesen la información de forma estructurada.

## 1. Bloque Obligatorio
Toda nota debe empezar con este bloque mínimo:

```yaml
---
aliases: [Nombre Alternativo]
tags: [#categoria/subcategoria]
created: YYYY-MM-DD
status: active | paused | completed
---
```

## 2. Reglas de Nombramiento (Austeridad)
- **Cero Emojis**: Los metadatos (`aliases`, `tags`, `status`) MUST NOT contener emojis.
- **Aliases**: Úsalos para facilitar las conexiones automáticas (ej. `aliases: [Python, Programación en Python]`).

## 3. Automatización (GlitchBro Ingestor)
No necesitas escribir esto a mano siempre. El skill `glitchbro-ingestor` usa el script `auto_frontmatter.py` para generar estos metadatos basándose en el contenido de la nota.

## 4. Clasificación por Tags (Jerarquía)
Usa tags jerárquicos para evitar la dispersión:
- `#para/p/...` -> Proyectos
- `#para/a/...` -> Áreas
- `#para/r/...` -> Recursos
- `#glitchbrain/meta` -> Notas de sistema

## 5. Ejemplo: Nota de Estudio (GlitchBro)
```yaml
---
aliases: [Herencia en Python]
tags: [#glitchbro/python #programacion]
created: 2026-04-20
status: active
course: Scientific Computing with Python
---
```

---
*El mantenimiento de estos metadatos es auditado semanalmente por el `vault-gardener`.*

#metadatos #yaml #glitchbrain
