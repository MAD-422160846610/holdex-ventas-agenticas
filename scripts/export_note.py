#!/usr/bin/env python3
"""
Script para exportar notas de Obsidian a HTML.
Convierte Markdown a HTML con CSS personalizado.
"""

import os
import re
import sys
from datetime import datetime
from pathlib import Path

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
CSS_PATH = os.path.join(VAULT_PATH, "scripts", "templates", "export.css")

def markdown_to_html_simple(markdown_text):
    """Conversión simple de Markdown a HTML (sin dependencias externas)."""
    html = markdown_text
    
    # Escapar HTML básico
    html = html.replace('&', '&amp;')
    html = html.replace('<', '&lt;')
    html = html.replace('>', '&gt;')
    
    # Encabezados
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Negrita y cursiva
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    
    # Enlaces
    html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', html)
    
    # Enlaces wikilink (conversión simple)
    html = re.sub(r'\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]', r'<a href="#" class="internal-link">\1</a>', html)
    
    # Listas
    html = re.sub(r'^- (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'(<li>.*?</li>)', r'<ul>\1</ul>', html)
    
    # Tareas
    html = re.sub(r'^- \[ \] (.+)$', r'<li class="task-list-item"><input type="checkbox" disabled> \1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'^- \[x\] (.+)$', r'<li class="task-list-item"><input type="checkbox" checked disabled> \1</li>', html, flags=re.MULTILINE)
    
    # Código
    html = re.sub(r'`([^`]+?)`', r'<code>\1</code>', html)
    html = re.sub(r'^    (.+)$', r'<pre><code>\1</code></pre>', html, flags=re.MULTILINE)
    
    # Párrafos (doble salto de línea)
    html = re.sub(r'\n\n+', r'</p><p>', html)
    html = f'<p>{html}</p>'
    
    # Limpiar párrafos vacíos
    html = html.replace('<p></p>', '')
    
    return html

def extract_frontmatter(content):
    """Extrae frontmatter YAML del contenido."""
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            body = parts[2]
            
            # Parsear frontmatter simple
            metadata = {}
            for line in frontmatter.strip().split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    metadata[key.strip()] = value.strip()
            
            return metadata, body
    
    return {}, content

def generate_html_page(title, body_html, metadata, css_content):
    """Genera página HTML completa."""
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Obsidian 3.1 Export</title>
    <style>
{css_content}
    </style>
</head>
<body>
    <header>
        <h1>{title}</h1>
        <div class="metadata">
            <p><strong>Exportado:</strong> {date_str}</p>
            <p><strong>Origen:</strong> GlitchBrain Vault - Obsidian 3.1</p>
        </div>
    </header>
    
    <main>
        {body_html}
    </main>
    
    <footer class="footnote">
        <p>Exportado automáticamente desde el vault GlitchBrain usando Obsidian 3.1</p>
        <p>Sistema de tags: #para/p/nombre, #zk/permanent | Estructura: PARA + Zettelkasten</p>
    </footer>
</body>
</html>"""
    
    return html

def export_note(note_path, output_dir=None):
    """Exporta una nota a HTML."""
    if not os.path.exists(note_path):
        print(f"❌ Nota no encontrada: {note_path}")
        return False
    
    # Leer nota
    try:
        with open(note_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error leyendo nota: {e}")
        return False
    
    # Extraer frontmatter y cuerpo
    metadata, body = extract_frontmatter(content)
    
    # Convertir cuerpo a HTML
    body_html = markdown_to_html_simple(body)
    
    # Obtener título
    title = metadata.get('title', Path(note_path).stem)
    
    # Leer CSS
    try:
        with open(CSS_PATH, 'r', encoding='utf-8') as f:
            css_content = f.read()
    except:
        css_content = "body { font-family: sans-serif; }"
    
    # Generar HTML completo
    html_content = generate_html_page(title, body_html, metadata, css_content)
    
    # Determinar directorio de salida
    if not output_dir:
        output_dir = os.path.join(VAULT_PATH, "EXPORTACIONES")
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Nombre del archivo de salida
    output_file = os.path.join(output_dir, f"{Path(note_path).stem}.html")
    
    # Escribir archivo HTML
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"✅ Nota exportada: {os.path.relpath(output_file, VAULT_PATH)}")
        return True
    except Exception as e:
        print(f"❌ Error escribiendo archivo: {e}")
        return False

def main():
    """Función principal."""
    if len(sys.argv) < 2:
        print("Uso: python3 export_note.py <ruta_nota.md> [directorio_salida]")
        print("Ejemplo: python3 export_note.py '100 - ✅ PROYECTOS/presupuesto-oficina-itb.md'")
        return
    
    note_path = sys.argv[1]
    
    # Si la ruta es relativa, hacerla absoluta desde el vault
    if not os.path.isabs(note_path):
        note_path = os.path.join(VAULT_PATH, note_path)
    
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None
    
    print(f"📄 Exportando nota: {os.path.basename(note_path)}")
    export_note(note_path, output_dir)

if __name__ == "__main__":
    main()