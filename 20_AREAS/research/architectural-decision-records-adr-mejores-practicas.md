---
tags: ['#para/r/memoria-digital', '#zk/permanent', '#zk/permanent']
created: 2026-03-28
updated: 2026-03-28
status: active
priority: medium
aliases: ['architectural-decision-records-adr-mejores-practicas']
---


#Architectural Decision Records (ADR) - Mejores Prácticas

**Fuente:** Investigación basada en necesidad de GLitchCatV3 y estándares de la industria 
**Fecha:** 2026-03-28 
**Relevancia:** alta


# Resumen
Los Architectural Decision Records (ADR) son documentos que capturan decisiones arquitectónicas importantes junto con su contexto y consecuencias. Esta investigación cubre las mejores prácticas para crear y mantener ADRs efectivos, particularmente relevantes para el proyecto GLitchCatV3 donde se mencionó la necesidad de un sitio web que pueda actualizarse mediante ADRs.


# Insights principales
- Un buen ADR debe incluir: Título, Estado, Contexto, Decisión, Consecuencias y Opciones consideradas
- Los ADRs deben ser almacenados como archivos Markdown en el repositorio junto al código para mantener trazabilidad
- El formato más popular es basado en la plantilla de Michael Nygard: número, título, estado, contexto, decisión, consecuencias
- Los estados comunes son: propuesto, aceptado, rechazado, obsoletos, sustituidos
- Los ADRs facilitan la comunicación entre equipos técnicos y no-técnicos al documentar el "por qué" detrás de las decisiones
- Para sitios web que necesitan actualizarse mediante ADRs, se puede crear un sistema que lea estos archivos y actualice automáticamente el contenido basado en su estado y contenido


# Aplicación práctica
- Para **GLitchCatV3 - Website Inteligente**: Implementar un sistema donde:
 1. Los ADRs se almacenen en un directorio específico (ej: /docs/adr/)
 2. El website lea estos archivos y muestre información basada en su estado (aceptado, propuesto, etc.)
 3. Secciones como roadmap, avances y newsletter se generen automáticamente a partir de los ADRs aceptados
 4. Los visitantes del sitio puedan ver el historial de decisiones técnicas y de producto
- Considerar usar herramientas como adr-tools para gestionar la numeración y plantillas
- Integrar con el proceso de desarrollo para que cada decisión arquitectónica genere automáticamente un ADR
- Para el equipo: crear una plantilla estándar de ADR que incluya secciones específicas para decisiones de producto vs técnicas


# Relacionado
- [[glitchcatOS-v3-website-inteligente]]
- [[dangelo-arrivillaga-theeye]]
- [[2026-03-28]]

#research #tema/arquitectura #tema/adr #tema/documentacion #tema/glitchcatv3