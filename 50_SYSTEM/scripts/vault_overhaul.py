import os
import re
import shutil
from pathlib import Path

# Configuración de Rutas
VAULT_ROOT = "/home/arrigobaggio/Obsidian/GlitchBrain"

# Mapeo de Carpetas Raíz
RENAME_MAP = {
    "000 - 🧭 VISIÓN - OBJETIVOS": "00_VISION",
    "000 - 📍 VISIÓN - OBJETIVOS": "00_VISION",
    "100 - ✅ PROYECTOS": "10_PROJECTS",
    "200 - 🌍 MEMORIA DIGITAL": "20_AREAS",
    "300 - 🧠 MODELOS MENTALES": "30_RESOURCES",
    "900 - 📆 DIARIO": "90_DIARY",
    "901 - 🧱 PLANTILLAS": "51_TEMPLATES",
    "999 - 🗑 ARCHIVO": "40_ARCHIVE",
    "1000 -  EJEMPLOS YOUTUBE OBSIDIAN": "31_EXAMPLES_YOUTUBE",
    "RAW-LLM": "53_SOURCES",
    "REPORTES": "54_REPORTS",
    "ANEXOS": "52_ATTACHMENTS"
}

def remove_emojis(text):
    return "".join(c for c in text if c.isalnum() or c.isspace() or c in ".-_()[]").strip()

def clean_name(name):
    if name in RENAME_MAP:
        return RENAME_MAP[name]
    if name.startswith('.'):
        return name
    cleaned = remove_emojis(name)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned if cleaned else "unnamed"

def overhaul():
    print(f"--- Iniciando Overhaul v3 (Safe Regex) en {VAULT_ROOT} ---")
    
    name_changes = {}

    # 1. Mapear cambios
    for old_name, new_name in RENAME_MAP.items():
        if os.path.exists(os.path.join(VAULT_ROOT, old_name)):
            name_changes[old_name] = new_name

    for root, dirs, files in os.walk(VAULT_ROOT, topdown=False):
        if any(part.startswith('.') for part in root.split(os.sep)):
            continue
        for name in dirs + files:
            if name in RENAME_MAP.values(): continue
            cleaned = clean_name(name)
            if cleaned != name:
                name_changes[name] = cleaned

    # 2. Renombrado físico
    for root, dirs, files in os.walk(VAULT_ROOT, topdown=False):
        if any(part.startswith('.') for part in root.split(os.sep)):
            continue
        for name in dirs + files:
            if name in name_changes:
                old_path = os.path.join(root, name)
                new_path = os.path.join(root, name_changes[name])
                if old_path == new_path: continue

                if os.path.exists(new_path) and os.path.isdir(old_path):
                    print(f"Merge: {name} -> {name_changes[name]}")
                    for item in os.listdir(old_path):
                        s = os.path.join(old_path, item)
                        d = os.path.join(new_path, item)
                        if os.path.exists(d):
                            ext = os.path.splitext(d)[1]
                            d = d.replace(ext, f"_dup{ext}")
                        shutil.move(s, d)
                    os.rmdir(old_path)
                else:
                    print(f"Rename: {name} -> {name_changes[name]}")
                    os.rename(old_path, new_path)

    # 3. Refactorización de Enlaces (MODO SEGURO \g<1>)
    print("--- Refactorizando Enlaces (v3) ---")
    for root, dirs, files in os.walk(VAULT_ROOT):
        if any(part.startswith('.') for part in root.split(os.sep)):
            continue
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception: continue
                
                new_content = content
                # Ordenamos los cambios por longitud descendente para no pisar nombres cortos dentro de largos
                sorted_changes = sorted(name_changes.items(), key=lambda x: len(x[0]), reverse=True)
                
                for old, new in sorted_changes:
                    if old == new: continue
                    old_esc = re.escape(old)
                    # Usamos \g<1> para evitar el error de referencia de grupo con números
                    pattern = rf'(\[\[|/){old_esc}(\||\s*\]\]|/)'
                    replacement = rf'\g<1>{new}\g<2>'
                    new_content = re.sub(pattern, replacement, new_content)
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated links in: {file}")

if __name__ == "__main__":
    overhaul()
