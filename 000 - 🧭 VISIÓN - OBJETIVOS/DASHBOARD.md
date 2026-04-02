---
tags: ['#para/a/vision', '#dashboard', '#obsidian-3.1']
created: 2026-03-29
updated: 2026-03-29
status: active
priority: high
---

#🎯 Dashboard de Control - Obsidian 3.1


#📊 Métricas del Sistema (Actualizado: 2026-03-29 13:24)


#📈 Datos Estáticos (Reporte de Productividad)
- **Total de notas:** 380
- **Notas organizadas (con frontmatter):** 379 (99.7%)
- **Tags únicos:** 199
- **Tareas pendientes:** 241
- **Enlaces internos:** 1,144
- **Promedio enlaces por nota:** 3.0


#🎯 Métricas en Tiempo Real (requiere Dataview activo)
```dataviewjs
// Contar notas totales
const totalNotes = dv.pages().length;

// Contar proyectos activos
const activeProjects = dv.pages('#para/p/').where(p => p.status === 'active').length;

// Contar tareas pendientes
const pendingTasks = dv.pages().file.tasks.where(t => !t.completed).length;

// Contar notas sin frontmatter
const notesWithoutFrontmatter = dv.pages().where(p => !p.tags).length;

// Mostrar métricas
dv.paragraph(`**Total notas (Tiempo Real):** ${totalNotes}`);
dv.paragraph(`**Proyectos activos:** ${activeProjects}`);
dv.paragraph(`**Tareas pendientes:** ${pendingTasks}`);
dv.paragraph(`**Notas sin frontmatter:** ${notesWithoutFrontmatter}`);
```


#📅 Actividad Reciente (Últimos 7 días)
```dataview
TABLE file.mtime AS "Última modificación", file.tags AS "Tags"
FROM ""
WHERE file.mday >= date(today) - dur(7 days)
SORT file.mtime DESC
LIMIT 10
```


#🚀 Proyectos Activos (Sistema PARA)
```dataview
TABLE status AS "Estado", priority AS "Prioridad", file.mtime AS "Última edición"
FROM #para/p/
WHERE status = "active"
SORT priority
```


#📝 Notas por Categoría (Sistema Zettelkasten)
```dataview
TABLE length(file.inlinks) AS "Enlaces entrantes"
FROM #zk/permanent
SORT length(file.inlinks) DESC
LIMIT 10
```


#🎯 Proyecto Presupuesto ITB (Prueba)
```dataview
TABLE status AS "Estado", priority AS "Prioridad"
FROM "2026-03-29"
```


#🔗 Enlaces Rápidos
- [[presupuesto-oficina-itb]] - Presupuesto ITB (prueba)
- [[itb-inspecciones-tecnicas-de-buques]] - Proyecto ITB
- [[doble corchete]] - Convenciones del sistema
- [[2026-03-29]] - Nota diaria de hoy


#⚡ Comandos Rápidos (Plantillas Templater)
- <% tp.file.cursor() %> - Crear nueva nota
- <% tp.file.new("Proyecto nuevo", "100 - ✅ PROYECTOS") %> - Nuevo proyecto
- <% tp.file.new("Nota diaria", "900 - 📆 DIARIO") %> - Nueva nota diaria


#📈 Gráfico de Actividad (Dataview)
```dataviewjs
// Gráfico de notas por mes
const pages = dv.pages()
const monthlyData = {};

for (let page of pages) {
    if (page.file.ctime) {
        const month = page.file.ctime.month;
        monthlyData[month] = (monthlyData[month] || 0) + 1;
    }
}

// Mostrar gráfico simple
let chart = "";
for (let [month, count] of Object.entries(monthlyData)) {
    chart += `${month}: ${"█".repeat(Math.min(count, 20))} (${count})\n`;
}
dv.paragraph("```\n" + chart + "```");
```


#🔍 Búsqueda RAG (BETA)


#Búsqueda por Keywords (disponible)
```bash

#Búsqueda básica en terminal
python3 scripts/rag/search_vault.py "presupuesto itb" --top 5


#Generar resultados en markdown para Obsidian
python3 scripts/rag/search_vault.py "presupuesto" --output markdown --file "RAG - Resultados.md"
```


#Búsqueda Semántica (requiere dependencias)
```bash

#Instalar dependencias (si no están)
pip3 install numpy sentence-transformers


#Reconstruir índice de embeddings
python3 scripts/rag/embeddings.py build


#Buscar semánticamente
python3 scripts/rag/query_rag.py "presupuesto de la oficina" --top 5
```


#Notas Creadas por Búsqueda
```dataview
TABLE query AS "Búsqueda", file.cday AS "Fecha"
FROM "#system/search-results"
SORT file.cday DESC
LIMIT 5
```


#🔧 Estado del Sistema
- **Plugins activos:** Dataview, Templater, Tasks
- **Índice RAG:** TF-IDF ✓ | Embeddings ✓ (406 notas)
- **Última actualización:** 2026-03-29
- **Versión del sistema:** Obsidian 3.1 Fase 3

#obsidian-3.1 #dashboard #control-panel