---
aliases: [Patrones de Diseño GSAP, Animación ASCII GlitchCat]
tags: [#piso-08 #diseño #gsap #ascii #performance]
created: 2026-04-24
status: active
---

# 🎨 10_DESIGN_GSAP_ASCII: Estética de Alta Fidelidad

Patrones de animación y performance para las landing pages de Holdex y GlitchCat V3.

## 🎞️ Animación ASCII (Morphing & Studio)
- **Generación de Frames**: [vansh-nagar/ascii-studio](https://github.com/vansh-nagar/ascii-studio)
    - **Uso**: Convertir videos (MP4/GIF) en secuencias de frames (.txt o arrays de strings).
    - **Pro-Tip**: Ajustar la densidad de caracteres para crear texturas visuales complejas sin peso de archivo.
- **Morphing de Frames**: [tholman/ascii-morph](https://github.com/tholman/ascii-morph)
    - **Uso**: Realizar transiciones fluidas entre los frames generados por el Studio.
- **Tip de Performance**: Mantener los frames en archivos `.txt` dentro de `public/assets/ascii/` para carga asíncrona.

## 🎬 Pipeline de Producción de Video (Cinema ASCII)
Flujo completo para convertir videos generados por IA en animaciones ASCII para las landings:

1. **Generación de Video**: Kling, Runway Gen-3, o Veo 2 (Google, gratuito).
    - Priorizar: fondo negro puro, sujeto con rim lighting verde, movimiento lento.
2. **Remoción de Marca de Agua**: [reel.money](https://reel.money/video-watermark-remover/)
    - Uso: Limpiar watermarks de herramientas gratuitas de generación de video.
3. **Conversión a ASCII**: [vansh-nagar/ascii-studio](https://github.com/vansh-nagar/ascii-studio)
    - Exportar como array de strings o archivos `.txt` por frame.
4. **Integración en Landing**: Inyectar los frames con GSAP timeline para control de playback.

## ⚡ GSAP: Pro-Tips de Performance
Para asegurar que la landing vuele incluso con muchas animaciones:

1. **Transforms sobre Layout**: Usar siempre `x`, `y`, `scale` y `rotation`. Evitar `top`, `left`, `width`, `height`.
2. **autoAlpha**: Usar `autoAlpha: 0` en lugar de `opacity: 0`. Maneja la visibilidad automáticamente para mejorar el SEO y evitar clics accidentales en elementos invisibles.
3. **QuickSetter / QuickTo**: Para efectos que siguen al mouse o actualizaciones de alta frecuencia. Salta la lógica de conflictos y es 10x más rápido.
4. **ScrollTrigger Mastery**:
   - **Pinning**: Para mantener secciones fijas mientras el contenido interno se anima.
   - **Scrubbing**: Sincronización milimétrica con el scroll del usuario.
   - **Refresh**: Ejecutar `ScrollTrigger.refresh()` tras cambios dinámicos en el DOM.

## ⚛️ Integración con Frameworks (Astro)
- **Hook `useGSAP()`**: Obligatorio para limpiar las animaciones y evitar fugas de memoria en cambios de ruta.
- **will-change**: Aplicar `will-change: transform` en CSS para elementos que se animan intensamente.

---
*Referencia técnica de GSAP Skills y el ecosistema GlitchCat.*
