# 🏗️ Master Blueprint: Flujo de Trabajo Sabueso (Piso 01)

Este documento define la línea de montaje de ventas para el **Piso 01 - Marketing y Ventas**. El objetivo es la predictibilidad: saber que si metemos 100 leads, sacamos X reuniones.

## 👥 Roles y Responsabilidades

| Rol | Persona | Función Principal | Meta Semanal (KPI) |
| :--- | :--- | :--- | :--- |
| **Data Hunter** | Josué | Extracción de leads (Google Maps/LinkedIn) y limpieza de CSV. | 500 Leads brutos |
| **Sabueso Operator** | Josué / AI | Procesamiento en Sabueso, validación de calificación AI. | 200 Leads Calificados |
| **SDR** | Equipo Ventas | Envío de emails/mensajes, manejo de objeciones iniciales. | 50 Leads Contactados |
| **Account Executive**| GlitchMan | Cierre de ventas en reuniones de 15-30 min. | 5 Reuniones / 1 Cierre |

---

## 🔄 El Ciclo de Cacería (Workflow Step-by-Step)

### Etapa 1: Extracción (Lunes de Siembra)
- **Acción**: Se extraen leads de Google Maps (rubro: "Abogados Madrid", "Bufete de abogados") a un archivo `leads.csv`.
- **Filtro Humano**: Josué elimina los que no tienen web o son duplicados.

### Etapa 2: Procesamiento Sabueso (Martes de Inteligencia)
- **Acción**: Se sube el CSV al **Sabueso Dashboard**.
- **Magia AI**: 
    1. Scrapea la web para entender la especialidad.
    2. Clasifica: ¿Es cliente ideal? (Qualified/Discarded).
    3. Redacta: Escribe un primer contacto híper-personalizado usando datos reales de la web.
- **Revisión**: Josué revisa los "Qualified" y ajusta cualquier alucinación de la AI.

### Etapa 3: Outreach (Miércoles a Viernes de Ataque)
- **Acción**: El SDR usa el botón "Abrir en Gmail" del Sabueso.
- **Toque Humano**: Agrega una referencia personal si la tiene y dispara.
- **Seguimiento**: Si no hay respuesta en 3 días, se activa el "Follow-up 1" (recordatorio de valor).

### Etapa 4: El Cierre (Handover)
- **Acción**: Cuando el cliente responde positivamente, el SDR agenda la reunión en el Calendario del Closer (GlitchMan).
- **Handover**: El SDR le pasa al Closer el "Perfil del Lead" generado por el Sabueso para que entre a la reunión sabiendo todo.

---

## 📈 Tablero de Control (Viabilidad)

Para que la oficina sea viable, monitoreamos estos 3 números:
1. **Conversion Rate (Lead -> Meeting)**: Si es menor al 5%, el mensaje del Sabueso está flojo.
2. **Show-up Rate**: Cuántos de los que agendan realmente aparecen.
3. **CAC (Costo de Adquisición)**: Lo que pagamos en APIs + Sueldos vs. lo que ganamos por cliente.

> [!IMPORTANT]
> **REGLA DE ORO**: "Ningún lead se contacta sin antes haber pasado por el Sabueso". La escala viene de la inteligencia, no del spam.
