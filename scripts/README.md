---
tags: ['#para/x/documentacion', '#obsidian-3.1']
created: 2026-03-29
updated: 2026-03-29
status: active
priority: medium
---

#🚀 Sistema Obsidian 3.1 - Scripts de Automatización


#📋 Descripción
Este directorio contiene los scripts de automatización para el sistema Obsidian 3.1 (Fase 2 - Agencia).


#🛠️ Scripts Disponibles


#1. 🔄 `backup_git.py` - Backup Automático
**Descripción:** Crea backups periódicos del vault usando Git.
```bash
python3 scripts/backup_git.py
```
**Características:**
- Inicializa repositorio Git si no existe
- Detecta cambios automáticamente
- Crea commits con mensaje automático
- Intenta push a remote si está configurado


#2. 📝 `auto_frontmatter.py` - Frontmatter Automático
**Descripción:** Agrega YAML frontmatter a notas que no lo tienen.
```bash
python3 scripts/auto_frontmatter.py
```
**Características:**
- Escanea todo el vault
- Agrega frontmatter básico (tags, fechas, estado)
- Infiere tags basados en la ubicación
- No modifica notas que ya tienen frontmatter


#3. 🔗 `check_links.py` - Analizador de Enlaces
**Descripción:** Analiza enlaces internos y detecta enlaces rotos.
```bash
python3 scripts/check_links.py
```
**Características:**
- Analiza enlaces wikilink [[...]]
- Detecta enlaces a archivos inexistentes
- Genera reporte detallado en `REPORTES/enlaces-rotos.md`
- Muestra estadísticas de conectividad


#4. 📤 `export_note.py` - Exportador de Notas
**Descripción:** Exporta notas individuales a HTML con CSS personalizado.
```bash
python3 scripts/export_note.py "ruta/a/nota.md" [directorio_salida]
```
**Ejemplo:**
```bash
python3 scripts/export_note.py "100 - ✅ PROYECTOS/2026-03-29"
```
**Características:**
- Convierte Markdown a HTML
- Incluye CSS personalizado
- Preserva enlaces internos
- Agrega metadatos de exportación


#5. 📊 `productivity_stats.py` - Estadísticas de Productividad
**Descripción:** Analiza métricas de uso del vault y genera reportes.
```bash
python3 scripts/productivity_stats.py
```
**Características:**
- Cuenta notas totales y organizadas
- Analiza distribución por carpetas
- Estadísticas de tags y tareas
- Métricas de conectividad
- Recomendaciones de mejora
- Genera reporte en `REPORTES/productividad.md`


#🎯 Uso Recomendado


#**Diario:**
1. **Backup automático:** Ejecutar `backup_git.py` al final del día
2. **Notas nuevas:** Ejecutar `auto_frontmatter.py` después de crear varias notas


#**Semanal:**
1. **Análisis de enlaces:** Ejecutar `check_links.py` para mantener conectividad
2. **Estadísticas:** Ejecutar `productivity_stats.py` para ver progreso
3. **Exportación:** Exportar notas importantes para respaldo externo


#📁 Estructura de Directorios
```
scripts/
├── ...                    # Este archivo
├── backup_git.py               # Backup con Git
├── auto_frontmatter.py         # Frontmatter automático
├── check_links.py              # Analizador de enlaces
├── export_note.py              # Exportador HTML
├── productivity_stats.py       # Estadísticas
└── templates/
    └── export.css              # CSS para exportación

EXPORTACIONES/                  # Notas exportadas a HTML
REPORTES/                       # Reportes generados
```


#⚙️ Configuración


#**Git Backup:**
- El script crea un branch `backup/auto` para backups
- Para configurar remote: `git remote add origin <url>`
- El .gitignore ya está configurado para ignorar `.obsidian/`


#**Exportación CSS:**
- Personalizar `templates/export.css` para cambiar estilos
- El CSS incluye estilos para tags, tareas, enlaces, etc.


#🔗 Integración con Obsidian 3.1


#**Fase 2 - Agencia:**
- ✅ Scripts de automatización implementados
- ✅ Dashboard de control creado
- ⏳ Integración con APIs (próximo paso)
- ⏳ Scripts condicionales (próximo paso)


#**Fase 3 - Automatización (Planificada):**
- 🔄 Sistema RAG con DuckDB
- 🔄 Búsqueda semántica
- 🔄 Agentes autónomos
- 🔄 Model Context Protocol (MCP)


#📊 Métricas del Sistema


#**Estado Actual:**
- **Vault:** GlitchBrain (376+ notas)
- **Plugins:** Dataview, Templater, Tasks
- **Sistema:** PARA + Zettelkasten
- **Versión:** Obsidian 3.1 Fase 2


#**Scripts Automatizados:**
- **Backup:** Diario
- **Frontmatter:** Cuando hay nuevas notas
- **Análisis:** Semanal
- **Exportación:** Bajo demanda


#🚀 Próximos Pasos

1. **Configurar Git remote** para backups en la nube
2. **Programar ejecución automática** de scripts (cron en Linux)
3. **Crear scripts específicos** para el proyecto ITB
4. **Implementar integración con APIs** (clima, noticias, etc.)


#📞 Soporte

Para problemas o mejoras:
1. Verificar que Python 3.12+ esté instalado
2. Verificar permisos de escritura en el vault
3. Consultar logs de error (los scripts imprimen errores detallados)

---
*Sistema Obsidian 3.1 - Fase 2: Agencia*
*Última actualización: 2026-03-29*