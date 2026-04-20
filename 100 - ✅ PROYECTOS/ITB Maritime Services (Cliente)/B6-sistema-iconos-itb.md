---
tags: ['#para/p/itb', '#brochure', '#identidad', '#iconos']
created: 2026-04-03
updated: 2026-04-03
status": completed
priority": medium
aliases: ['B6-sistema-iconos-itb']
---


# B6 - Sistema de Iconos ITB

**Proyecto:** [[itb-inspecciones-tecnicas-de-buques]]  
**Sección:** B) Identidad de Marca  
**Estado:** ✅ Completado

---

## 🎯 Estrategia de Iconos

### Familia Seleccionada
**Phosphor Icons** (Light/Duotone)
- Estilo: Line icons moderno
- Peso: 1.5px stroke
- Consistencia visual alta
- Incluye versión filled

### Alternativas (backup)
- Heroicons (line)
- Lucide Icons
- Feather Icons

---

## 📏 Especificaciones del Sistema

| Atributo | Valor |
|----------|-------|
| **Stroke Width** | 1.5px |
| **Size Base** | 24px |
| **Size variants** | 16px, 20px, 24px, 32px, 48px |
| **Corner Radius** | 2px (rounded) |
| **Color inherit** | hereda del texto |

---

## 🖼️ Iconos de Servicios (Custom)

| Servicio | Icono | Descripción |
|----------|-------|-------------|
| Inspección de Casco | 🔍 | Lupa sobre casco de barco |
| Inspección de Maquinaria | ⚙️ | Engranaje técnico |
| Inspección de Seguridad | 🛡️ | Escudo de protección |
| Certificación | 📜 | Documento con sello |
| Auditoría | 📋 | Checklist |
| Consultoría | 💡 | Bombilla/idea |

---

## 📱 Iconos UI (Estandar)

| Función | Icono | Nombre |
|---------|-------|--------|
| Menú | ☰ | list |
| Buscar | 🔍 | magnifying-glass |
| Contacto | ✉️ | envelope |
| Teléfono | 📞 | phone |
| Ubicación | 📍 | map-pin |
| Email | 📧 | mail |
| Descargar | ⬇️ | download |
| Compartir | 📤 | share |
| Adjunto | 📎 | paperclip |
| Chat | 💬 | chat-teardrop |
| Check | ✓ | check |
| Warning | ⚠️ | warning |
| Info | ℹ️ | info |

---

## 🎨 Guía de Uso

### Tamaño por Contexto

| Contexto | Tamaño |
|----------|--------|
| Navbar / Footer | 20px |
| Tarjetas de servicio | 32px |
| Botones con texto | 16px |
| Solo icono (CTA) | 24px |
| Presentación | 48px |

### Color por Estado

| Estado | Color |
|--------|-------|
| Default | ITB Navy (#0A1929) |
| Hover | ITB Blue (#1E88E5) |
| Active | ITB Teal (#00ACC1) |
| Disabled | Silver (#CFD8DC) |

---

## 📂 Estructura de Archivos

```
/ITB-Icons/
│
├── /Phosphor-Library/
│   ├── phospho-icons.svg (sprite)
│   └── phospho-icons.css
│
├── /Custom-Services/
│   ├── icon-inspeccion-casco.svg
│   ├── icon-inspeccion-maquinaria.svg
│   ├── icon-inspeccion-seguridad.svg
│   ├── icon-certificacion.svg
│   └── ...
│
└── /UI-Icons/
    ├── icon-menu.svg
    ├── icon-search.svg
    └── ...
```

---

## ✅ Checklist Sistema de Iconos

| Tarea | Estado |
|-------|--------|
| Seleccionar familia de iconos (Phosphor) | ✅ |
| Definir estilo (line, 1.5px) | ✅ |
| Crear iconos custom para servicios | ⏳ Pendiente |
| Establecer tamaños estándar | ✅ |
| Definir colores por estado | ✅ |
| Organizar estructura | ✅ |

---

## 🔗 Relacionado

- [[checklist-brochure-itb]]
- [[B5-vectorizacion-itb]]

#itb #iconos #design-system #ui-icons