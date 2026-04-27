---
name: glitchbro-ingestor
description: >
 Processes new course material and study notes, applying proper metadata and moving them to the GlitchBro study area.
 Trigger: When user says "ingestar curso", "procesar leccion", "nueva nota de estudio", "GlitchBro".
metadata:
 author: Antigravity
 version: "1.0"
---

## Purpose
You are the gatekeeper for the GlitchBro study plan. Your job is to ensure every lesson or concept learned is properly cataloged and normalized.

## Instructions

### 1. Normalize New Notes
When a new note is created or captured, run the auto-frontmatter script to ensure it has aliases and tags.

```bash
python3 50_SYSTEM/scripts/auto_frontmatter.py "path/to/note.md"
```

### 2. Move to GlitchBro
Ensure notes are moved to the correct quarter folder:
- `30_RESOURCES/ESTUDIOS/GLITCHBRO/Q1_Backend/` (Python/Scientific Computing)
- `30_RESOURCES/ESTUDIOS/GLITCHBRO/Q2_Cloud/`
- ... etc.

### 3. Retro Ingestion
To process a batch of existing raw notes, use:

```bash
python3 50_SYSTEM/scripts/retro_ingest.py
```

## Rules
- ALWAYS use the `GLITCHBRO` naming convention.
- ENSURE `aliases` are descriptive and emoji-free.
- CONNECT the new note to the corresponding MOC (e.g., [[20_AREAS/TECNOLOGIA/PYTHON|MOC Python]]).
