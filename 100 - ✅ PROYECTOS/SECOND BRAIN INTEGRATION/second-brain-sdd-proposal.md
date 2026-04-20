---
aliases: ['second-brain-sdd-proposal']
---

# 🧠 AI Second Brain Integration - SDD Proposal

**Status:** 📋 Proposal  
**Created:** 2026-04-02  
**Version:** 1.0  
**Reference:** [second-brain-starter](https://github.com/coleam00/second-brain-starter)

---

## 🎯 Objetivo

Integrar un sistema de Segundo Cerebro con IA en tu vault existente de Obsidian que:
1. Complemente y mejore la estructura actual (PARA + Zettelkasten)
2. Permita acceso móvil seguro a tus notas
3. Habilite interacción remota vía Discord/Telegram
4. Establezca una capa de memoria persistente para el agente AI
5. Implemente monitoreo proactivo de tus plataformas

---

## 📊 Análisis de Estado Actual

### ✅ Lo que YA funciona
- Estructura organizada: `000 VISIÓN`, `100 PROYECTOS`, `200 MEMORIA`, `300 MODELOS`, `900 DIARIO`, `901 PLANTILLAS`
- Plantillas reorganizadas por propósito (6 categorías)
- Notas diarias con standups y métricas
- MCP tools configuradas para lectura/escritura de Obsidian
- Documentación de integración: `MCP-OBSIDIAN-GUIDE.md`, `MCP-DISCORD-GUIDE.md`

### 🚨 Problemas identificados
- No hay acceso móvil a las notas
- La memoria del agente no persiste entre sesiones largas
- No hay sistema proactivo que monitoree cosas por ti
- No hay bot de Discord/Telegram para interactuar remotamente
- Carpetas pesadas (`venv/`, `.obsidian/`) dificultan sync

---

## 🏗️ Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────────┐
│                    TU SEGUNDO CEREBRO                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 MÓVIL ←→ 🌐 CLOUD ←→ 💻 PC OFICINA                     │
│           (Git/Sync)         (Obsidian + Agent)             │
│                                                             │
│  💬 DISCORD/TELEGRAM ←→ 🤖 BOT ←→ 🧠 AI AGENT              │
│                                                             │
│  📁 VAULT STRUCTURE (complementa lo existente):             │
│  ├── 000 - 🧭 VISIÓN - OBJETIVOS/                          │
│  ├── 100 - ✅ PROYECTOS/                                    │
│  ├── 200 - 🌍 MEMORIA DIGITAL/                              │
│  ├── 300 - 🧠 MODELOS MENTALES/                             │
│  ├── 900 - 📆 DIARIO/                                       │
│  ├── 901 - 🧱 PLANTILLAS/                                   │
│  │   └── NUEVO: .agent/ (memoria del agente)               │
│  └── NUEVO: .sync/ (configuración de sync)                  │
│                                                             │
│  🧩 CAPAS DEL SISTEMA:                                      │
│  1. Memoria del Agente (SOUL, USER, MEMORY)                 │
│  2. Sync Móvil (Git + .gitignore optimizado)                │
│  3. Bot Interface (Discord/Telegram)                        │
│  4. Proactivity System (Heartbeat + Daily Reflection)       │
│  5. Security Layer (CLI wrappers, no API keys en vault)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Fases de Implementación

### Fase 1: Capa de Memoria del Agente (Semana 1)
**Objetivo:** Crear archivos de identidad y memoria persistente

**Archivos a crear:**
```
.agent/
├── SOUL.md           # Personalidad, valores, límites del agente
├── USER.md           # Tu perfil, cuentas, preferencias, proyectos activos
├── MEMORY.md         # Decisiones clave, lecciones, contexto activo
└── daily/            # Logs de sesiones con timestamp
    └── YYYY-MM-DD.md
```

**Contenido base:**
- `SOUL.md`: "Soy tu asistente de segundo cerebro. Mi rol es..."
- `USER.md`: Perfil completo con proyectos, contactos, preferencias
- `MEMORY.md`: Decisiones arquitectónicas, patrones establecidos, gotchas

**Integración con existente:**
- Se vincula con `900 - 📆 DIARIO/` para logs diarios
- Se referencia desde `MCP-OBSIDIAN-GUIDE.md`
- No reemplaza notas existentes, las complementa

**Criterio de éxito:**
- ✅ Archivos creados con contenido inicial
- ✅ El agente puede cargar contexto al iniciar sesión
- ✅ La memoria persiste entre conversaciones

---

### Fase 2: Sync Móvil Seguro (Semana 1-2)
**Objetivo:** Acceso a notas desde celular sin subir basura

**Estrategia:**
1. Crear `.gitignore` optimizado:
```gitignore
# Excluir todo lo pesado
.venv/
venv/
__pycache__/
*.pyc
.obsidian/
Excalidraw/Scripts/Downloaded/
*.canvas
.DS_Store
Thumbs.db
*.db

# Incluir solo notas
*.md
!.gitignore
```

2. Configurar Git en vault:
```bash
git init
git add *.md 000-* 100-* 200-* 300-* 900-* 901-*
git commit -m "Initial vault sync - notes only"
```

3. Opciones de sync móvil:
   - **Opción A:** GitHub Mobile app (gratis)
   - **Opción B:** Obsidian Git plugin + celular
   - **Opción C:** Remotely Save plugin (Google Drive)

**Criterio de éxito:**
- ✅ Vault en GitHub privado
- `.gitignore` excluye archivos pesados
- Podés leer notas desde celular

---

### Fase 3: Bot de Discord/Telegram (Semana 2-3)
**Objetivo:** Interactuar con tu segundo cerebro desde el celular

**Arquitectura:**
```
📱 Celular → 💬 Discord/Telegram → 🤖 Bot → 🖥️ PC Oficina → 🧠 AI Agent → 📁 Obsidian
```

**Componentes:**
1. **Bot Server** (Python/Node en tu PC):
   - Recibe mensajes de Discord/Telegram
   - Ejecuta comandos vía MCP tools
   - Devuelve respuestas al chat

2. **Comandos soportados:**
   - `/note create <title> <content>` - Crear nota
   - `/note search <query>` - Buscar en vault
   - `/daily` - Ver nota del día
   - `/projects` - Listar proyectos activos
   - `/memory` - Ver MEMORY.md
   - `/standup` - Generar daily standup

3. **Seguridad:**
   - Token del bot en `.env` (NO en vault)
   - Whitelist de usuarios autorizados
   - Rate limiting básico

**Criterio de éxito:**
- ✅ Bot responde a comandos básicos
- ✅ Podés crear/buscar notas desde Discord
- ✅ Respuestas en <5 segundos

---

### Fase 4: Sistema Proactivo (Semana 3-4)
**Objetivo:** El agente monitorea y te notifica automáticamente

**Niveles de Proactividad:**
| Nivel | Qué hace | Ejemplo |
|-------|----------|---------|
| **Observer** | Solo notifica | "Tenés 3 tareas vencidas" |
| **Advisor** | Sugiere acciones | "Deberías revisar ITB presupuesto" |
| **Assistant** | Auto-organiza | Crea notas diarias, loguea decisiones |
| **Partner** | Acciones de bajo riesgo | Envía recordatorios, actualiza status |

**Heartbeat (cada 30 min):**
```python
# Pseudo-código
def heartbeat():
    check_email()      # Gmail API
    check_calendar()   # Google Calendar
    check_tasks()      # GitHub Issues / Linear
    generate_summary() # AI resume lo importante
    send_notification() # Discord/Telegram
```

**Daily Reflection (automática al final del día):**
- Genera resumen del día
- Actualiza `MEMORY.md` con decisiones
- Sugiere prioridades para mañana

**Criterio de éxito:**
- ✅ Heartbeat corre cada 30 min
- ✅ Notificaciones llegan a Discord
- ✅ Daily reflection se genera automáticamente

---

### Fase 5: Integraciones con Plataformas (Semana 4-5)
**Objetivo:** Conectar con tus herramientas existentes

**Integraciones prioritarias:**
1. **GitHub** (ya configurado):
   - Issues, PRs, commits
   - Sincronización de vault

2. **Discord** (ya configurado):
   - Bot interface
   - Notificaciones

3. **Gmail** (nuevo):
   - Python CLI wrapper (`query.py gmail list`)
   - Nunca expone API keys al agente

4. **Google Calendar** (nuevo):
   - Próximos eventos
   - Recordatorios

**Patrón de seguridad:**
```
🧠 AI Agent → 📜 query.py gmail list → 🔑 API Key (en .env)
```
El agente NUNCA ve las credenciales, solo los resultados.

---

### Fase 6: Búsqueda Híbrida (Semana 5-6)
**Objetivo:** Búsqueda potente en tu vault

**Implementación:**
- **70% Vector search:** FastEmbed (local, ONNX)
- **30% Keyword search:** SQLite FTS5
- **Resultado:** Mejor de ambos mundos

**Uso:**
```
/search "¿qué decidimos sobre ITB?"
→ Busca en notas, MEMORY.md, daily logs
→ Devuelve resultados ranked
```

---

### Fase 7: Security Hardening (Semana 6)
**Objetivo:** Asegurar todo el sistema

**Medidas:**
1. `.env` para todas las credenciales
2. Python CLI wrappers para APIs externas
3. Rate limiting en bot
4. Whitelist de usuarios
5. Logs de auditoría en `.agent/audit/`
6. Sanitización de inputs

---

### Fase 8: Deployment (Semana 6-7)
**Objetivo:** Sistema corriendo 24/7

**Opciones:**
1. **Local:** PC de oficina siempre prendida
2. **VPS:** $5-10/mes en DigitalOcean/AWS
3. **Hybrid:** Local + backup en cloud

**Componentes a deployar:**
- Bot server (Discord/Telegram)
- Heartbeat scheduler (cron/systemd)
- Git sync automático

---

## 📁 Estructura Final del Vault

```
GlitchBrain/
├── .agent/                    # NUEVO: Memoria del agente
│   ├── SOUL.md
│   ├── USER.md
│   ├── MEMORY.md
│   ├── daily/
│   │   └── YYYY-MM-DD.md
│   └── audit/                 # Logs de seguridad
├── .sync/                     # NUEVO: Config de sync
│   └── sync-config.md
├── 000 - 🧭 VISIÓN - OBJETIVOS/
├── 100 - ✅ PROYECTOS/
├── 200 - 🌍 MEMORIA DIGITAL/
├── 300 - 🧠 MODELOS MENTALES/
├── 900 - 📆 DIARIO/
├── 901 - 🧱 PLANTILLAS/
├── .gitignore                 # NUEVO: Optimizado
├── .env                       # NUEVO: Credenciales (NO en git)
└── scripts/
    └── integrations/          # NUEVO: CLI wrappers
        ├── query.py
        └── heartbeat.py
```

---

## ⚠️ Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| PC apagada | Bot no funciona | VPS fallback o notificaciones offline |
| Conflictos de sync | Notas duplicadas | Git merge策略 + backup diario |
| API keys expuestas | Seguridad | `.env` + CLI wrappers + nunca en vault |
| Over-engineering | Complejidad innecesaria | Fases incrementales, validar cada una |
| Costos cloud | Presupuesto | Empezar local, escalar si es necesario |

---

## 📊 Métricas de Éxito

- ✅ Acceso móvil funcionando en 2 semanas
- ✅ Bot responde en <5 segundos
- ✅ Heartbeat notifica sin falsos positivos
- ✅ Búsqueda híbrida encuentra notas relevantes
- ✅ Cero credenciales expuestas en vault
- ✅ Sync no sube archivos >1MB

---

## 🚀 Próximos Pasos Inmediatos

1. **Aprobar esta propuesta** (¿querés ajustar algo?)
2. **Fase 1:** Crear `.agent/` con SOUL.md, USER.md, MEMORY.md
3. **Fase 2:** Configurar Git sync con `.gitignore` optimizado
4. **Fase 3:** Crear bot básico de Discord

---

## 📝 Notas de Implementación

- Cada fase es independiente y testeable
- Se puede parar después de cualquier fase
- Todo complementa lo existente, nada se reemplaza
- Los archivos nuevos van en `.agent/`, no mezclados con notas personales
- La seguridad es prioridad: API keys NUNCA en vault

---

**¿Aprobamos esta propuesta para empezar con la Fase 1?**