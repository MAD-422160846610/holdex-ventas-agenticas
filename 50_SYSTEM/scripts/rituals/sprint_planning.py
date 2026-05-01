#!/usr/bin/env python3
"""
Sprint Planning - Crea la planificación del sprint quincenal

Incluye:
- Objetivos del sprint
- Proyectos seleccionados
- Backlog de tareas
- Compromisos del equipo
- Fecha de inicio y fin del sprint
"""

import datetime
from pathlib import Path
from typing import Dict, List, Optional


def get_sprint_dates(sprint_num: int) -> Dict[str, datetime.date]:
    """Calcula las fechas de inicio y fin del sprint."""
    # Cada sprint dura 2 semanas (14 días)
    start_date = datetime.date(2026, 1, 1) + datetime.timedelta(
        weeks=2 * (sprint_num - 1)
    )
    end_date = start_date + datetime.timedelta(days=13)  # 14 días incluido

    return {"start": start_date, "end": end_date, "num_days": 14}


def get_all_projects(vault_path: Path) -> List[Dict]:
    """Obtiene todos los proyectos con su estado."""
    projects_folder = vault_path / "100 - ✅ PROYECTOS"

    if not projects_folder.exists():
        return []

    projects = []
    for project in projects_folder.glob("*.md"):
        if project.name.startswith(".") or project.name.startswith("TAREAS"):
            continue

        try:
            content = project.read_text(encoding="utf-8")

            # Extract status
            status = "unknown"
            if '"active"' in content or "status: active" in content.lower():
                status = "active"
            elif '"on-hold"' in content or "status: on-hold" in content.lower():
                status = "on-hold"
            elif '"completed"' in content or "status: completed" in content.lower():
                status = "completed"

            # Count tasks
            tasks_total = content.count("- [ ]")
            tasks_done = content.count("- [x]")

            projects.append(
                {
                    "name": project.stem,
                    "path": str(project),
                    "status": status,
                    "tasks_total": tasks_total,
                    "tasks_done": tasks_done,
                }
            )
        except Exception:
            continue

    return sorted(projects, key=lambda x: x["status"])


def get_inbox_tasks(vault_path: Path) -> List[Dict]:
    """Obtiene tareas de la inbox."""
    inbox_path = vault_path / "200 - 🌍 MEMORIA DIGITAL" / "inbox.md"

    if not inbox_path.exists():
        return []

    try:
        content = inbox_path.read_text(encoding="utf-8")
        tasks = []

        for line in content.split("\n"):
            if "- [ ]" in line:
                task = line[line.index("- [ ]") + 5 :].strip()
                if task:
                    tasks.append({"task": task})

        return tasks
    except Exception:
        return []


def create_sprint_planning(vault_path: Path, sprint_num: int) -> Optional[str]:
    """Crea la nota de sprint planning."""

    dates = get_sprint_dates(sprint_num)
    projects = get_all_projects(vault_path)
    inbox_tasks = get_inbox_tasks(vault_path)

    # Filtrar proyectos activos
    active_projects = [p for p in projects if p["status"] == "active"]
    on_hold_projects = [p for p in projects if p["status"] == "on-hold"]

    # Nombre del archivo
    filename = f"S{str(sprint_num).zfill(2)}-PLANNING.md"
    planning_folder = vault_path / "900 - 📆 DIARIO" / "📅 Planning"
    planning_path = planning_folder / filename

    # Verificar si ya existe
    if planning_path.exists():
        print(f"  ℹ️  Planning S{sprint_num} ya existe")
        return str(planning_path)

    # Crear contenido
    content = f"""---
tags: ['#para/a/diario', '#sprint', '#planning']
created: {datetime.date.today()}
updated: {datetime.date.today()}
status: active
priority: high
sprint: {sprint_num}
sprint_start: {dates["start"]}
sprint_end: {dates["end"]}
---

# 📅 Sprint {sprint_num} Planning

**Período:** {dates["start"]} → {dates["end"]} ({dates["num_days"]} días)

---

## 🎯 Objetivos del Sprint

<!-- Escribe 3-5 objetivos principales para este sprint -->

1. _Objetivo 1_
2. _Objetivo 2_
3. _Objetivo 3_

---

## 🚀 Proyectos en Curso ({len(active_projects)})

"""

    for p in active_projects:
        progress = (
            (p["tasks_done"] / p["tasks_total"] * 100) if p["tasks_total"] > 0 else 0
        )
        content += f"""### [[{p["name"]}]]
- **Estado:** {p["status"]}
- **Tareas:** {p["tasks_done"]}/{p["tasks_total"]} ({progress:.0f}%)
- **Acción:** 

"""

    content += f"""
## ⏸️ Proyectos en Espera ({len(on_hold_projects)})

"""

    for p in on_hold_projects:
        content += f"- [[{p['name']}]] (tareas: {p['tasks_total']})\n"

    content += f"""
## 📋 Backlog del Sprint

<!-- Trae tareas de la inbox y proyectos -->

| Tarea | Proyecto | Prioridad | Estado |
|-------|----------|-----------|--------|
| _Tarea 1_ | _Proyecto_ | Alta | ⏳ |
| _Tarea 2_ | _Proyecto_ | Media | ⏳ |

"""

    content += f"""
## 📥 Inbox ({len(inbox_tasks)} tareas)

"""

    if inbox_tasks:
        for t in inbox_tasks[:10]:
            content += f"- [ ] {t['task']}\n"
    else:
        content += "_Inbox vacía_\n"

    content += f"""
## 🤝 Compromisos del Sprint

<!-- Define qué te comprometes a completar en este sprint -->

- [ ] _compromiso 1_
- [ ] _compromiso 2_

---

## 📊 Métricas del Sprint

- **Duración:** {dates["num_days"]} días
- **Proyectos activos:** {len(active_projects)}
- **Proyectos en pausa:** {len(on_hold_projects)}
- **Tareas en inbox:** {len(inbox_tasks)}

---

## 🔗 Referencias

- [[DASHBOARD]]
- [[{dates["start"]}]] - Inicio del sprint
- [[{dates["end"]}]] - Fin del sprint

#sprint #planning
"""

    # Escribir archivo
    planning_folder.mkdir(parents=True, exist_ok=True)
    planning_path.write_text(content, encoding="utf-8")

    print(f"  ✓ Sprint Planning S{sprint_num} creado: {planning_path}")
    return str(planning_path)


if __name__ == "__main__":
    vault = Path("/home/arrigobaggio/Obsidian/GlitchBrain")

    # Calcular sprint actual
    start_date = datetime.date(2026, 1, 1)
    today = datetime.date.today()
    days = (today - start_date).days
    sprint_num = (days // 14) + 1

    result = create_sprint_planning(vault, sprint_num)
    print(f"Resultado: {result}")
