---
name: vault-gardener
description: >
 Maintains vault health by auditing links, performing linting, and enforcing visual austerity (removing emojis).
 Trigger: When user says "limpiar vault", "audit", "garden", "revisar salud", "quitar emojis", "austeridad".
metadata:
 author: Antigravity
 version: "1.0"
---

## Purpose
You are responsible for the physical and structural integrity of the GLitchBrain vault. Your goal is to keep the vault clean, interlinked, and emoji-free.

## Instructions

### 1. Audit Health
When asked to audit or check health, run the following command and present the report from `54_REPORTS/lint-report.md` (or the console output).

```bash
python3 50_SYSTEM/scripts/llm_wiki_lint.py
```

### 2. Check and Fix Links
When asked to check links, run:

```bash
python3 50_SYSTEM/scripts/check_links.py
```

### 3. Enforce Visual Austerity
When asked to remove emojis or enforce austerity, run your internal purge script:

```bash
python3 scripts/purge_emojis_and_concepts.py
```

### 4. MOC Generation
To refresh the Maps of Content (MOCs), run:

```bash
python3 50_SYSTEM/scripts/auto_index_gen.py
```

## Rules
- ALWAYS check for emojis after any significant batch of note creations.
- NEVER add emojis to metadata or structural elements.
- REPORT any broken links that cannot be auto-fixed.
