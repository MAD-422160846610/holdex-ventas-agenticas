#!/usr/bin/env python3
"""
Script para analizar enlaces internos en el vault y detectar enlaces rotos.
Optimizado para entender la resolución de rutas de Obsidian.
"""

import os
import re
import sys
from pathlib import Path

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"

def get_vault_file_map():
    """Crea un mapa de todos los archivos del vault, incluyendo REPORTES (pero sin escanearlos después)."""
    file_map = {}
    alias_count = 0
    for root, dirs, files in os.walk(VAULT_PATH):
        if any(x in root for x in [".obsidian", ".git", "node_modules"]):
            continue
        # Indexamos todo, incluyendo REPORTES
        for file in files:
            name, ext = os.path.splitext(file)
            full_path = os.path.join(root, file)
            full_rel_path = os.path.relpath(full_path, VAULT_PATH)
            
            # Mapear nombre base
            file_map[file.lower()] = full_rel_path
            if ext == '.md':
                file_map[name.lower()] = full_rel_path
                
                # Intentar leer aliases del frontmatter de forma rápida
                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        line1 = f.readline()
                        if line1.strip() == '---':
                            fm_content = ""
                            line = f.readline()
                            while line and line.strip() != '---':
                                fm_content += line
                                line = f.readline()
                            
                            # Buscar patrón aliases: [a, b] o lista yaml
                            # Esto es una aproximación simple
                            alias_match = re.search(r'aliases:\s*\[(.*?)\]', fm_content)
                            if alias_match:
                                aliases = [a.strip().strip("'").strip('"') for a in alias_match.group(1).split(',')]
                                for alias in aliases:
                                    file_map[alias.lower()] = full_rel_path
                                    alias_count += 1
                except:
                    pass
    print(f"   (Mapa de archivos cargado con {len(file_map)} entradas y {alias_count} aliases)")
    return file_map

def find_broken_links():
    """Busca enlaces internos rotos en todas las notas."""
    file_map = get_vault_file_map()
    broken_links = []
    all_links = []
    
    # Patrón para enlaces wikilink [[enlace]] o [[enlace|texto]]
    wikilink_pattern = r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]'
    
    for root, dirs, files in os.walk(VAULT_PATH):
        if any(x in root for x in [".obsidian", ".git", "node_modules", "REPORTES"]):
            continue
        
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, VAULT_PATH)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Pre-procesamiento: Enmascarar bloques de código para no detectar links falsos
                        # (usamos espacios para mantener las posiciones de los caracteres intactas)
                        def mask_code(match):
                            return " " * len(match.group(0))
                        
                        clean_content = re.sub(r'```.*?```', mask_code, content, flags=re.DOTALL)
                        clean_content = re.sub(r'`[^`]+`', mask_code, clean_content)
                except:
                    continue
                
                matches = re.finditer(wikilink_pattern, clean_content)
                for match in matches:
                    link_target = match.group(1).strip()
                    
                    if '#' in link_target:
                        # Por ahora ignoramos anclas de sección, pero limpiamos el target
                        link_target = link_target.split('#')[0].strip()
                        if not link_target: continue

                    all_links.append((relative_path, link_target, match.start()))
                    
                    # Verificación contra el mapa global (case-insensitive)
                    target_key = link_target.lower()
                    
                    # 1. ¿Existe el nombre exacto/base en el vault?
                    if target_key in file_map:
                        continue
                    
                    # 2. ¿Tiene una extensión y existe? (ej. .png)
                    exists_as_is = False
                    for ext in ['.md', '.png', '.jpg', '.jpeg', '.gif', '.pdf', '.canvas']:
                        if (target_key + ext) in file_map:
                            exists_as_is = True
                            break
                    
                    if exists_as_is:
                        continue
                        
                    # 3. ¿Es una ruta relativa real?
                    potential_path = os.path.join(os.path.dirname(file_path), link_target)
                    if os.path.exists(potential_path):
                        continue
                        
                    broken_links.append({
                        'file': relative_path,
                        'link': link_target,
                        'line_number': content[:match.start()].count('\n') + 1,
                        'context': content[max(0, match.start()-50):match.end()+50]
                    })
    
    return broken_links, len(all_links)

def generate_report(broken_links, total_links):
    """Genera un reporte de enlaces rotos con frontmatter para evitar auto-enlaces rotos."""
    report = "---\naliases: ['enlaces-rotos']\n---\n"
    report += f"# 📊 Reporte de Enlaces Internos\n\n"
    report += f"**Total enlaces analizados:** {total_links}\n"
    report += f"**Enlaces rotos encontrados:** {len(broken_links)}\n\n"
    
    if broken_links:
        report += "## 🔗 Enlaces Rotos\n\n"
        # Limitar a los primeros 500 para el reporte para no saturar Markdown
        for i, broken in enumerate(broken_links[:500], 1):
            report += f"### {i}. Enlace roto en `{broken['file']}`\n"
            report += f"- **Enlace:** `{broken['link']}`\n"
            report += f"- **Línea:** {broken['line_number']}\n"
            report += f"- **Contexto:** `{broken['context'].strip()}`\n\n"
        if len(broken_links) > 500:
            report += f"\n*...y {len(broken_links) - 500} enlaces más truncados.*\n"
    else:
        report += "✅ **¡Todos los enlaces están funcionando!**\n\n"
    
    report += "## 📈 Estadísticas\n"
    if total_links > 0:
        success_rate = ((total_links - len(broken_links)) / total_links) * 100
        report += f"- **Tasa de éxito:** {success_rate:.1f}%\n"
        report += f"- **Enlaces funcionales:** {total_links - len(broken_links)}\n"
        report += f"- **Enlaces rotos:** {len(broken_links)}\n"
    
    return report

def main():
    """Función principal."""
    print("🔍 Analizando enlaces internos (Obsidian Style)...")
    broken_links, total_links = find_broken_links()
    
    print(f"\n📊 Resultados:")
    print(f"   Total enlaces analizados: {total_links}")
    print(f"   Enlaces rotos encontrados: {len(broken_links)}")
    
    report = generate_report(broken_links, total_links)
    report_path = os.path.join(VAULT_PATH, "REPORTES", "enlaces-rotos.md")
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"\n📄 Reporte generado: {os.path.relpath(report_path, VAULT_PATH)}")

if __name__ == "__main__":
    main()


if __name__ == "__main__":
    main()