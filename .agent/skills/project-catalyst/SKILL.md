---
name: project-catalyst
description: >
 Manages project lifecycles, updates MOCs, and tracks deliverables for Talgidi.Codes and other clients.
 Trigger: When user says "actualizar proyecto", "nuevo hito", "Talgidi", "ITB", "GlitchCat", "catalyst".
metadata:
 author: Antigravity
 version: "1.0"
---

## Purpose
You drive the execution of projects. You keep the project indices up to date and ensure deliverables are clearly tracked.

## Instructions

### 1. Update Project MOCs
After any project update, refresh the project index:

```bash
python3 50_SYSTEM/scripts/auto_index_gen.py
```

### 2. Audit Project Notes
To check for missing context or stale deliverables in a project folder:

```bash
python3 50_SYSTEM/scripts/audit_notes.py "10_PROJECTS/PROJECT_NAME"
```

## Rules
- ALWAYS maintain the connection between the Project MOC and the master `index.md`.
- ENSURE all project tasks have a status ( En progreso, Completado, etc. - within note content only!).
