---
aliases: [Dashboard de Scan, Centro de Comando Ventas]
tags: [#piso-01 #dashboard #scan #sabueso]
parent: [[piso-01-marketing-ventas]]
---

# 🖥️ 09_SCAN_DASHBOARD: Centro de Comando

Este documento define la interfaz y los puntos de control que Daniel Josué (Scan) utilizará para operar el departamento de ventas autónomo mediante el Dashboard local del Sabueso Prospector.

## 📈 Vista de Operaciones (KPIs)
- **Lead Flow**: Conteo diario de prospectos calificados por el Scout.
- **Outreach Success**: % de apertura y respuesta de los mensajes enviados.
- **Deal Value**: Valor total estimado de los presupuestos en borrador.

## 🕹️ Interfaz de Decisión (The Board)
Scan interactúa mediante tres columnas de acción:
1. **Inbox de Consultas**: Preguntas escaladas por los agentes que requieren criterio humano.
2. **Review de Presupuestos**: Borradores generados por el Closer-Draft. Scan tiene tres botones:
   - ✅ **Aprobar**: Envío automático al cliente.
   - ✏️ **Editar**: Modificar términos o precios antes de enviar.
   - ❌ **Descartar**: Si el lead resultó no ser calificado.
3. **Emergency Stop**: Botón global para pausar todos los agentes en caso de anomalías.

## 📝 Auditoría de Calidad
- **Tone Check**: Muestreo aleatorio de conversaciones para asegurar el tono de "Arquitecto Senior".
- **Agent Heartbeats**: Estado técnico de los agentes (Online/Offline).

---
## 📱 Versión Mobile-First
Para máxima agilidad, el dashboard debe permitir:
- Notificaciones Push en Telegram/Discord para aprobaciones urgentes.
- Comandos rápidos de chat para pedir reportes: `/status`, `/leads_hoy`, `/total_ventas`.
