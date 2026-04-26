# Skill Registry - Sabueso Web App

## Project Standards (Compact Rules)

### UI Design (Cyber-Brutalist Premium)
- Use vibrant colors over dark backgrounds (e.g., `#00FF00`, `#FF00FF`, `#FFFF00`).
- Implement scanline overlays and flicker animations for terminal-like feel.
- Use thick borders (2px-4px) and sharp corners.
- Micro-animations: `hover:translate-x-1 hover:-translate-y-1`.

### Data Synchronization
- Dashboards with high-frequency updates must use `force-dynamic`.
- Server Actions must call `revalidatePath` with the specific resource ID.
- Use unique `id` attributes for all buttons and inputs to ensure TestSprite compatibility.

### Security
- All routes under `/dashboard` must be protected by `middleware.ts`.
- Redirect unauthenticated users to `/handler/sign-in`.

## User Skills
| Skill | Trigger | Path |
|-------|---------|------|
| sdd-explore | /sdd-explore | ~/.gemini/antigravity/skills/sdd-explore/SKILL.md |
| sdd-propose | /sdd-propose | ~/.gemini/antigravity/skills/sdd-propose/SKILL.md |
| sdd-spec | /sdd-spec | ~/.gemini/antigravity/skills/sdd-spec/SKILL.md |
| sdd-design | /sdd-design | ~/.gemini/antigravity/skills/sdd-design/SKILL.md |
| sdd-tasks | /sdd-tasks | ~/.gemini/antigravity/skills/sdd-tasks/SKILL.md |
| sdd-apply | /sdd-apply | ~/.gemini/antigravity/skills/sdd-apply/SKILL.md |
| sdd-verify | /sdd-verify | ~/.gemini/antigravity/skills/sdd-verify/SKILL.md |
| sdd-archive | /sdd-archive | ~/.gemini/antigravity/skills/sdd-archive/SKILL.md |
