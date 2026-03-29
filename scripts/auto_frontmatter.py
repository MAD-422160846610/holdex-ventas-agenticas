#!/usr/bin/env python3
"""
Script para agregar automáticamente YAML frontmatter a nuevas notas.
Ejecutar periódicamente o manualmente después de agregar notas.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"

def get_tags_from_path(file_path: str) -> list:
    """Infiere tags basados en la ruta del archivo (versión simplificada)."""
    rel_path = os.path.relpath(file_path, VAULT_PATH)
    parts = Path(rel_path).parts
    
    tags = []
    
    # Mapeo básico de carpetas a tags
    if "100 - ✅ PROYECTOS" in rel_path:
        tags.append("#para/p/proyecto")
        # Extraer nombre del proyecto
        filename = Path(file_path).stem
        if filename and not filename.startswith("plantilla"):
            tags.append(f"#para/p/{filename.lower().replace(' ', '-')}")
    elif "900 - 📆 DIARIO" in rel_path:
        tags.append("#para/a/diario")
        tags.append("#daily")
    elif "200 - 🌍 MEMORIA DIGITAL" in rel_path:
        tags.append("#para/r/memoria-digital")
        tags.append("#zk/permanent")
    elif "901 - 🧱 PLANTILLAS" in rel_path:
        tags.append("#para/x/plantillas")
        tags.append("#template")
    else:
        tags.append("#nota")
    
    return tags

def has_frontmatter(file_path: str) -> bool:
    """Verifica si el archivo ya tiene YAML frontmatter."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
            return first_line == "---"
    except:
        return False

def add_frontmatter_to_file(file_path: str):
    """Agrega frontmatter a un archivo específico."""
    if has_frontmatter(file_path):
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False
    
    # Obtener tags y fecha
    tags = get_tags_from_path(file_path)
    date = datetime.now().strftime("%Y-%m-%d")
    
    # Crear frontmatter
    frontmatter = f"""---
tags: {tags}
created: {date}
updated: {date}
status: active
priority: medium
---
"""
    
    # Escribir archivo con frontmatter
    new_content = frontmatter + content
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    except:
        return False

def main():
    """Función principal."""
    print("🔍 Buscando nuevas notas sin frontmatter...")
    
    count = 0
    for root, dirs, files in os.walk(VAULT_PATH):
        # Ignorar directorio .obsidian
        if ".obsidian" in root:
            continue
        
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                
                if not has_frontmatter(file_path):
                    if add_frontmatter_to_file(file_path):
                        print(f"✅ Agregado frontmatter: {os.path.basename(file_path)}")
                        count += 1
    
    if count == 0:
        print("✅ Todas las notas ya tienen frontmatter.")
    else:
        print(f"🎉 Proceso completado. {count} notas actualizadas.")

if __name__ == "__main__":
    main()