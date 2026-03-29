#!/usr/bin/env python3
"""
Script para analizar enlaces internos en el vault y detectar enlaces rotos.
"""

import os
import re
import sys
from pathlib import Path

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"

def find_broken_links():
    """Busca enlaces internos rotos en todas las notas."""
    broken_links = []
    all_links = []
    
    # Patrón para enlaces wikilink [[enlace]] o [[enlace|texto]]
    wikilink_pattern = r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]'
    
    for root, dirs, files in os.walk(VAULT_PATH):
        # Ignorar directorio .obsidian
        if ".obsidian" in root:
            continue
        
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, VAULT_PATH)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except:
                    continue
                
                # Buscar todos los enlaces wikilink
                matches = re.finditer(wikilink_pattern, content)
                for match in matches:
                    link_target = match.group(1).strip()
                    
                    # Ignorar enlaces a secciones (contienen #)
                    if '#' in link_target:
                        continue
                    
                    # Verificar si el enlace es a un archivo existente
                    link_exists = False
                    
                    # Posibles extensiones
                    extensions = ['.md', '.png', '.jpg', '.jpeg', '.gif', '.pdf', '.canvas']
                    
                    for ext in extensions:
                        potential_path = os.path.join(VAULT_PATH, link_target + ext)
                        if os.path.exists(potential_path):
                            link_exists = True
                            break
                    
                    # También verificar si es un directorio
                    potential_dir = os.path.join(VAULT_PATH, link_target)
                    if os.path.exists(potential_dir) and os.path.isdir(potential_dir):
                        link_exists = True
                    
                    all_links.append((relative_path, link_target, match.start()))
                    
                    if not link_exists:
                        broken_links.append({
                            'file': relative_path,
                            'link': link_target,
                            'line_number': content[:match.start()].count('\n') + 1,
                            'context': content[max(0, match.start()-50):match.end()+50]
                        })
    
    return broken_links, len(all_links)

def generate_report(broken_links, total_links):
    """Genera un reporte de enlaces rotos."""
    report = f"# 📊 Reporte de Enlaces Internos\n\n"
    report += f"**Total enlaces analizados:** {total_links}\n"
    report += f"**Enlaces rotos encontrados:** {len(broken_links)}\n\n"
    
    if broken_links:
        report += "## 🔗 Enlaces Rotos\n\n"
        for i, broken in enumerate(broken_links, 1):
            report += f"### {i}. Enlace roto en `{broken['file']}`\n"
            report += f"- **Enlace:** `{broken['link']}`\n"
            report += f"- **Línea:** {broken['line_number']}\n"
            report += f"- **Contexto:** `{broken['context'].strip()}`\n\n"
    else:
        report += "✅ **¡Todos los enlaces están funcionando!**\n\n"
    
    # Estadísticas
    report += "## 📈 Estadísticas\n"
    if total_links > 0:
        success_rate = ((total_links - len(broken_links)) / total_links) * 100
        report += f"- **Tasa de éxito:** {success_rate:.1f}%\n"
        report += f"- **Enlaces funcionales:** {total_links - len(broken_links)}\n"
        report += f"- **Enlaces rotos:** {len(broken_links)}\n"
    
    return report

def main():
    """Función principal."""
    print("🔍 Analizando enlaces internos del vault...")
    
    broken_links, total_links = find_broken_links()
    
    print(f"\n📊 Resultados:")
    print(f"   Total enlaces analizados: {total_links}")
    print(f"   Enlaces rotos encontrados: {len(broken_links)}")
    
    if broken_links:
        print("\n🔗 Enlaces rotos detectados:")
        for broken in broken_links:
            print(f"   - {broken['file']} → {broken['link']} (línea {broken['line_number']})")
        
        # Generar reporte
        report = generate_report(broken_links, total_links)
        report_path = os.path.join(VAULT_PATH, "REPORTES", "enlaces-rotos.md")
        
        # Crear directorio de reportes si no existe
        os.makedirs(os.path.dirname(report_path), exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n📄 Reporte generado: {os.path.relpath(report_path, VAULT_PATH)}")
    else:
        print("\n✅ ¡Todos los enlaces están funcionando!")

if __name__ == "__main__":
    main()