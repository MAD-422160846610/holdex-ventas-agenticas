#!/usr/bin/env python3
"""
Script para analizar métricas de productividad del vault.
Genera estadísticas sobre notas, proyectos, tareas y actividad.
"""

import os
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"

def get_file_stats():
    """Obtiene estadísticas básicas de archivos."""
    stats = {
        'total_notes': 0,
        'notes_with_frontmatter': 0,
        'notes_without_frontmatter': 0,
        'by_folder': defaultdict(int),
        'by_extension': defaultdict(int),
        'largest_notes': [],
        'newest_notes': [],
        'oldest_notes': []
    }
    
    notes_info = []
    
    for root, dirs, files in os.walk(VAULT_PATH):
        # Ignorar directorio .obsidian
        if ".obsidian" in root:
            continue
        
        rel_root = os.path.relpath(root, VAULT_PATH)
        
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                stats['total_notes'] += 1
                
                # Carpeta
                folder = rel_root if rel_root != '.' else 'raíz'
                stats['by_folder'][folder] += 1
                
                # Verificar frontmatter
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        first_line = f.readline().strip()
                        if first_line == '---':
                            stats['notes_with_frontmatter'] += 1
                        else:
                            stats['notes_without_frontmatter'] += 1
                except:
                    stats['notes_without_frontmatter'] += 1
                
                # Obtener info del archivo
                try:
                    stat = os.stat(file_path)
                    size = stat.st_size
                    mtime = datetime.fromtimestamp(stat.st_mtime)
                    
                    notes_info.append({
                        'path': file_path,
                        'name': file,
                        'folder': folder,
                        'size': size,
                        'mtime': mtime
                    })
                except:
                    pass
    
    # Ordenar notas por tamaño
    if notes_info:
        stats['largest_notes'] = sorted(notes_info, key=lambda x: x['size'], reverse=True)[:5]
        stats['newest_notes'] = sorted(notes_info, key=lambda x: x['mtime'], reverse=True)[:5]
        stats['oldest_notes'] = sorted(notes_info, key=lambda x: x['mtime'])[:5]
    
    return stats

def analyze_tags():
    """Analiza uso de tags en el vault."""
    tag_counts = defaultdict(int)
    tag_notes = defaultdict(list)
    
    tag_pattern = r'#([\w/-]+)'
    
    for root, dirs, files in os.walk(VAULT_PATH):
        if ".obsidian" in root:
            continue
        
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, VAULT_PATH)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Buscar tags
                        tags = re.findall(tag_pattern, content)
                        for tag in tags:
                            tag_counts[tag] += 1
                            tag_notes[tag].append(rel_path)
                except:
                    pass
    
    return dict(tag_counts), dict(tag_notes)

def analyze_tasks():
    """Analiza tareas en el vault."""
    task_stats = {
        'total_tasks': 0,
        'completed_tasks': 0,
        'pending_tasks': 0,
        'tasks_by_note': defaultdict(int),
        'oldest_pending': []
    }
    
    pending_tasks = []
    
    for root, dirs, files in os.walk(VAULT_PATH):
        if ".obsidian" in root:
            continue
        
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, VAULT_PATH)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        
                        for i, line in enumerate(lines):
                            line = line.strip()
                            
                            # Detectar tareas
                            if re.match(r'^-\s+\[[ x]\]\s+', line):
                                task_stats['total_tasks'] += 1
                                task_stats['tasks_by_note'][rel_path] += 1
                                
                                if '[x]' in line or '[X]' in line:
                                    task_stats['completed_tasks'] += 1
                                else:
                                    task_stats['pending_tasks'] += 1
                                    pending_tasks.append({
                                        'note': rel_path,
                                        'line': i+1,
                                        'text': line[7:].strip(),  # Remover "- [ ] "
                                        'file_mtime': os.path.getmtime(file_path)
                                    })
                except:
                    pass
    
    # Ordenar tareas pendientes por antigüedad
    if pending_tasks:
        task_stats['oldest_pending'] = sorted(pending_tasks, key=lambda x: x['file_mtime'])[:10]
    
    return task_stats

def analyze_links():
    """Analiza conectividad del vault."""
    link_stats = {
        'total_internal_links': 0,
        'notes_with_most_links': [],
        'notes_with_most_backlinks': defaultdict(int),
        'orphan_notes': []
    }
    
    for root, dirs, files in os.walk(VAULT_PATH):
        if ".obsidian" in root:
            continue
        
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, VAULT_PATH)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Buscar enlaces internos
                        wikilinks = re.findall(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]', content)
                        link_stats['total_internal_links'] += len(wikilinks)
                        
                        # Contar enlaces entrantes (backlinks)
                        for link in wikilinks:
                            link_target = link.strip()
                            link_stats['notes_with_most_backlinks'][link_target] += 1
                except:
                    pass
    
    # Encontrar notas con más backlinks
    if link_stats['notes_with_most_backlinks']:
        sorted_backlinks = sorted(link_stats['notes_with_most_backlinks'].items(), 
                                 key=lambda x: x[1], reverse=True)[:10]
        link_stats['notes_with_most_links'] = sorted_backlinks
    
    return link_stats

