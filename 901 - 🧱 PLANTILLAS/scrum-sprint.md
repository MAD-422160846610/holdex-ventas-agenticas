---
tags: ['#para/x/plantillas', '#template']
created: 2026-03-29
updated: 2026-03-29
status: active
priority: medium
---
# Sprint {{sprint_number}}: {{sprint_name}}

**Proyecto:** [[{{project_name}}]]  
**Fecha inicio:** {{sprint_start_date}}  
**Fecha fin:** {{sprint_end_date}}  
**Duración:** {{sprint_duration}} días  
**Estado:** #sprint/activo  
**Velocidad objetivo:** {{target_velocity}} puntos  

## 🎯 Objetivo del Sprint
{{sprint_goal_description}}

## 📋 Selección del Backlog (Sprint Planning)
### Historias de usuario seleccionadas
- [ ] {{history_1}} 
- [ ] {{history_2}}
- [ ] {{history_3}}

### Capacidad del equipo
- Disponible: {{team_availability}} horas/día
- Planeado: {{planned_capacity}} horas

## 📊 Tablero de Tareas (Kanban)
### Por hacer (To Do)
- [ ] {{task_1}} ({{estimate_1}} h) #tarea
- [ ] {{task_2}} ({{estimate_2}} h) #tarea
- [ ] {{task_3}} ({{estimate_3}} h) #tarea

### En progreso (In Progress)
- [ ] {{task_4}} ({{estimate_4}} h) #tarea #en-progreso
- [ ] {{task_5}} ({{estimate_5}} h) #tarea #en-progreso

### Hecho (Done)
- [x] {{task_6}} ({{estimate_6}} h) #tarea #hecho
- [x] {{task_7}} ({{estimate_7}} h) #tarea #hecho

## 🔄 Reuniones Scrum
### Sprint Planning (Completado)
- **Fecha:** {{planning_date}} {{planning_time}}
- **Participantes:** {{planning_attendees}}
- **Acuerdos:** 
  - Objetivo del sprint: {{sprint_goal}}
  - Historias seleccionadas: {{selected_stories_count}} historias
  - Compromiso: {{planned_points}} puntos

### Daily Scrums (Usar nota diaria vinculada)
- **Plantilla para diario:** 
  - Ayer: {{yesterday_work}}
  - Hoy: {{today_plan}}
  - Bloqueantes: {{blockers}}

### Sprint Review (Pendiente)
- **Fecha:** {{review_date}} {{review_time}}
- **Qué demostrar:** {{demo_items}}
- **Feedback recibido:** {{stakeholder_feedback}}
- **Historias completadas:** {{completed_stories}} / {{planned_stories}}

### Sprint Retrospective (Pendiente)
- **Fecha:** {{retro_date}} {{retro_time}}
- **Qué salió bien:** {{went_well}}
- **Qué mejorar:** {{to_improve}}
- **Acciones de mejora:** {{improvement_actions}}

## 📈 Métricas del Sprint
- Velocidad estimada: {{estimated_velocity}} puntos
- Velocidad real: {{actual_velocity}} puntos  
- % Completado: {{completion_percentage}}%
- Trabajo restante: {{remaining_work}} horas
- Burndown: [[sprintburndown_{{sprint_number}}.png]]  # Opcional: gráfico de burndown

## 🔗 Relacionado
- [[{{project_name}}]]
- [[daily-notes/{{date:YYYY-MM-DD}}]]
- [[GLITCHBRAIN.md]]

#sprint #proyecto/{{project_name}} #estado/activo #scrum #duración/{{sprint_duration}}días