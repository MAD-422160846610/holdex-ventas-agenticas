#!/usr/bin/env python3
from pathlib import Path

VAULT = Path("/home/arrigobaggio/Obsidian/GlitchBrain")

DEMO_TEMPLATE = """---
created: 2025-01-01
updated: 2025-01-01
status: active
priority: medium
---

# Demo Note Filled

Este contenido es un relleno inicial para la nota DEMO, orientado a demostrar la estructura y la conectividad dentro del vault.

Relaciones relevantes:
- [[MI VISIÓN]]
- [[DASHBOARD]]
- [[Presupuesto ITB]]

## Contenido de ejemplo
- Punto de acción 1
- Punto de acción 2
- Punto de acción 3
"""


def main():
    demo_paths = []
    for p in VAULT.rglob("*.md"):
        if p.name.lower().startswith("demo") or "demo" in p.name.lower():
            continue
        # crude detection: if the file contains 'DEMO' in path or content placeholder
        txt = p.read_text(encoding="utf-8", errors="ignore")
        if (
            "contenido pendiente" in txt.lower()
            or "puedes encontrar esta nota rellena" in txt.lower()
        ):
            # fill with template
            p.write_text(DEMO_TEMPLATE, encoding="utf-8")
            demo_paths.append(str(p))
            print("Filled DEMO content:", p)
    print("Done. Updated", len(demo_paths), "notes.")


if __name__ == "__main__":
    main()
