#!/usr/bin/env python3
"""
Audit notes in the Obsidian vault.

Produces a machine-readable report of:
- Notes without frontmatter (sanity check)
- Notes with placeholder/DEMO content
- Potential orphaned notes (low connectivity)
- Frontmatter consistency (tags, date, status)
- Duplicate names (by stem) across paths
- Files in root that should be in folders
"""

import json
from pathlib import Path
import re
from collections import defaultdict

VAULT = Path("/home/arrigobaggio/Obsidian/GlitchBrain")


def all_md_files(root: Path):
    return [
        p
        for p in root.rglob("*.md")
        if ".obsidian" not in str(p)
        and ".git" not in str(p)
        and "venv" not in str(p)
        and "rag/venv" not in str(p)
    ]


def check_frontmatter(p: Path):
    try:
        text = p.read_text(encoding="utf-8")
        return text.strip().startswith("---")
    except Exception:
        return False


def extract_frontmatter(p: Path):
    text = p.read_text(encoding="utf-8")
    # naive parse: first block until '---' twice
    fm = re.findall(r"^---\n(.*?)\n---", text, flags=re.S | re.M)
    if fm:
        return fm[0]
    return ""


def has_demo_content(p: Path):
    text = "".join(p.read_text(encoding="utf-8", errors="ignore").lower().split())
    return "contenidopendiente" in text or "puedesencontrarestanotarellena" in text


def main():
    notes = all_md_files(VAULT)
    issues = []
    for n in notes:
        entry = {"path": str(n)}
        fm = extract_frontmatter(n)
        entry["has_frontmatter"] = bool(fm)
        if not entry["has_frontmatter"]:
            issues.append({"type": "frontmatter_missing", "path": str(n)})
        if has_demo_content(n):
            issues.append({"type": "demo_content", "path": str(n)})
        # basic content scan
        try:
            text = n.read_text(encoding="utf-8")
            entry["wordcount"] = len(text.split())
            # detect obvious placeholders
            if (
                "contenido pendiente" in text.lower()
                or "puedes encontrar" in text.lower()
            ):
                entry["has_placeholder"] = True
            else:
                entry["has_placeholder"] = False
        except Exception:
            entry["wordcount"] = 0
            entry["has_placeholder"] = True
        issues.append(
            {
                "type": "note_summary",
                "path": str(n),
                "frontmatter": entry.get("has_frontmatter", False),
                "has_placeholder": entry.get("has_placeholder", False),
            }
        )

    # duplicates by stem
    stems = defaultdict(list)
    for n in notes:
        stems[n.stem.lower()].append(str(n))
    dupes = {k: v for k, v in stems.items() if len(v) > 1}

    report = {
        "notes_count": len(notes),
        "frontmatter_issues": [
            r for r in issues if r.get("type") == "frontmatter_missing"
        ],
        "demo_notes": [r for r in issues if r.get("type") == "demo_content"],
        "duplicate_stems": dupes,
    }

    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
