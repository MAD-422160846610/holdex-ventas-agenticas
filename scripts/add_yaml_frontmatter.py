#!/usr/bin/env python3
"""
Script para agregar YAML frontmatter a notas que no lo tengan.
Sigue el sistema de tags #para/p/nombre y #zk/permanent descrito en Obsidian 3.1.
"""

import os
import sys
from pathlib import Path
from datetime import datetime

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"

def get_tags_from_path(file_path: str) -> list:
    """Infiere tags basados en la ruta del archivo."""
    rel_path = os.path.relpath(file_path, VAULT_PATH)
    parts = Path(rel_path).parts
    
    tags = []
    
    # Mapeo de carpetas a tags PARA
    folder_tag_map = {
        "000 - 🧭 VISIÓN - OBJETIVOS": "#para/a/vision",
        "001 - 📥 CAPTURA": "#para/a/captura",
        "050 -  🏆 ACTIVOS": "#para/a/activos",
        "100 - ✅ PROYECTOS": "#para/p/proyecto",
        "200 - 🌍 MEMORIA DIGITAL": "#para/r/memoria-digital",
        "300 - 🧠 MODELOS MENTALES": "#para/r/modelos-mentales",
        "900 - 📆 DIARIO": "#para/a/diario",
        "901 - 🧱 PLANTILLAS": "#para/x/plantillas",
        "999 - 🗑 ARCHIVO": "#para/x/archivo",
        "ANEXOS": "#para/r/anexos",
        "Excalidraw": "#para/r/excalidraw"
    }
    
    # Buscar la carpeta principal
    for folder, tag in folder_tag_map.items():
        if folder in rel_path:
            tags.append(tag)
            break
    
    # Si es un proyecto específico, agregar tag más específico
    if "100 - ✅ PROYECTOS" in rel_path:
        # Extraer nombre del proyecto del archivo
        filename = Path(file_path).stem
        if filename and not filename.startswith("plantilla"):
            tags.append(f"#para/p/{filename.lower().replace(' ', '-')}")
    
    # Si es una nota atómica (en 200 - 🌍 MEMORIA DIGITAL), agregar #zk/permanent
    if "200 - 🌍 MEMORIA DIGITAL" in rel_path:
        tags.append("#zk/permanent")
    
    # Si es una nota diaria, agregar #daily
    if "900 - 📆 DIARIO" in rel_path:
        tags.append("#daily")
    
    # Si es una plantilla, agregar #template
    if "901 - 🧱 PLANTILLAS" in rel_path:
        tags.append("#template")
    
    # Si el archivo contiene "MOC" o "Mapa de Contenido", agregar #zk/moc
    filename_lower = Path(file_path).stem.lower()
    if "moc" in filename_lower or "mapa de contenido" in filename_lower:
        tags.append("#zk/moc")
    
    # Si el archivo contiene "ADR", agregar #zk/permanent
    if "adr" in filename_lower:
        tags.append("#zk/permanent")
    
    # Si no hay tags, agregar uno genérico
    if not tags:
        tags.append("#nota")
    
    return tags

def get_creation_date(file_path: str) -> str:
    """Obtiene la fecha de creación/modificación del archivo."""
    try:
        mtime = os.path.getmtime(file_path)
        return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
    except:
        return datetime.now().strftime("%Y-%m-%d")

def has_frontmatter(file_path: str) -> bool:
    """Verifica si el archivo ya tiene YAML frontmatter."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
            return first_line == "---"
    except:
        return False

def add_frontmatter(file_path: str, tags: list, date: str) -> str:
    """Crea el contenido con frontmatter agregado."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return None
    
    # Crear frontmatter
    frontmatter = f"""---
tags: {tags}
created: {date}
updated: {date}
status: active
priority: medium
---
"""
    
    # Agregar frontmatter al contenido
    new_content = frontmatter + content
    return new_content

def process_file(file_path: str):
    """Procesa un archivo individual."""
    if has_frontmatter(file_path):
        print(f"⏭ Ya tiene frontmatter: {os.path.basename(file_path)}")
        return
    
    tags = get_tags_from_path(file_path)
    date = get_creation_date(file_path)
    
    new_content = add_frontmatter(file_path, tags, date)
    if new_content is None:
        print(f"❌ Error al leer: {os.path.basename(file_path)}")
        return
    
    # Escribir el archivo
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Agregado frontmatter: {os.path.basename(file_path)}")
        print(f"   Tags: {tags}")
    except Exception as e:
        print(f"❌ Error al escribir: {os.path.basename(file_path)} - {e}")

def main():
    """Función principal."""
    print("🔍 Buscando archivos .md sin frontmatter...")
    
    count = 0
    for root, dirs, files in os.walk(VAULT_PATH):
        # Ignorar directorio .obsidian
        if ".obsidian" in root:
            continue
        
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                process_file(file_path)
                count += 1
    
    print(f"\n🎉 Proceso completado. Archivos procesados: {count}")

if __name__ == "__main__":
    main()