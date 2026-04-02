---
tags: ['#para/r/memoria-digital', '#zk/permanent', '#frontmatter']
created: 2025-01-08
updated: 2026-03-29
status: active
priority: medium
---


#📋 Metadatos y Frontmatter


#¿Qué es Frontmatter?

Frontmatter es metadata estructurada al inicio de una nota, entre `---`. Es leída por Obsidian y plugins como Dataview.


#Estructura básica

```yaml
---
title: Nombre de la Nota
date: 2026-03-29
tags: [tag1, tag2]
status: activo
priority: alta
---
```


#Campos recomendados


#Identificación
- `title`: Título de la nota
- `created`: Fecha de creación
- `updated`: Última actualización


#Clasificación
- `tags`: Lista de tags
- `status`: activo, pausado, completado
- `priority`: alta, media, baja


#Relaciones
- `aliases`: Nombres alternativos
- `parent`: Nota padre
- `links`: Notas relacionadas


#Proyectos
- `project`: Nombre del proyecto
- `phase`: Fase del proyecto
- `deadline`: Fecha límite


#Ejemplo completo

```yaml
---
title: Presupuesto ITB 2026
created: 2026-03-15
updated: 2026-03-29
tags: [proyecto, itb, finanzas, 2026]
status: activo
priority: alta
project: ITB
phase: planificacion
deadline: 2026-04-15
---
```


#Uso con Dataview


#Listar notas por estado
```dataview
TABLE status, priority
FROM #proyecto
WHERE status = "activo"
SORT priority
```


#Proyectos por deadline
```dataview
TABLE deadline, phase
FROM #proyecto
WHERE !completed
SORT deadline
```


#🔗 Relacionado

- [[Etiquetas]]
- [[Contenedores]]
- [[Cómo debemos nombrar las notas]]

#frontmatter #metadatos #yaml

