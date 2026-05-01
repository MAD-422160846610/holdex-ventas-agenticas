---
aliases: [Especificaciones Mockup GlitchCat V3, Glitch-Sand ASCII Spec]
tags: [#glitchcat #diseño #mockup #ascii]
created: 2026-04-21
priority: high
---

# 🎨 GlitchCat V3: Especificaciones del Mockup "Glitch-Sand ASCII"

Esta es la guía para la fusión estética entre **Atlantic.vc** (interactividad cinematográfica) y el arte **ASCII** dinámico.

## 🌈 Paleta de Colores (High-Contrast Tech)
- **Fondo:** `#000000` (Negro Puro)
- **Acento Primario (Acción):** `#FF4F18` (Naranja Eléctrico)
- **Acento Secundario (IA/Datos):** `#0055FF` (Azul Neón)
- **Texto Secundario:** `#FFFFFF` (Blanco con opacidad 0.8)

## 🖋️ Tipografía
- **Headings:** `Inter` o `Manrope` (Font-weight: 800-900, tracking-tighter)
- **Tech Labels/Logs:** `JetBrains Mono` (Font-size: 10-12px, tracking-widest, uppercase)

## 🐱 El Sistema de Partículas "Sand-ASCII"
1. **Canvas Layer:** Un `<canvas>` de pantalla completa detrás del contenido.
2. **Partículas:** Cada partícula es un carácter ASCII aleatorio (`0, 1, @, #, *, +`).
3. **Efecto Parallax (Profundidad):** Las partículas varían en tamaño ("granos grandes" y "pequeños" de 8px a 28px). Las más grandes son más opacas, las pequeñas más transparentes.
4. **Comportamiento Atlantic:**
   - **Movimiento Continuo:** Las partículas tienen una pequeña velocidad constante (`vx`, `vy`) que las hace derivar por la pantalla, dándole vida incluso sin interacción.
   - **Interacción Mouse:** Repulsión circular cuando el cursor pasa cerca. Los caracteres se dispersan y vuelven a su posición base lentamente.

## 📰 Interfaz de Noticias (News Feed)
- **Terminal Style:** Las noticias aparecen en bloques de texto monospaced rodeados de bordes ASCII:
  ```
  +-------------------------------------------------+
  | [NEWS] GLitchCat V3 Launch Sprint Initiated... |
  +-------------------------------------------------+
  ```
- **Typewriter Effect:** El texto de las noticias se imprime en tiempo real, sincronizado con animaciones de "habla" del gato de partículas.

## 🛠️ Stack de Implementación Sugerido
- **Astro v6+:** Componentes de servidor para el contenido (Requiere Node.js >= 22.12.0).
- **Tailwind v4:** Para el layout y tipografía (Integrado vía plugin de Vite `@tailwindcss/vite`, configurado vía CSS `@theme`).
- **Canvas API:** Para el sistema de partículas Vanilla JS.

## 📝 Entregables y Puntos a Discutir con Carlos (Lead Developer)
Para continuar con la maquetación y la lógica final, Carlos debe revisar:
1. **Arquitectura Astro/Tailwind v4:** Verificar que la integración del nuevo motor de Tailwind v4 en `global.css` funcione bien con sus flujos de UI.
2. **Parser del Vault:** Revisar `src/utils/manifest-parser.js`. Actualmente parsea el `GLITCHCAT-MANIFEST.md`. Hay que decidir si usamos las Colecciones de Contenido (Content Collections) nativas de Astro para escalar esto al resto de las notas del Vault.
3. **Optimización del Particle Engine:** El canvas ahora tiene variaciones de opacidad y tamaño. Revisar performance en móviles y definir si se pausa la animación (o se reduce el frame rate) cuando la tab no está activa o en mobile.
4. **Dominio Definitivo:** El sitio ya se despliega por GitHub Actions, pendiente de hacer el DNS mapping cuando se adquiera el dominio oficial.

---
#glitchcat #mockup #diseño #ascii #talgidi
