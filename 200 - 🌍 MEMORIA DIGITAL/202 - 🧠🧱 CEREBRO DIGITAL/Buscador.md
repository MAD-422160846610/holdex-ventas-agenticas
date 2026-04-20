---
tags: ['#para/r/memoria-digital', '#zk/permanent', '#busqueda']
created: 2025-01-08
updated: 2026-03-29
status: active
priority: medium
aliases: ['Buscador']
---



#🔍 Técnicas de Búsqueda en Obsidian


#Búsqueda básica


#Por texto
Escribe directamente en la barra de búsqueda:
- `productividad` - Encuentra notas con esa palabra
- `"sistema inmunológico"` - Búsqueda exacta


#Por ruta
```
path:"100-Proyectos"
path:"*.md"
```


#Búsqueda avanzada


#Por tag
```
tag:#proyecto
tag:#activo
```


#Por frontmatter
```
status:activo
priority:alta
```


#Por fecha
```
created:2026-03-*
file.day:monday
```


#Operators


#AND
```
productividad AND obsidian
tag:#proyecto AND status:activo
```


#OR
```
python OR javascript
tag:#idea OR tag:#proyecto
```


#NOT
```
productividad -herramientas
-tag:#archivado
```


#Búsquedas guardadas (con Dataview)


#Proyectos activos
```dataview
TABLE priority, deadline
FROM #proyecto
WHERE status = "activo"
SORT priority
```


#Notas sin conectar
```dataview
LIST
FROM ""
WHERE length(file.inlinks) = 0
  AND length(file.outlinks) = 0
```


#Notas recientes
```dataview
LIST
FROM ""
WHERE file.cday >= date(today) - dur(7 days)
SORT file.cday DESC
```


#Consejos de búsqueda

1. **Sé específico**: Usa comillas para frases exactas
2. **Usa operadores**: Combinar filtros es poderoso
3. **Guarda patrones**: Las búsquedas frecuentes comoDataview
4. **Revisa resultados**: No todo lo que aparece es relevante


#🔗 Relacionado

- [[Etiquetas]]
- [[Metadatos]]
- [[Contenedores]]

#busqueda #encontrar #productividad

