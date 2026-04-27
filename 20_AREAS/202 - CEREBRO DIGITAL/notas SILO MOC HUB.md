---
aliases: [Mapas de Contenido, Estructura GLitchBrain, MOCs y Hubs]
tags: [#organizacion #arquitectura #protocolo]
created: 2026-04-20
status: active
---

# Mapas de Contenido (MOC) en GLitchBrain

En el **Protocolo GLitchBrain**, no usamos carpetas como único método de organización. Usamos **Mapas de Contenido (MOC)** para navegar por el conocimiento sin las restricciones de una jerarquía rígida.

## 1. El Índice Maestro (HUB)
El punto de entrada a todo el cerebro es el [[index|Index Maestro]]. Este actúa como el HUB central que conecta las 4 áreas PARA con los temas transversales.

## 2. Mapas de Contenido (MOC)
Un MOC es una nota que sirve como "mesa de luz" para un tema específico. En lugar de ser solo un índice, proporciona contexto.

### Estructura de un MOC Glitchman:
```markdown
# MOC: [Tema]

## Conceptos Fundamentales
- [[Concepto A]]: Breve descripción.
- [[Concepto B]]

## ️ Herramientas y Recursos
- [[Herramienta 1]]

## ️ Proyectos Relacionados
- [[Proyecto X]]
```

## 3. ¿Cuándo crear un MOC?
Siguiendo la regla de la entropía:
- **0-5 notas**: No necesitas MOC. Usa tags.
- **5-15 notas**: Crea un MOC básico para agruparlas.
- **+15 notas**: Divide el MOC en sub-MOCs (ej. [[Python]] -> [[Python Data Science]]).

## 4. El Sistema Híbrido (PARA + MOC)
1. **Carpetas (PARA)**: Para la ubicación física del archivo (donde "duerme" la nota).
2. **MOCs**: Para la ubicación lógica y relacional (donde "vive" la idea).

---
*Este sistema permite que una nota de Python (ubicada en 30_RESOURCES) esté conectada al mismo tiempo a un proyecto de ITB (en 10_PROJECTS) y a un área de Tecnología (en 20_AREAS).*

#glitchbrain #organizacion #arquitectura
