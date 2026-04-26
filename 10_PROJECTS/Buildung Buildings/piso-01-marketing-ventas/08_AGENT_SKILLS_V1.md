---
aliases: [Lógica de Agentes, Prompts de Ventas]
tags: [#piso-01 #agentes #sabueso #prompts]
parent: [[piso-01-marketing-ventas]]
---

# 🤖 08_AGENT_SKILLS: Lógica de Ejecución V1

Este documento contiene los "Manuales de Procedimiento" para los agentes autónomos del Sabueso Prospector. Daniel Josué (Scan) debe calibrar estos parámetros en el código.

## 1. Lead-Scout (El Sabueso)
**Misión**: Identificar 10 leads calificados por día.
- **Fuentes**: LinkedIn Sales Navigator, Google Maps, FB, X e IG.
- **Filtros**: Facturación >$15k, 5-50 empleados.
- **Trigger de Alta Prioridad**: 
  - Empresas con sitios web obsoletos o atención lenta en RRSS.
  - **Empresas buscando personal de ventas**: Indicador clave de que necesitan que vendamos por ellos para reducir costos y fricción operativa.

## 2. Outreach-Bot (El Rompehielo)
**Misión**: Iniciar conversación y calificar interés.
- **Tono**: Arquitecto Senior (Directo, experto, sin rodeos).
- **Script Refinado**: 
  *"Hola [Nombre], vi que en [Empresa] están buscando fortalecer su equipo de ventas. En Holdex ayudamos a empresas como la tuya a liberar al dueño de la gestión operativa mediante oficinas agénticas. ¿Te interesa ver cómo nuestro equipo automatizó el departamento de ventas de cero?"*

## 3. Closer-Draft (El Calculador)
**Misión**: Preparar la propuesta comercial.
- **Lógica**: Utiliza el `05_DELIVERY.md` como base.
- **Restricción**: NUNCA envía el correo directamente. Debe generar un draft en el Dashboard local para que Scan revise y envíe.
- **Componentes del Draft**: Alcance, Tiempo de entrega, Inversión estimada, Próximos pasos.

---
## 🚨 Protocolo de Escalado
Si el cliente pregunta algo fuera del manual (ej: "¿Tienen oficina física en Madrid?"), el agente debe responder: *"Es una excelente pregunta técnica, voy a escalar esto con Scan, nuestro coordinador de operaciones, para darte el dato exacto."*
