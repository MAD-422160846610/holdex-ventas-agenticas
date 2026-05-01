#!/usr/bin/env python3
"""
Control - Revisión diaria del estado del vault

Analiza:
- Tareas pendientes
- Proyectos sin progreso
- Notas huérfanas (sin enlaces)
- Tags sin usar
- Enlaces rotos
"""

import datetime
import re
from pathlib import Path
from typing import Dict, List, Optional


def count_tasks(vault_path: Path) -> Dict:
    """Cuenta tareas pendientes y completadas."""
    total_pending = 0
    total_done = 0
    total_all = 0

    for md in vault_path.rglob("*.md"):
        if md.name.startswith("."):
            continue

        try:
            content = md.read_text(encoding="utf-8")
            total_pending += content.count("- [ ]")
            total_done += content.count("- [x]")
            total_all += content.count("- [ ]") + content.count("- [x]")
        except Exception:
            continue

    return {
        "pending": total_pending,
        "done": total_done,
        "total": total_all,
        "completion_rate": (total_done / total_all * 100) if total_all > 0 else 0,
    }


def find_orphaned_notes(vault_path: Path) -> List[Dict]:
    """Encuentra notas sin enlaces entrantes ni salientes."""
    notes = {}

    # Collect all notes
    for md in vault_path.rglob("*.md"):
        if md.name.startswith(".") or "plantilla" in md.name.lower():
            continue

        try:
            content = md.read_text(encoding="utf-8")

            # Count wikilinks
            inlinks = len(re.findall(r"\[\[([^\]|]+)", content))

            notes[md.stem] = {"path": str(md), "inlinks": inlinks, "outlinks": inlinks}
        except Exception:
            continue

    # Filter orphaned (no links at all) - add name field
    orphaned = []
    for name, data in notes.items():
        if data["inlinks"] == 0:
            orphaned.append({"name": name, **data})

    return orphaned[:20]  # Limit


def find_stalled_projects(vault_path: Path) -> List[Dict]:
    """Encuentra proyectos sin progreso reciente."""
    projects_folder = vault_path / "100 - ✅ PROYECTOS"

    if not projects_folder.exists():
        return []

    stalled = []
    today = datetime.datetime.now()
    thirty_days_ago = today - datetime.timedelta(days=30)

    for project in projects_folder.glob("*.md"):
        if project.name.startswith("."):
            continue

        try:
            mtime = datetime.datetime.fromtimestamp(project.stat().st_mtime)

            # Check if modified in last 30 days
            if mtime < thirty_days_ago:
                content = project.read_text(encoding="utf-8")

                # Check if still active
                if '"active"' in content or "status: active" in content.lower():
                    stalled.append(
                        {
                            "name": project.stem,
                            "days_inactive": (today - mtime).days,
                            "path": str(project),
                        }
                    )
        except Exception:
            continue

    return stalled


def find_unused_tags(vault_path: Path) -> List[str]:
    """Encuentra tags que solo se usan una vez."""
    tag_usage = {}

    for md in vault_path.rglob("*.md"):
        if md.name.startswith("."):
            continue

        try:
            content = md.read_text(encoding="utf-8")

            # Find tags
            tags = re.findall(r"#([a-zA-Z0-9_/-]+)", content)

            for tag in tags:
                if tag not in tag_usage:
                    tag_usage[tag] = 0
                tag_usage[tag] += 1
        except Exception:
            continue

    # Tags used only once (potential orphans)
    unused = [tag for tag, count in tag_usage.items() if count == 1]

    return sorted(unused)[:20]


def find_blocked_content(vault_path: Path) -> List[Dict]:
    """Encuentra contenido marcado como bloqueado."""
    blocked = []

    for md in vault_path.rglob("*.md"):
        if md.name.startswith("."):
            continue

        try:
            content = md.read_text(encoding="utf-8")
            lower_content = content.lower()

            if "#blocked" in lower_content or "#blocker" in lower_content:
                blocked.append({"name": md.stem, "path": str(md)})
        except Exception:
            continue

    return blocked


def find_dangling_links(vault_path: Path) -> List[Dict]:
    """Encuentra enlaces que no apuntan a nada."""
    # Collect all note names
    note_names = set()
    for md in vault_path.rglob("*.md"):
        if not md.name.startswith("."):
            note_names.add(md.stem)

    dangling = []

    for md in vault_path.rglob("*.md"):
        if md.name.startswith("."):
            continue

        try:
            content = md.read_text(encoding="utf-8")

            # Find wikilinks
            links = re.findall(r"\[\[([^\]|]+)", content)

            for link in links:
                if link not in note_names and link != md.stem:
                    dangling.append({"from": md.stem, "to": link, "path": str(md)})
        except Exception:
            continue

    return dangling[:20]


