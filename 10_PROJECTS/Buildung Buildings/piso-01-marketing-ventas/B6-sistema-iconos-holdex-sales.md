---
tags: ['#branding', '#identidad-visual', '#iconos', '#piso-01']
created: 2026-04-24
updated: 2026-04-24
status: active
aliases: ['B6-sistema-iconos-holdex-sales']
parent: [[piso-01-marketing-ventas]]
---

# B6 - Sistema de Íconos: Holdex Sales Division

**Proyecto:** Piso 01 - Marketing y Ventas
**Sección:** B) Identidad Visual

---

## Librería Principal: Lucide Icons
Utilizamos **Lucide** (lucide-astro) por su estética limpia, stroke consistente y facilidad de integración. 

## Estilo General de Iconografía
- **Grosor (Stroke Width):** 2px a 2.5px para darle un peso ligeramente mayor (más rudo, brutalista).
- **Color:** `currentColor` gestionado por Tailwind. Generalmente Cyber Green (#00FF00) para íconos activos/soluciones, y Alert Red (#DC2626) para problemas/advertencias.
- **Relleno (Fill):** Ninguno (`none`). Solo trazos (strokes).

## Mapeo de Íconos Clave

| Concepto | Ícono Lucide | Uso |
|----------|--------------|-----|
| Agente Scout / Prospección | `Radar`, `Crosshair` | Búsqueda de leads, radar de mercado |
| Agente Outreach / Contacto | `Mail`, `Send`, `Radio` | Envío de correos, conexión, señales |
| Board Operator / Humano | `UserCheck`, `ShieldCheck`| Validación humana, seguridad, control |
| El Arnés / Orquestación | `Network`, `Cpu`, `Workflow`| Sistema, infraestructura, procesos |
| Inmutabilidad / Blockchain | `Database`, `Lock`, `Link` | Almacenamiento seguro, trazabilidad |
| Problema / Falla | `AlertCircle`, `AlertTriangle`| Reporte de falla en el modelo tradicional |
| Cierre / Éxito | `Terminal`, `CheckSquare` | Ejecución de comando exitosa |

## Modificadores Visuales
Para adaptar los íconos de Lucide al estilo "Cyber-Brutalista":
1. **Contenedor:** A menudo los íconos se encierran en cajas cuadradas con bordes duros (`border-2`).
2. **Glow:** Los íconos en Cyber Green pueden tener un sutil efecto de drop-shadow para imitar fósforo de monitor CRT (`drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]`).

## Íconos Tipográficos (Text-as-Icons)
Dado nuestro enfoque de terminal, a veces es preferible usar texto puro en lugar de SVGs:
- Cargando: `[ ... ]`
- Éxito: `[ OK ]`
- Error: `[ ERR ]`
- Acción: `>_` o `~$`

---

## Relacionado
- [[B3-paleta-colores-holdex-sales]]
- [[B5-vectorizacion-holdex-sales]]
