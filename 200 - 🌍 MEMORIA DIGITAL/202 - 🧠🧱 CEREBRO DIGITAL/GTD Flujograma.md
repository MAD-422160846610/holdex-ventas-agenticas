---
tags: ['#para/r/memoria-digital', '#zk/permanent', '#gtd']
created: 2025-01-08
updated: 2026-03-29
status: active
priority: medium
aliases: ['GTD Flujograma']
---



#🔄 GTD - Getting Things Done (Flujograma)


#¿Qué es GTD?

Getting Things Done es un sistema de productividad creado por David Allen. Se basa en sacar las tareas de tu mente y organizarlas en un sistema externo confiable.


#Los 5 pasos de GTD


#1. 📥 CAPTURAR (Collect)
Todo lo que requiere tu atención entra aquí:
- Ideas repentinas
- Emails por responder
- Tareas de proyectos
- Recordatorios

**Herramientas:** Inbox físico, app de notas, email, voicemail


#2. 🗂️ CLARIFICAR (Clarify)
Para cada captura, preguntar:
- ¿Es accionable?
  - **NO**: Archivar, basura, o referencia
  - **SI**: ¿Qué es el siguiente paso?


#3. 📋 ORGANIZAR (Organize)
Dependiendo de la respuesta:
- **Hacer ahora** (si toma <2 minutos)
- **Delegar** (si otro puede hacerlo)
- **Posponer** (agregar a lista de siguiente paso)
- **Proyecto** (si requiere múltiples pasos)


#4. 🔄 REVISAR (Reflect)
Revisar regularmente:
- **Diario**: Lista de "Hoy"
- **Semanal**: Revisión completa del sistema
- **Mensual**: Revisión de proyectos y objetivos


#5. ⚡ HACER (Engage)
Elegir qué hacer basado en:
- **Contexto**: ¿Dónde estoy? ¿Qué herramientas tengo?
- **Tiempo**: ¿Cuánto tiempo tengo disponible?
- **Energía**: ¿Cuál es mi nivel de energía?
- **Prioridad**: ¿Qué es más importante?


#Flujograma visual

```
                    ┌─────────────────┐
                    │   CAPTURAR      │
                    │  (Todo entra)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ ¿ES ACCIONABLE? │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
    │     NO       │  │  ¿2 MIN O   │  │ ¿MÚLTIPLES  │
    │              │  │   MENOS?    │  │   PASOS?    │
    └───────┬──────┘  └──────┬──────┘  └──────┬──────┘
            │                │                │
    ┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
    │  BASURA,     │  │   HACER     │  │  PROYECTO   │
    │  ARCHIVO O   │  │   AHORA     │  │             │
    │ REFERENCIA   │  └─────────────┘  └─────────────┘
    └──────────────┘
```


#Implementación en Obsidian


#Listas de contexto
- `@casa` - Tareas que hago en casa
- `@oficina` - Tareas en la oficina
- `@computadora` - Necesito computadora
- `@telefono` - Necesito teléfono
- `@errands` - Fuera de casa


#Plantilla de proyecto
```markdown
---
type: proyecto
estado: activo
created: {{date}}
---


#[Nombre del Proyecto]


#Objetivo
[¿Qué éxito se ve como?]


#Siguiente Paso
- [ ] [Primer acción concreta]


#Progreso
- [ ] Fase 1
- [ ] Fase 2
- [ ] Fase 3
```


#🔗 Relacionado

- [[Contenedores]]
- [[Etiquetas]]
- [[Notas]]

#gtd #productividad #flujo

