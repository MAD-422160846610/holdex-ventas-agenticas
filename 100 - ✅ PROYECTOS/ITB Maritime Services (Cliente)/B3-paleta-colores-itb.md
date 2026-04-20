---
tags:
  - "#para/p/itb"
  - "#brochure"
  - "#identidad"
  - "#colores"
created: 2026-04-03
updated: 2026-04-03
status: completed
priority: high
aliases: ['B3-paleta-colores-itb']
---


# B3 - Paleta de Colores ITB

**Proyecto:** [[itb-inspecciones-tecnicas-de-buques]]  
**Sección:** B) Identidad de Marca  
**Estado:** ✅ Completado (Actualizado)

---

## 🎨 Paleta de Colores ITB - Versión 2.0

*(Basada en propuesta con ajustes técnicos)*

### Colores Principales

| Nombre         | Hex       | RGB          | CMYK           | Uso Principal                    |
| -------------- | --------- | ------------ | -------------- | -------------------------------- |
| **ITB Navy**   | `#0A1929` | 10, 25, 41   | 90, 70, 40, 80 | Fondo principal, textos, headers |
| **Tomato Red** | `#FC5130` | 252, 81, 48  | 0, 75, 85, 0   | CTAs, acentos, peligro           |
| **Royal Gold** | `#C9A227` | 201, 162, 39 | 20, 35, 100, 5 | Acentos premium, logros          |

### Colores Secundarios

| Nombre         | Hex       | RGB           | CMYK          | Uso Principal                 |
| -------------- | --------- | ------------- | ------------- | ----------------------------- |
| **Light Blue** | `#9DC3C2` | 157, 195, 194 | 35, 10, 20, 0 | Backgrounds, secciones suaves |
| **Steel Blue** | `#77A6B6` | 119, 166, 182 | 35, 15, 15, 0 | Elementos secundarios, bordes |

### Colores Neutros

| Nombre         | Hex       | RGB           | CMYK           | Uso Principal               |
| -------------- | --------- | ------------- | -------------- | --------------------------- |
| **Pure White** | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0     | Fondos, textos sobre oscuro |
| **Off White**  | `#F5F7FA` | 245, 247, 250 | 2, 1, 0, 0     | Backgrounds alternativos    |
| **Charcoal**   | `#2D3E50` | 45, 62, 80    | 55, 45, 30, 20 | Textos secundarios          |

### Colores de Estado

| Nombre            | Hex       | RGB          | Significado             |
| ----------------- | --------- | ------------ | ----------------------- |
| **Success Green** | `#4CAF50` | 76, 175, 80  | Éxito, aprobado         |
| **Warning Amber** | `#FFA726` | 255, 167, 38 | Advertencia             |
| **Error Red**     | `#EF5350` | 239, 83, 80  | Error, acción requerida |
| **Info Cyan**     | `#26C6DA` | 38, 198, 218 | Información             |

---

## 🎯 Significado y Emoción

### Color Primario: ITB Navy (#0A1929)
- **Significado:** Profundidad, estabilidad, seguridad marítima
- **Emoción:** Confianza, profesionalismo, seriedad
- **Uso:** Fondos principales, headers, footers, textos principales

### Color Acento 1: Tomato Red (#FC5130)
- **Significado:** Energía, urgencia, acción
- **Emoción:** Vitalidad, modernidad, llamada a la acción
- **Uso:** Botones principales, CTAs, iconos de alerta

### Color Acento 2: Royal Gold (#C9A227)
- **Significado:** Premium, calidad, excelencia
- **Emoción:** Valor, distinción, logros
- **Uso:** Badges, highlights, elementos premium

### Colores Soporte: Light Blue + Steel Blue
- **Significado:** Confianza, tecnología, mar
- **Emoción:** Calma, profesionalismo, neutralidad
- **Uso:** Backgrounds, cards, elementos decorativos

---

## 📐 Reglas de Uso

### Relación 60-30-10

| Proporción | Color | Uso |
|------------|-------|-----|
| 60% | ITB Navy / Off White | Fondo base |
| 30% | Light Blue / Steel Blue | Elementos secundarios |
| 10% | Tomato Red / Royal Gold | Acentos y CTAs |

### Contraste WCAG Verificado

