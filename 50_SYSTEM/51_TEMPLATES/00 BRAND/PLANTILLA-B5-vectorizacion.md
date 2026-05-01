---
tags: ['#plantilla', '#identidad', '#vectorizacion']
created: 2026-04-03
updated: 2026-04-03
status: template
priority: medium
---

# Plantilla: B5 - Estrategia de Vectorización

**Proyecto:** {{title}} 
**Sección:** B) Identidad de Marca B5 
**Estado:** Por completar

---

## Formatos de Exportación

### Formatos Maestros (Originales)

| Formato | Extensión | Uso |
|---------|-----------|-----|
| **Adobe Illustrator** | `.ai` | Editing, modificaciones |
| **EPS Vector** | `.eps` | Print profesional, externos |
| **SVG** | `.svg` | Web, escalable infinito |

### Formatos Derivados

| Formato | Extensión | Uso |
|---------|-----------|-----|
| **PNG** | `.png` | Web con transparencia |
| **JPG** | `.jpg` | Impresión, emails |
| **PDF** | `.pdf` | Documentos, contratos |

---

## Especificaciones por Variante

### Logotipo [Variante 1]

| Formato | Tamaño Original | Resolución |
|---------|-----------------|-------------|
| AI/EPS/SVG | px | Vector |
| PNG transparent | px | 300 DPI |
| JPG | px | 300 DPI |

### [Variante 2]

| Formato | Tamaño Original | Resolución |
|---------|-----------------|-------------|
| AI/EPS/SVG | px | Vector |
| PNG transparent | px | 300 DPI |
| Favicon ICO | px | 72 DPI |

---

## Variantes de Fondo

### Para Fondo Claro
- Elemento: 
- Fondo: Transparente

### Para Fondo Oscuro
- Elemento: 
- Fondo: Transparente

### Para Fondo de Imagen
- Elemento: 
- Opcional: 

---

## Versiones Especiales

### Escala de Grises
- Convertir a blacks, grays
- Usar cuando no hay color disponible

### Monocromático (1 color)
- Usar solo [color] sobre blanco o blanco sobre oscuro
- Para impresión 1 tinta

### Reverso
- Invertir colores
- Para footer, dark mode

---

## Estructura de Archivos sugerida

```
/[Project]-Brand-Assets/

 /01-Master-Files/
 logo-master.ai
 logo-master.eps
 logo-master.svg

 /02-Exports-PNG/
 logo-horizontal.png
 logo-vertical.png
 isotipo.png
 wordmark.png

 /03-Web/
 logo.svg
 favicon.ico
 social.png

 /04-Print/
 logo-horizontal.eps
 business-card.ai

 /05-Variants/
 Dark-Mode/
 Grayscale/
 Monochrome/
```

---

## Checklist Vectorización

| Tarea | Estado |
|-------|--------|
| Guardar maestros en AI, EPS, SVG | |
| Exportar variantes PNG/JPG | |
| Crear versiones para web (SVG) | |
| Generar favicon.ico | |
| Crear variantes de fondo | |
| Escalar a grayscale | |
| Organizar estructura | |

---

## Relacionado

- [[plantilla-brand-identity]]
- [[PLANTILLA-B4-logotipo]]
- [[PLANTILLA-B6-iconos]]

#plantilla #vectorizacion #brand-assets