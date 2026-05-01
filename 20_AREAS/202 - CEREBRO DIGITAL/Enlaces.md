---
tags: ['#para/r/memoria-digital', '#zk/permanent', '#enlaces']
created: 2025-01-08
updated: 2026-03-29
status: active
priority: medium
aliases: ['Enlaces']
---



# Sistemas de Enlaces


#Tipos de enlaces en Obsidian


#1. Wikilinks (Obsidian)
La forma nativa de Obsidian:
```markdown

[[Nombre de Nota|Texto alternativo]]
[[Nombre de Nota#Sección]]
```


#2. Enlaces Markdown estándar
Formato compatible con otros editores:
```markdown
[Texto visible](URL)
[Texto](ruta/archico.md)
```


#3. Enlaces a encabezados
```markdown
[[Mi Nota#Mi Encabezado]]
```


#4. Enlaces a bloques
```markdown
[[Mi Nota#^bloque-id]]
```


#Cuándo usar cada uno


#Usa Wikilinks para:
- Notas internas del vault
- Conexiones que pueden cambiar
- Enlaces bidireccionales


#Usa Markdown links para:
- URLs externas
- Links a recursos online
- Compatibilidad con otros editores


#Buenas prácticas

1. **Texto descriptivo**: `[Cómo tomar notas](...)` no `[click aquí](...)`
2. **Enlazar conceptos**: No enlaces genéricos
3. **Bidireccional**: Si A enlaza a B, B debería enlazar a A
4. **Revisar periódicamente**: Buscar enlaces rotos


#Ejemplos


#Enlace interno simple
```markdown
Ver [[Métodos de Productividad]] para más detalles.
```


#Enlace con alias
```markdown
Lee mi [[Nota sobre GTD|guía de GTD]] para empezar.
```


#Enlace externo
```markdown
Más info en [Sitio oficial de Obsidian](https://obsidian.md).
```


#Múltiples enlaces
```markdown
Relacionado con:
- [[Enlace Wikilink]]
- [[Notas]]
- [[Contenedores]]
```


# Relacionado

- [[Enlace Wikilink]]
- [[Notas]]

#enlaces #markdown #wikilink