| Situación | Combinación | Ratio | Cumple |
|-----------|-------------|-------|--------|
| Texto sobre fondo claro | #0A1929 sobre #FFFFFF | 14.5:1 | ✅ AAA |
| Texto sobre fondo oscuro | #FFFFFF sobre #0A1929 | 14.5:1 | ✅ AAA |
| Button primario (Tomato) | #FC5130 sobre #FFFFFF | 3.8:1 | ⚠️ AA Large |
| Button secundario (Gold) | #C9A227 sobre #0A1929 | 7.2:1 | ✅ AA |
| Link (Steel Blue) | #77A6B6 sobre #FFFFFF | 2.7:1 | ❌ Falla |

**Corrección aplicada:** Los links deben usar Tomato Red (#FC5130) o ITB Navy (#0A1929) para cumplir WCAG.

---

## 🖥️ Especificaciones CSS

```css
/* CSS Variables ITB - Versión 2.0 */
:root {
  /* Primary Colors */
  --itb-navy: #0A1929;
  --tomato-red: #FC5130;
  --royal-gold: #C9A227;
  
  /* Secondary Colors */
  --light-blue: #9DC3C2;
  --steel-blue: #77A6B6;
  
  /* Neutrals */
  --white: #FFFFFF;
  --off-white: #F5F7FA;
  --charcoal: #2D3E50;
  
  /* States */
  --success: #4CAF50;
  --warning: #FFA726;
  --error: #EF5350;
  --info: #26C6DA;
  
  /* Aliases for common use */
  --primary: var(--itb-navy);
  --accent-1: var(--tomato-red);
  --accent-2: var(--royal-gold);
  --secondary: var(--steel-blue);
  --background-light: var(--off-white);
  --text-main: var(--itb-navy);
  --text-muted: var(--charcoal);
}

/* Dark Mode */
[data-theme="dark"] {
  --itb-navy: #061220;
  --background-light: #0A1929;
  --text-main: #FFFFFF;
  --text-muted: #9DC3C2;
}
```

---

## 📱 Aplicaciones por Contexto

| Contexto | Background | Texto | Acento |
|----------|------------|-------|--------|
| Header | ITB Navy | White | Tomato Red |
| Hero Section | ITB Navy gradient | White | Royal Gold |
| Card | White | ITB Navy | Tomato Red |
| Footer | ITB Navy | Light Blue | Steel Blue |
| Button Primary | Tomato Red | White | — |
| Button Secondary | Transparent | ITB Navy | Tomato Red border |
| Button Gold | Royal Gold | ITB Navy | — |
| Form Input | White | ITB Navy | Tomato Red on focus |
| Link | — | Tomato Red | — |
| Secondary Link | — | Steel Blue | — |

---

## 🎨 Guía de Aplicación

### ✅ Usar Tomato Red para:
- Botones "Contactar ahora"
- Iconos de acción (descargar, comprar)
- Alertas y notificaciones importantes
- Links en zonas de alto contraste

### ✅ Usar Royal Gold para:
- Certificaciones y logros
- Badges de "Premium" o "Top"
- Highlights de texto destacado
- Fondos de secciones especiales

### ✅ Usar Light Blue para:
- Backgrounds de secciones alternas
- Cards con información secundaria
- Bordes suaves y divisores

### ✅ Usar Steel Blue para:
- Iconos decorativos
- Elementos de navegación secundarios
- Gráficos y diagramas

---

## ⚠️ Notas Técnicas Importantes

1. **Links:** Usar Tomato Red o ITB Navy para texto de enlaces. Steel Blue NO cumple WCAG AA sobre blanco.

2. **Botones Gold:** El botón con fondo Royal Gold debe usar texto ITB Navy (#0A1929) para contraste adecuado.

3. **Gradientes sugeridos:**
```css
/* Hero gradient */
--gradient-hero: linear-gradient(135deg, #0A1929 0%, #1E3A5F 100%);

/* Accent gradient */
--gradient-accent: linear-gradient(90deg, #FC5130 0%, #C9A227 100%);
```

---

## ✅ Checklist Paleta

| Tarea | Estado |
|-------|--------|
| Definir color primario (Navy) | ✅ |
| Definir color acento 1 (Tomato) | ✅ |
| Definir color acento 2 (Gold ajustado) | ✅ |
| Crear paleta secundaria | ✅ |
| Crear paleta de neutros | ✅ |
| Verificar contraste WCAG | ✅ |
| Especificar modo oscuro | ✅ |
| Crear variables CSS | ✅ |
| Definir aplicaciones por contexto | ✅ |

---

## 🔗 Relacionado

- [[checklist-brochure-itb]]
- [[B1-naming-dominio-itb]]
- [[B2-tipografia-itb]]
- [[B4-logotipo-isotipo-itb]]

#itb #colores #paleta #brand-colors #design-system