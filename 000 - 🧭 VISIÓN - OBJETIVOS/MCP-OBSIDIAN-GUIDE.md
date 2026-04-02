---
tags: ['#nota', '#sistema']
created: 2026-03-29
updated: 2026-03-29
status: active
priority: medium
---

# 🔗 Integración MCP - Obsidian 3.1 (OpenCode)

Conecta OpenCode directamente con tu vault de Obsidian.


#¿Qué permite?

- ✅ **Leer notas** desde la conversación de AI
- ✅ **Crear notas** automáticamente desde AI
- ✅ **Buscar** en todo el vault
- ✅ **Editar** notas existentes
- ✅ **Gestionar** archivos y carpetas

---


#Paso 1: Instalar Plugin Local REST API en Obsidian

1. Abrir **Obsidian**
2. Ir a **Settings → Community plugins**
3. Buscar: **"Local REST API"** (por Adam Coddington)
4. Click en **Install** y luego **Enable**
5. Ir a **Settings → Local REST API**
6. **Copiar el API Key** (la necesitás después)
7. Verificar que el servidor esté corriendo (debería decir "Running")
8. **Guardar la URL**: `https://127.0.0.1:27124`

---


#Paso 2: Instalar uv (gestor de Python)

```bash

#En Mac/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh


#O verificar si ya está instalado
which uvx
```

---


#Paso 3: Configurar OpenCode


#Encontrar el archivo de config

OpenCode busca el config en este orden:
1. `./opencode.config.json` (en el proyecto actual)
2. `~/.opencode/config.json` (global)


#Agregar el MCP de Obsidian

Editar `~/.opencode/config.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "obsidian": {
      "type": "local",
      "command": ["uvx", "mcp-obsidian"],
      "enabled": true,
      "environment": {
        "OBSIDIAN_API_KEY": "TU_API_KEY_AQUI",
        "OBSIDIAN_HOST": "127.0.0.1",
        "OBSIDIAN_PORT": "27124"
      }
    }
  }
}
```

**Reemplazar** `TU_API_KEY_AQUI` con tu API Key de Obsidian.

---


#Paso 4: Reiniciar OpenCode y Probar

1. Cerrar y abrir **OpenCode** nuevamente
2. Verificar que el MCP esté cargado


#Comandos de ejemplo para probar:

- *"Lee el contenido de la nota EMPIEZA AQUÍ en mi vault de Obsidian"*
- *"Busca todas las notas que mencionen 'presupuesto' en Obsidian"*
- *"Crea una nueva nota llamada 'Prueba MCP' con el contenido 'Hola desde OpenCode'"*
- *"Lista todos los archivos en la carpeta 100 - PROYECTOS"*

---


#Solución de Problemas


#"MCP server not found"
```bash

#Verificar que uv esté instalado
which uvx


#Instalar manualmente el servidor
uvx install mcp-obsidian
```


#"Connection refused"
- Verificar que el plugin Local REST API esté habilitado en Obsidian
- Chequear que el puerto sea 27124


#"API Key inválida"
- Ir a Settings → Local REST API en Obsidian
- Generar una nueva API Key


#Verificar que MCP esté cargado
```bash
opencode mcp list
```

---


#Estado del Sistema

- **Plugin Local REST API**: ❌ (pendiente de instalación en Obsidian)
- **MCP mcp-obsidian**: ⚙️ (listo para configurar en OpenCode)
- **Configuración**: Listo para usar

---


#Alternativa: Sin MCP (solo búsqueda local)

Si no querés instalar el MCP, seguí usando:
- `python3 scripts/rag/search_vault.py "tu búsqueda"`
- Dashboard → sección RAG

---


#Más info

- [Documentación OpenCode MCP](https://opencode-tutorial.com/en/docs/mcp-servers)
- [MCP Obsidian GitHub](https://github.com/markuspfundstein/mcp-obsidian)

---

**Versión**: Obsidian 3.1 + OpenCode MCP Integration  
**Fecha**: 2026-03-29



#🔗 Relacionado

- [[OBSIDIAN-3.1-STATUS]]

