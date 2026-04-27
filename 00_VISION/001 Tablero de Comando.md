---
aliases: [Dashboard, Panel de Control, Centro de Comando, 001]
tags: [#glitchbrain/meta #arquitectura #dashboard]
created: 2026-04-21
status: active
---

# 🕹️ Tablero de Comando

Este tablero es la interfaz técnica de tu **GLitchBrain**. Te permite ver el estado real de tu conocimiento y tus tareas pendientes de un vistazo.

## 📊 Métricas en Tiempo Real (Dataview)

```dataviewjs
// Contar notas totales
const totalNotes = dv.pages().length;

// Contar proyectos activos
const activeProjects = dv.pages('#para/p/').where(p => p.status === 'active').length;

// Contar tareas pendientes
const pendingTasks = dv.pages().file.tasks.where(t => !t.completed).length;

// Contar notas sin frontmatter (Potencial desorden)
const untagged = dv.pages().where(p => !p.tags || p.tags.length === 0).length;

// Mostrar métricas
dv.paragraph(`**Total notas:** ${totalNotes}`);
dv.paragraph(`**Proyectos activos:** ${activeProjects}`);
dv.paragraph(`**Tareas pendientes:** ${pendingTasks}`);
dv.paragraph(`**Notas por procesar:** ${untagged}`);
```

---

## 🛠️ Herramientas de IA (Antigravity)

Para operar este cerebro con mi ayuda, usa estos comandos o invoca las habilidades directamente:

### 🔍 Búsqueda Inteligente (Semantic Oracle)
Cuando necesites encontrar algo sin saber el nombre exacto:
1. Pídeme: *"Buscá en el oráculo: [tu pregunta]"*.
2. Yo ejecutaré el motor de búsqueda semántica (RAG) y te traeré los resultados más relevantes.

### 🧹 Limpieza Masiva (Vault Gardener)
Si notas que el vault se siente pesado o desordenado:
1. Pídeme: *"Pasale el Gardener al vault"*.
2. Yo auditaré los links, buscaré duplicados y eliminaré cualquier emoji que rompa la **Ley de Austeridad**.

---

## 📅 Actividad Reciente (Últimos 3 días)
```dataview
TABLE file.mtime AS "Modificado", file.tags AS "Tags"
FROM ""
WHERE file.mday >= date(today) - dur(3 days)
SORT file.mtime DESC
LIMIT 5
```

---
*Este tablero es autogestionado. Si quieres añadir una métrica nueva (ej. "Progreso de GlitchBro"), solo dímelo.*

#glitchbrain #dashboard #control