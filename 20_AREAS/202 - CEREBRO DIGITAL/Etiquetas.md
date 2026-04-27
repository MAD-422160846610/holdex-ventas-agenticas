---
tags: ['#para/r/memoria-digital', '#zk/permanent', '#tags']
created: 2025-01-08
updated: 2026-03-29
status: active
priority: medium
aliases: ['Etiquetas']
---



#️ Sistema de Etiquetas (Tags)


#Los tags en Obsidian

Los tags son metadatos que ayudan a categorizar y filtrar notas. Son flexibles y potentes cuando se usan correctamente.


#Convenciones de tags


#Estructura jerárquica
Usa `/` para crear jerarquías:
- `#proyecto/presupuesto-itb`
- `#idea/productividad`
- `#persona/contacto`


#Tags de estado
- `#estado/activo`
- `#estado/completado`
- `#estado/archivado`


#Tags de prioridad
- `#prioridad/alta`
- `#prioridad/media`
- `#prioridad/baja`


#Tags de tipo
- `#tipo/nota`
- `#tipo/proyecto`
- `#tipo/idea`
- `#tipo/referencia`


#Uso efectivo de tags


#En frontmatter
```yaml
tags: [proyecto, itb, finanzas]
```


#En el cuerpo
```markdown
#proyecto #activo #alta-prioridad
```


#Búsquedas con tags


#Buscar por tag
```dataview
LIST FROM #proyecto
```


#Combinar tags
```dataview
LIST FROM #proyecto AND #activo
```


#Excluir tags
```dataview
LIST FROM #proyecto WHERE !contains(tags, "archivado")
```


#Buenas prácticas

1. **Menos es más**: No sobre-etiquetar
2. **Consistencia**: Usar las mismas convenciones siempre
3. **Revisión periódica**: Limpiar tags obsoletos
4. **Combinar con carpetas**: Tags + carpetas = potencia


# Relacionado

- [[Contenedores]]
- [[Metadatos]]
- [[Carpetas]]

#tags #etiquetas #organizacion

