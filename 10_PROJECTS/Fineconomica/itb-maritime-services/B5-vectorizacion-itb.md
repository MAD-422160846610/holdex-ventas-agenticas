---
tags: ['#para/p/itb', '#brochure', '#identidad', '#vectorizacion']
created: 2026-04-03
updated: 2026-04-03
status: completed
priority": medium
aliases: ['B5-vectorizacion-itb']
---


# B5 - Estrategia de Vectorización ITB

**Proyecto:** [[itb-inspecciones-tecnicas-de-buques]] 
**Sección:** B) Identidad de Marca 
**Estado:** Completado

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

### Logotipo Principal (Horizontal)

| Formato | Tamaño Original | Resolución |
|---------|-----------------|-------------|
| AI/EPS/SVG | 800 x 267px (3:1) | Vector |
| PNG transparent | 1600 x 533px | 300 DPI |
| JPG | 1600 x 533px | 300 DPI |

### Isotipo (Símbolo solo)

| Formato | Tamaño Original | Resolución |
|---------|-----------------|-------------|
| AI/EPS/SVG | 512 x 512px (1:1) | Vector |
| PNG transparent | 512 x 512px | 300 DPI |
| Favicon ICO | 16, 32, 48px | 72 DPI |

### Wordmark (Texto solo)

| Formato | Tamaño Original | Resolución |
|---------|-----------------|-------------|
| AI/EPS/SVG | 400 x 100px (4:1) | Vector |
| PNG transparent | 800 x 200px | 300 DPI |

---

## Variantes de Fondo

### Para Fondo Claro
- Símbolo: ITB Navy (#0A1929)
- Texto: ITB Navy (#0A1929)
- Fondo: Transparente

### Para Fondo Oscuro
- Símbolo: White (#FFFFFF)
- Texto: White (#FFFFFF)
- Fondo: Transparente

### Para Fondo de Imagen
- Símbolo: White con slight shadow
- Texto: White
- Opcional: Box de ITB Navy al 80%

---

## Versiones Especiales

### Escala de Grises
- Convierte a 100% black, 50% gray, 0% black
- Usar cuando no hay color disponible

### Monocromático (1 color)
- Usar solo ITB Navy (sobre blanco) o White (sobre oscuro)
- Para impresión 1 tinta

### Reverso (Blanco sobre Negro)
- Invierte colores
- Para footer, dark mode

---

## Estructura de Archivos

```
/ITB-Brand-Assets/

 /01-Master-Files/
 ITB-Logo-Master.ai
 ITB-Logo-Master.eps
 ITB-Logo-Master.svg

 /02-Exports-PNG/
 ITB-Logo-Horizontal.png
 ITB-Logo-Vertical.png
 ITB-Isotipo.png
 ITB-Wordmark.png

 /03-Web/
 itb-logo.svg
 itb-favicon.ico
 itb-social.png

 /04-Print/
 ITB-Logo-Horizontal.eps
 ITB-Business-Card.ai

 /05-Variants/
 Dark-Mode/
 Grayscale/
 Monochrome/
```

---

## Checklist Vectorización

| Tarea | Estado |
|-------|--------|
| Guardar maestros en AI, EPS, SVG | Pendiente |
| Exportar variantes PNG/JPG | Pendiente |
| Crear versiones para web (SVG) | Pendiente |
| Generar favicon.ico | Pendiente |
| Crear variantes de fondo | Pendiente |
| Escalar a grayscale | Pendiente |
| Organizar estructura de archivos | Pendiente |

---

## Relacionado

- [[checklist-brochure-itb]]
- [[B4-logotipo-isotipo-itb]]

#itb #vectorizacion #brand-assets #export