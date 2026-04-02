---
tags: ['#nota', '#sistema', '#mcp']
created: 2026-04-01
updated: 2026-04-01
status: active
priority: medium
---

# 🔌 Integración MCP - Discord GlitchCat OS

Conecta OpenCode directamente con tu bot de Discord.


#¿Qué permite?

- ✅ **Enviar mensajes** a canales y DMs
- ✅ **Editar/eliminar mensajes**
- ✅ **Gestionar canales** (info, crear DMs)
- ✅ **Administrar friends** (agregar, remover, listar)
- ✅ **Controlar presencia** del bot
- ✅ **Descargar archivos** adjuntos


#📋 Estado del Sistema

| Componente | Estado |
|------------|--------|
| Bot | GlitchCat OS |
| Paquete | discord-mcp v2.4.0 |
| Herramientas | 19 |
| Estado | ✅ Activo |


#🛠️ Herramientas Disponibles

## Mensajes
- `discord_send_message` - Enviar mensajes con archivos
- `discord_edit_message` - Editar mensajes existentes
- `discord_delete_message` - Eliminar mensajes
- `discord_add_reaction` - Agregar reacciones
- `discord_remove_reaction` - Quitar reacciones
- `discord_get_message_history` - Historial de mensajes
- `discord_search_messages` - Buscar mensajes
- `discord_get_message` - Obtener mensaje específico

## Archivos
- `discord_list_attachments` - Listar adjuntos
- `discord_download_attachment` - Descargar adjuntos
- `discord_cleanup_download` - Limpiar archivos temporales

## Canales
- `discord_get_channel` - Info de canal
- `discord_get_dm_channels` - Listar DMs
- `discord_create_dm` - Crear/obtener DM

## Friends
- `discord_get_friends` - Lista de amigos
- `discord_add_friend` - Enviar solicitud
- `discord_remove_friend` - Remover amigo

## Presencia
- `discord_update_presence` - Actualizar status
- `discord_clear_presence` - Limpiar status


#📁 Archivos del Sistema

- **Paquete:** `~/mcp-discord/`
- **Token:** Configurado en `~/.config/opencode/opencode.json`
- **Logs:** Consola de OpenCode


#🔗 Relacionado

- [[MCP-OBSIDIAN-GUIDE]] - Guía MCP de Obsidian
- [[OBSIDIAN-3.1-STATUS]] - Estado del sistema
- [[glitchcatv3-website-inteligente]] - Proyecto GlitchCat V3

---

*Documentación actualizada: 2026-04-01*
*Integración: OpenCode + Discord Bot*