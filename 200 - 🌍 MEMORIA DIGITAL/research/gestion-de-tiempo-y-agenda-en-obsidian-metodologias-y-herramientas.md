---
tags: ['#para/r/memoria-digital', '#zk/permanent']
created: 2026-03-29
updated: 2026-03-29
status: active
priority: medium
aliases: ['gestion-de-tiempo-y-agenda-en-obsidian-metodologias-y-herramientas']
---


#Gestión de Tiempo y Agenda en Obsidian: Metodologías y Herramientas

**Fuente:** Investigación propia integrando metodologías GTD, Time Blocking, y capacidades de Obsidian con skills instaladas  
**Fecha:** 2026-03-28  
**Relevancia:** alta


#📝 Resumen
Investigación de cómo utilizar Obsidian como sistema central de gestión de tiempo y agenda, combinando metodologías de productividad probadas (GTD, Time Blocking, Pomodoro) con las capacidades específicas de Obsidian y las skills instaladas (especialmente obsidian-bases para bases de datos y json-canvas para visualización). El objetivo es crear un sistema que permita llevar el control de todos los proyectos, tareas y reuniones de manera integrada con el segundo cerebro ya establecido.


#💡 Insights principales
- **Obsidian Bases (.base)** permite crear bases de datos relacionables con vistas múltiples (tabla, kalendario, tablero) ideales para gestión de tareas y eventos
- **JSON Canvas** puede usarse para crear mapas visuales de tiempo, mostrando bloques de agenda y dependencias entre proyectos
- La combinación de **notas diarias** + **bases de tareas** + **calendario de bloques** crea un sistema integral de productividad
- **Metodología recomendada:** Time Blocking basado en proyectos semanales + revisiones diarias en notas diarias + replanificación semanal
- Las skills instaladas permiten: crear bases de tareas con filtros por proyecto/estado, ver calendarios de vencimientos, y visualizar flujos de trabajo


#🛠 Aplicación práctica en GlitchMan

#1. Sistema de Gestión de Tareas con Obsidian Bases
Crear una base de datos `tareas.base` en la carpeta `resources/` con:
- **Propiedades:** Nombre, Proyecto (relación), Estado (por hacer/en progreso/hecho/bloqueado), Prioridad (alta/media/baja), Estimación (horas), Fecha vencimiento
- **Vistas:** 
  - Vista Kalendario: ver tareas por fecha
  - Vista Tablero (Kanban): organizar por estado
  - Vista Tabla: lista detallada con filtros
  - Vista Galería: para tareas creativas


#2. Integración con Notas Diarias
Cada nota diaria (`daily-notes/YYYY-MM-DD.md`) incluirá:
- Bloque de tiempo fijo para revisiones (mañana y tarde)
- Lista de tareas del día filtradas desde la base de tareas
- Sección de "Bloques de Tiempo Planificados" usando time blocking
- Registro real de lo accomplished vs planeado


#3. Visualización Semanal con JSON Canvas
Crear un archivo `horario-semanal.canvas` que muestre:
- Bloques de tiempo por proyecto (colores diferentes)
- Reuniones recurrentes como eventos fijos
- Espacios de buffer y tiempo de respuesta
- Metas semanales visibles en el canvas


#4. Flujo de Trabajo Recomendado
**Dominical (Planificación Semanal):**
1. Revisar notas diarias de la semana pasada
2. Actualizar base de tareas (completadas, nuevas, pospuestas)
3. Revisar objetivos semanales desde GLITCHMAN.md y proyectos activos
4. Llenar plantilla GLitchCatV3 - Website Inteligente para la próxima semana
5. Crear bloques de tiempo en el calendario de Obsidian Bases
6. Definir 3 objetivos máximos para la semana

**Diario (Ejecutar y Ajustar):**
1. Mañana: Revisar nota diaria, confirmar tareas del día
2. Durante día: Trabajar en bloques de tiempo, registrar interrupciones
3. Tarde: Revisar avance, actualizar tareas completadas
4. Nota: Registrar lo accomplished vs planeado para mejorar estimaciones

**Scrum Integration:**
- Los sprints se convierten en bloques de tiempo recurrentes en el horario semanal
- Las ceremonias scrum (planning, review, retro) son eventos fijos
- Las tareas del sprint se gestionan desde la base de tareas filtradas por sprint


#🔗 Relacionado
- [[horario-semanal]]
- [[doble corchete]]
- [[scrum-sprint]]
- [[daily-note]]
- [[templates/research]]
- [[resources/tareas.base]]  # Por crear
- [[resources/horario-semanal.canvas]]  # Por crear

#research #tiempo #agenda #productividad #obsidian-bases #json-canvas #gtime #timeblocking