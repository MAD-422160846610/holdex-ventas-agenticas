#!/usr/bin/env python3
"""
Sprint Review - Retrospectiva del sprint

Incluye:
- Qué funcionó bien
- Qué no funcionó
- Qué mejoraremos
- Métricas del sprint
- Próximos pasos
"""

import datetime
from pathlib import Path
from typing import Dict, List, Optional


def get_sprint_dates(sprint_num: int) -> Dict[str, datetime.date]:
    """Calcula las fechas de inicio y fin del sprint."""
    start_date = datetime.date(2026, 1, 1) + datetime.timedelta(
        weeks=2 * (sprint_num - 1)
    )
    end_date = start_date + datetime.timedelta(days=13)

    return {
        "start": start_date,
        "end": end_date,
    }


def get_sprint_notes(sprint_num: int, vault_path: Path) -> List[Dict]:
    """Obtiene las notas diarias del sprint."""
    dates = get_sprint_dates(sprint_num)
    daily_folder = vault_path / "900 - 📆 DIARIO"

    notes = []
    current = dates["start"]
    while current <= dates["end"] and current <= datetime.date.today():
        note_path = daily_folder / f"{current}.md"

        if note_path.exists():
            try:
                content = note_path.read_text(encoding="utf-8")

                # Count completed tasks in this day
                completed = content.count("- [x]")
                pending = content.count("- [ ]")

                notes.append(
                    {
                        "date": current,
                        "completed": completed,
                        "pending": pending,
                        "path": str(note_path),
                    }
                )
            except Exception:
                pass

        current += datetime.timedelta(days=1)

    return notes


def get_active_projects(vault_path: Path) -> List[Dict]:
    """Obtiene proyectos activos con su progreso."""
    projects_folder = vault_path / "100 - ✅ PROYECTOS"

    if not projects_folder.exists():
        return []

    projects = []
    for project in projects_folder.glob("*.md"):
        if project.name.startswith(".") or project.name.startswith("TAREAS"):
            continue

        try:
            content = project.read_text(encoding="utf-8")

            if '"active"' in content or "status: active" in content.lower():
                tasks_total = content.count("- [ ]") + content.count("- [x]")
                tasks_done = content.count("- [x]")

                projects.append(
                    {
                        "name": project.stem,
                        "tasks_total": tasks_total,
                        "tasks_done": tasks_done,
                        "progress": (tasks_done / tasks_total * 100)
                        if tasks_total > 0
                        else 0,
                    }
                )
        except Exception:
            continue

    return projects


def get_control_reports(sprint_num: int, vault_path: Path) -> List[Dict]:
    """Obtiene los reportes de control del sprint."""
    dates = get_sprint_dates(sprint_num)
    control_folder = vault_path / "900 - 📆 DIARIO" / "📋 Control"

    reports = []

    if not control_folder.exists():
        return reports

    current = dates["start"]
    while current <= dates["end"] and current <= datetime.date.today():
        report_path = control_folder / f"CONTROL-{current}.md"

        if report_path.exists():
            reports.append({"date": current, "path": str(report_path)})

        current += datetime.timedelta(days=1)

    return reports


def create_sprint_review(vault_path: Path, sprint_num: int) -> Optional[str]:
    """Crea la nota de sprint review."""

    dates = get_sprint_dates(sprint_num)
    sprint_notes = get_sprint_notes(sprint_num, vault_path)
    projects = get_active_projects(vault_path)
    control_reports = get_control_reports(sprint_num, vault_path)

    # Calcular métricas
    total_completed = sum(n["completed"] for n in sprint_notes)
    total_pending = sum(n["pending"] for n in sprint_notes)
    completion_rate = (
        (total_completed / (total_completed + total_pending) * 100)
        if (total_completed + total_pending) > 0
        else 0
    )

    # Nombre del archivo
    filename = f"S{str(sprint_num).zfill(2)}-REVIEW.md"
    review_folder = vault_path / "900 - 📆 DIARIO" / "📊 Review"
    review_path = review_folder / filename

    # Verificar si ya existe
    if review_path.exists():
        print(f"  ℹ️  Review S{sprint_num} ya existe")
        return str(review_path)

    # Crear contenido
    content = f"""---
tags: ['#para/a/diario', '#sprint', '#review', '#retrospective']
created: {datetime.date.today()}
updated: {datetime.date.today()}
status: active
priority: high
sprint: {sprint_num}
sprint_start: {dates["start"]}
sprint_end: {dates["end"]}
---

# 📊 Sprint {sprint_num} Review

**Período:** {dates["start"]} → {dates["end"]}

---

## 📈 Métricas del Sprint

| Métrica | Valor |
|---------|-------|
| Días del sprint | {len(sprint_notes)} |
| Tareas completadas | {total_completed} |
| Tareas pendientes | {total_pending} |
| Tasa de completación | {completion_rate:.1f}% |
| Proyectos activos | {len(projects)} |
| Controles ejecutados | {len(control_reports)} |

---

## ✅Qué Funcionó Bien

<!-- Lo que fue un éxito en este sprint -->

- _Logro 1_
- _Logro 2_
- _Logro 3_

---

## ❌ Qué No Funcionó

<!-- Lo quefalló o necesita mejora -->

- _Problema 1_
- _Problema 2_

---

## 💡 Mejoras para el Próximo Sprint

<!-- Acciones concretas para mejorar -->

| Mejora | Prioridad | Estado |
|--------|-----------|--------|
| _Mejora 1_ | Alta | ⏳ |
| _Mejora 2_ | Media | ⏳ |

---

## 🎯 Proyectos Activos - Progreso

"""

    for p in projects:
        content += f"""### [[{p["name"]}]]
- Progreso: {p["progress"]:.1f}% ({p["tasks_done"]}/{p["tasks_total"]} tareas)

"""

    content += f"""
## 📅 Notas Diarias del Sprint

"""

    if sprint_notes:
        for note in sprint_notes:
            emoji = "✅" if note["completed"] > 0 else "📝"
            content += (
                f"- {emoji} [[{note['date']}]] - {note['completed']} completadas\n"
            )
    else:
        content += "_No hay notas diarias_\n"

    content += f"""
## 🔗 Referencias

- [[S{str(sprint_num).zfill(2)}-PLANNING]] - Planning del sprint
- [[DASHBOARD]]

---

## 🤔 Reflexión Final

_¿Qué aprendí este sprint? ¿Qué me sorprendió? ¿Qué voy a hacer diferente?_

-

---

*Review ejecutado automáticamente*

#sprint #review #retrospective
"""

    # Escribir archivo
    review_folder.mkdir(parents=True, exist_ok=True)
    review_path.write_text(content, encoding="utf-8")

    print(f"  ✓ Sprint Review S{sprint_num} creado: {review_path}")
    return str(review_path)


if __name__ == "__main__":
    vault = Path("/home/arrigobaggio/Obsidian/GlitchBrain")

    # Calcular sprint actual
    start_date = datetime.date(2026, 1, 1)
    today = datetime.date.today()
    days = (today - start_date).days
    sprint_num = (days // 14) + 1

    result = create_sprint_review(vault, sprint_num)
    print(f"Resultado: {result}")
