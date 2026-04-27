---
tags: ['#branding', '#identidad-visual', '#vectorizacion', '#piso-01']
created: 2026-04-24
updated: 2026-04-24
status: active
aliases: ['B5-vectorizacion-sabueso']
parent: [[piso-01-marketing-ventas]]
---

# B5 - Vectorización: Sabueso

**Proyecto:** Piso 01 - Marketing y Ventas
**Sección:** B) Identidad Visual

---

## Estrategia de Assets Gráficos
En Sabueso, evitamos las imágenes de stock fotográficas (humanos sonriendo con auriculares, oficinas genéricas). Nuestros assets visuales son **puramente vectoriales, diagramáticos y basados en código (ASCII)**.

## Tipos de Assets Vectoriales

### 1. Diagramas de Flujo (Blueprints)
- **Uso:** Explicar cómo funciona el "Arnés" (The Harness) y la orquestación de agentes.
- **Estilo:** Estilo de plano técnico (blueprint). Líneas rectas (0°, 45°, 90°), nodos definidos como cajas de terminal.
- **Grosor de línea:** 2px uniforme (stroke-width: 2).
- **Colores:** Trazos en Terminal White (#F0F0F0) o Cyber Green (#00FF00) para los flujos de datos activos. Fondo transparente o Deep Black (#080808).

### 2. Formas Geométricas Brutalistas
- **Uso:** Decoración de fondo, enmarcado de secciones, divisores.
- **Estilo:** Rectángulos duros, líneas de escaneo (scanlines), patrones de cuadrícula (grid) muy sutiles (opacidad 5%).
- **Colores:** Border Dark (#111111) y Alert Red (#DC2626) para advertencias o elementos que denotan el problema.

### 3. Símbolos de Interfaz (UI Vectors)
- **Uso:** Botones, indicadores de estado, barras de progreso.
- **Estilo:** Ángulos rectos, sin bordes redondeados (border-radius: 0). Flechas hechas con caracteres ( `->` o `=>` ) o vectores angulares.
- **Animación:** Los vectores pueden estar animados por CSS o GSAP (parpadeo de cursor, barras de carga).

## Especificaciones Técnicas (SVG)
Todos los vectores exportados deben cumplir estas reglas para la web:
- **Responsive:** Siempre usar `viewBox` y NUNCA anchos o altos fijos (`width` y `height` en CSS).
- **Inyección directa:** Los SVGs deben inyectarse inline en el HTML/Astro para poder manipular sus colores (fill/stroke) con CSS/Tailwind (usando `currentColor`).
- **Optimización:** Pasar siempre por SVGO o un optimizador antes de producción.

---

## Relacionado
- [[B4-logotipo-sabueso]]
- [[B6-sistema-iconos-sabueso]]
- [[10_DESIGN_GSAP_ASCII]]
