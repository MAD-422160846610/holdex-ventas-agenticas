#!/usr/bin/env python3
"""
Daily Standup - Crea la nota diaria con estructura de standup ágil

Analiza:
- Qué hice ayer (notas modificadas)
- Qué voy a hacer hoy (tareas pendientes)
- Blockers (tareas bloqueadas)
"""

import datetime
import json
from pathlib import Path
from typing import Dict, List, Optional


def get_yesterday_notes(vault_path: Path) -> List[Dict]:
    """Obtiene notas modificadas ayer."""
    yesterday = datetime.date.today() - datetime.timedelta(days=1)
    daily_folder = vault_path / "900 - 📆 DIARIO"

    if not daily_folder.exists():
        return []

    notes = []
    for note in daily_folder.glob("*.md"):
        # Skip templates and system files
        if note.name.startswith(".") or "plantilla" in note.name.lower():
            continue

        # Check if modified yesterday
        mtime = datetime.datetime.fromtimestamp(note.stat().st_mtime).date()
        if mtime == yesterday:
            notes.append({"name": note.stem, "path": str(note)})

    return notes


def get_pending_tasks(vault_path: Path) -> List[Dict]:
    """Obtiene tareas pendientes de proyectos activos."""
    projects_folder = vault_path / "100 - ✅ PROYECTOS"

    if not projects_folder.exists():
        return []

    tasks = []
    for project in projects_folder.glob("*.md"):
        if project.name.startswith("."):
            continue

        try:
            content = project.read_text(encoding="utf-8")

            # Look for task markers
            lines = content.split("\n")
            for i, line in enumerate(lines):
                if "- [ ]" in line:  # Unchecked task
                    # Get context (next 50 chars)
                    context = line[line.index("- [ ]") + 5 :].strip()[:50]
                    tasks.append(
                        {"project": project.stem, "task": context, "line": i + 1}
                    )
        except Exception:
            continue

    return tasks[:10]  # Limit to 10


def get_blocked_tasks(vault_path: Path) -> List[Dict]:
    """Obtiene tareas bloqueadas (con tag #blocked o #blocker)."""
    blocked = []

    # Search for blocked tasks in projects
    projects_folder = vault_path / "100 - ✅ PROYECTOS"
    if projects_folder.exists():
        for project in projects_folder.glob("*.md"):
            try:
                content = project.read_text(encoding="utf-8")
                if "#blocked" in content.lower() or "#blocker" in content.lower():
                    blocked.append({"project": project.stem, "file": str(project)})
            except Exception:
                continue

    return blocked


def get_active_projects(vault_path: Path) -> List[Dict]:
    """Obtiene proyectos activos."""
    projects_folder = vault_path / "100 - ✅ PROYECTOS"

    if not projects_folder.exists():
        return []

    projects = []
    for project in projects_folder.glob("*.md"):
        if project.name.startswith("."):
            continue

        try:
            content = project.read_text(encoding="utf-8")

            # Check for active status
            if '"active"' in content or "status: active" in content.lower():
                projects.append({"name": project.stem, "path": str(project)})
        except Exception:
            continue

    return projects


def create_daily_note(vault_path: Path) -> Optional[str]:
    """Crea la nota diaria con estructura de standup."""

    today = datetime.date.today()
    filename = f"{today}.md"
    daily_folder = vault_path / "900 - 📆 DIARIO"
    daily_path = daily_folder / filename

    # Verificar si ya existe
    if daily_path.exists():
        print(f"  ℹ️  Daily {filename} ya existe")
        return str(daily_path)

    # Recopilar datos
    yesterday_notes = get_yesterday_notes(vault_path)
    pending_tasks = get_pending_tasks(vault_path)
    blocked_tasks = get_blocked_tasks(vault_path)
    active_projects = get_active_projects(vault_path)

    # Calcular fecha de ayer para el header
    yesterday = today - datetime.timedelta(days=1)

    # Crear contenido
    content = f"""---
tags: ['#para/a/diario', '#daily', '#standup']
created: {today}
updated: {today}
status: active
priority: medium
sprint: {get_sprint_number()}
---

# 📅 {today} - Daily Standup

## 🤝 ¿Qué hice ayer?

"""

    if yesterday_notes:
        for note in yesterday_notes:
            content += f"- [[{note['name']}]]\n"
    else:
        content += "_No se encontraron notas modificadas ayer_\n"

    content += f"""
## 🎯 ¿Qué voy a hacer hoy?

"""

    if pending_tasks:
        for task in pending_tasks[:5]:
            content += f"- [ ] {task['task']} ([[{task['project']}]])\n"
    else:
        content += "_No hay tareas pendientes_\n"

    content += """
## 🚧 Blockers

"""

    if blocked_tasks:
        for task in blocked_tasks:
            content += f"- ⚠️ [[{task['project']}]]\n"
    else:
        content += "_No hay bloqueos_\n"

    content += f"""
---

## 📊 Proyectos Activos ({len(active_projects)})

"""

    for project in active_projects[:5]:
        content += f"- [[{project['name']}]]\n"

    content += f"""
## 📈 Métricas

- **Fecha:** {today}
- **Día de la semana:** {today.strftime("%A")}
- **Sprint:** {get_sprint_number()}
- **Tareas pendientes:** {len(pending_tasks)}
- **Bloqueos:** {len(blocked_tasks)}

---

## 🧠 Reflexión (opcional)

_¿Qué aprendí hoy? ¿Qué puedo mejorar?_

-

#daily #standup
"""

    # Escribir archivo
    daily_folder.mkdir(parents=True, exist_ok=True)
    daily_path.write_text(content, encoding="utf-8")

    print(f"  ✓ Daily Standup creada: {daily_path}")
    return str(daily_path)


def get_sprint_number() -> int:
    """Calcula el número de sprint actual (quincenal desde 2026-01-01)."""
    start_date = datetime.date(2026, 1, 1)
    today = datetime.date.today()
    days = (today - start_date).days
    sprint = (days // 14) + 1
    return sprint


if __name__ == "__main__":
    vault = Path("/home/arrigobaggio/Obsidian/GlitchBrain")
    result = create_daily_note(vault)
    print(f"Resultado: {result}")