def generate_report():
    """Genera reporte completo de productividad."""
    print("📊 Analizando productividad del vault...")
    
    # Recopilar datos
    file_stats = get_file_stats()
    tag_counts, tag_notes = analyze_tags()
    task_stats = analyze_tasks()
    link_stats = analyze_links()
    
    # Generar reporte
    report = f"""# 📊 Reporte de Productividad - Obsidian 3.1
**Generado:** {datetime.now().strftime("%Y-%m-%d %H:%M")}

## 📈 Estadísticas Generales
- **Total de notas:** {file_stats['total_notes']}
- **Notas con frontmatter:** {file_stats['notes_with_frontmatter']} ({file_stats['notes_with_frontmatter']/max(1, file_stats['total_notes'])*100:.1f}%)
- **Notas sin frontmatter:** {file_stats['notes_without_frontmatter']}
- **Tasa de organización:** {(file_stats['notes_with_frontmatter']/max(1, file_stats['total_notes']))*100:.1f}%

## 📁 Distribución por Carpetas
"""
    
    # Top 10 carpetas
    sorted_folders = sorted(file_stats['by_folder'].items(), key=lambda x: x[1], reverse=True)[:10]
    for folder, count in sorted_folders:
        report += f"- **{folder}:** {count} notas\n"
    
    report += f"""
## 🏷️ Tags Más Usados (Top 15)
"""
    
    sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:15]
    for tag, count in sorted_tags:
        report += f"- **#{tag}:** {count} usos\n"
    
    report += f"""
## 📝 Tareas
- **Total tareas:** {task_stats['total_tasks']}
- **Tareas completadas:** {task_stats['completed_tasks']} ({task_stats['completed_tasks']/max(1, task_stats['total_tasks'])*100:.1f}%)
- **Tareas pendientes:** {task_stats['pending_tasks']}

## 🔗 Conectividad
- **Total enlaces internos:** {link_stats['total_internal_links']}
- **Promedio enlaces por nota:** {link_stats['total_internal_links']/max(1, file_stats['total_notes']):.1f}
"""
    
    if link_stats['notes_with_most_links']:
        report += "\n### 📌 Notas con Más Backlinks\n"
        for note, count in link_stats['notes_with_most_links'][:5]:
            report += f"- **{note}:** {count} backlinks\n"
    
    report += f"""
## 🏆 Logros del Sistema
"""
    
    # Calcular "logros"
    achievements = []
    
    if file_stats['notes_with_frontmatter'] > 100:
        achievements.append("✅ Más de 100 notas organizadas con frontmatter")
    
    if len(tag_counts) > 20:
        achievements.append("✅ Sistema de tags bien desarrollado")
    
    if task_stats['completed_tasks'] > 50:
        achievements.append("✅ Más de 50 tareas completadas")
    
    if link_stats['total_internal_links'] > 200:
        achievements.append("✅ Más de 200 enlaces internos (conocimiento conectado)")
    
    if file_stats['total_notes'] > 300:
        achievements.append("✅ Más de 300 notas en el vault")
    
    if not achievements:
        achievements.append("🔄 ¡Sigue construyendo tu segundo cerebro!")
    
    for achievement in achievements:
        report += f"- {achievement}\n"
    
    report += f"""
## 🎯 Recomendaciones
1. **{max(0, file_stats['notes_without_frontmatter'])} notas sin frontmatter** → Ejecutar `auto_frontmatter.py`
2. **{task_stats['pending_tasks']} tareas pendientes** → Revisar y priorizar
3. **Promedio de enlaces:** {link_stats['total_internal_links']/max(1, file_stats['total_notes']):.1f} → Objetivo: >2.0
4. **Sistema de tags:** {len(tag_counts)} tags únicos → Objetivo: >30 tags especializados

---
*Reporte generado automáticamente por Obsidian 3.1 Productivity Stats*
"""
    
    return report

def main():
    """Función principal."""
    report = generate_report()
    
    # Guardar reporte
    report_dir = os.path.join(VAULT_PATH, "REPORTES")
    os.makedirs(report_dir, exist_ok=True)
    
    report_file = os.path.join(report_dir, "productividad.md")
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"✅ Reporte generado: {os.path.relpath(report_file, VAULT_PATH)}")
    print("\n📊 Resumen rápido:")
    
    # Mostrar estadísticas rápidas
    file_stats = get_file_stats()
    tag_counts, _ = analyze_tags()
    task_stats = analyze_tasks()
    
    print(f"   • Notas: {file_stats['total_notes']}")
    print(f"   • Organizadas: {file_stats['notes_with_frontmatter']} ({file_stats['notes_with_frontmatter']/max(1, file_stats['total_notes'])*100:.1f}%)")
    print(f"   • Tags únicos: {len(tag_counts)}")
    print(f"   • Tareas pendientes: {task_stats['pending_tasks']}")

if __name__ == "__main__":
    main()