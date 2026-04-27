---
name: piso-architect
description: >
  Initializes and standardizes the structure of a "Piso" (department) in the Buildung Buildings incubator.
  Trigger: When user says "configurar piso", "nuevo departamento", "amoblar piso", "arquitectura de piso", "Piso 01", "Piso 02".
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- When initializing a new department in Buildung Buildings.
- When auditing or refactoring an existing "Piso".
- When seeking to standardize information across all departments.

## Critical Patterns

- **Flat Hierarchy**: All departmental notes must reside at the root of the project folder.
- **Naming**: Use numeric prefix for files (`01_VISION.md`, `02_TEAM.md`).
- **Metadata**: Every note must have a YAML block with `aliases`, `tags`, and `parent` pointing to the main project note.
- **Agentic Ready**: Information must be structured in bullet points or tables to facilitate AI parsing.

## Folder Structure Template

Every Piso project folder MUST contain:
- `01_VISION.md`: Mission, KPIs, and Strategic Goals.
- `02_TEAM.md`: Avatars (Team members), Roles, and Org Chart.
- `03_STACK.md`: Software stack, tools, and technical requirements.
- `04_PROJECTS.md`: List of active and backlog projects for the department.
- `05_DELIVERY.md`: Definition of "Done" and standard delivery formats.

## Commands

```bash
# To create the basic structure for a Piso
mkdir -p 10_PROJECTS/INTERNAL/piso-XX-name
touch 10_PROJECTS/INTERNAL/piso-XX-name/01_VISION.md
touch 10_PROJECTS/INTERNAL/piso-XX-name/02_TEAM.md
touch 10_PROJECTS/INTERNAL/piso-XX-name/03_STACK.md
touch 10_PROJECTS/INTERNAL/piso-XX-name/04_PROJECTS.md
touch 10_PROJECTS/INTERNAL/piso-XX-name/05_DELIVERY.md
```

## Resources

- **MOC Parent**: [[Buildung Buildings]]
- **Protocol**: [[AGENTS.md]]