def run_control_check(vault_path: Path) -> Optional[Dict]:
    """Ejecuta el control y genera reporte."""

    print("  🔍 Analizando vault...")

    tasks = count_tasks(vault_path)
    orphaned = find_orphaned_notes(vault_path)
    stalled = find_stalled_projects(vault_path)
    unused_tags = find_unused_tags(vault_path)
    blocked = find_blocked_content(vault_path)
    dangling = find_dangling_links(vault_path)

    today = datetime.date.today()
    control_folder = vault_path / "900 - 📆 DIARIO" / "📋 Control"
    control_folder.mkdir(parents=True, exist_ok=True)

    filename = f"CONTROL-{today}.md"
    control_path = control_folder / filename

    # Crear contenido
    content = f"""---
tags: ['#para/a/diario', '#control', '#system']
created: {today}
updated: {today}
status: active
priority: medium
---

# 🔍 Control Diario - {today}

---

## 📊 Resumen

| Métrica | Valor |
|---------|-------|
| Tareas pendientes | {tasks["pending"]} |
| Tareas completadas | {tasks["done"]} |
| Tasa de completación | {tasks["completion_rate"]:.1f}% |
| Notas huérfanas | {len(orphaned)} |
| Proyectos estancados | {len(stalled)} |
| Contenido bloqueado | {len(blocked)} |
| Enlaces rotos | {len(dangling)} |

---

## 🎯 Tareas

- **Pendientes:** {tasks["pending"]}
- **Completadas:** {tasks["done"]}
- **Tasa:** {tasks["completion_rate"]:.1f}%

"""

    content += """
## 🚫 Notas Huérfanas (sin enlaces)

"""

    if orphaned:
        for note in orphaned[:10]:
            content += f"- [[{note['name']}]]\n"
    else:
        content += "_No hay notas huérfanas_\n"

    content += """
## ⏸️ Proyectos Estancados (sin actividad en 30 días)

"""

    if stalled:
        for p in stalled[:10]:
            content += f"- [[{p['name']}]] ({p['days_inactive']} días)\n"
    else:
        content += "_No hay proyectos estancados_\n"

    content += """
## 🚧 Contenido Bloqueado

"""

    if blocked:
        for b in blocked[:10]:
            content += f"- [[{b['name']}]]\n"
    else:
        content += "_No hay contenido bloqueado_\n"

    content += f"""
## 🔗 Enlaces Rotos

"""

    if dangling:
        for d in dangling[:10]:
            content += f"- [[{d['from']}]] → [[{d['to']}]]\n"
    else:
        content += "_No hay enlaces rotos_\n"

    content += f"""
## 🏷️ Tags con poco uso

{", ".join(unused_tags[:10]) if unused_tags else "_No hay tags subutilizados_"}

---

## ⚡ Acciones Recomendadas

"""

    if stalled:
        content += f"- ⚠️ {len(stalled)} proyectos necesitan atención\n"
    if blocked:
        content += f"- 🚧 {len(blocked)} elementos bloqueados\n"
    if dangling:
        content += f"- 🔗 {len(dangling)} enlaces rotos por reparar\n"
    if orphaned:
        content += f"- 📝 {len(orphaned)} notas huérfanas por conectar\n"

    if not any([stalled, blocked, dangling, orphaned]):
        content += "_ ✅ Todo看起来 bien!_\n"

    content += f"""
---

*Control ejecutado automáticamente - {datetime.datetime.now().strftime("%H:%M")}*

#control #system
"""

    # Escribir archivo
    control_path.write_text(content, encoding="utf-8")

    print(f"  ✓ Control completado: {control_path}")

    return {
        "pending": tasks["pending"],
        "done": tasks["done"],
        "completion_rate": tasks["completion_rate"],
        "orphaned": len(orphaned),
        "stalled": len(stalled),
        "blocked": len(blocked),
        "dangling": len(dangling),
    }


if __name__ == "__main__":
    vault = Path("/home/arrigobaggio/Obsidian/GlitchBrain")
    result = run_control_check(vault)
    print(f"\n📊 Resultados: {result}")
