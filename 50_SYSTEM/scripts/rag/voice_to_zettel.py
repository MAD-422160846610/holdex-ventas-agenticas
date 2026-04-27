#!/usr/bin/env python3
"""
Pipeline Voz-a-Zettelkasten - Obsidian 3.1
Transcribe audio y crea notas Zettelkasten automáticamente.
"""

import os
import re
import json
import argparse
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import subprocess

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
NOTES_FOLDER = os.path.join(VAULT_PATH, "200 - 🌍 MEMORIA DIGITAL")


def install_whisper():
    """Instala Whisper si no está disponible."""
    print("📦 Instalando faster-whisper...")
    try:
        subprocess.run(["pip", "install", "faster-whisper"], check=True)
        return True
    except Exception as e:
        print(f"❌ Error instalando: {e}")
        return False


def transcribe_audio(audio_path: str, model_size: str = "base") -> str:
    """Transcribe audio usando Whisper."""
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        if not install_whisper():
            return None
        from faster_whisper import WhisperModel
    
    print(f"🎤 Transcribiendo {audio_path}...")
    
    # Usar modelo más pequeño para velocidad
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    
    segments, info = model.transcribe(audio_path)
    
    text = ""
    for segment in segments:
        text += segment.text + " "
    
    print(f"✅ Transcripción completada ({info.language})")
    return text.strip()


def extract_keywords(text: str) -> List[str]:
    """Extrae keywords del texto."""
    # Palabras comunes a ignorar
    stopwords = {
        "el", "la", "los", "las", "un", "una", "unos", "unas",
        "de", "del", "al", "en", "por", "para", "con", "sin",
        "y", "o", "pero", "porque", "que", "cual", "como",
        "este", "esta", "estos", "estas", "ese", "esa", "esos", "esas",
        "yo", "tu", "el", "ella", "nosotros", "ellos",
        "ser", "estar", "tener", "hacer", "poder", "decir",
        "es", "son", "fue", "eran", "hay", "habia"
    }
    
    # Limpiar y tokenizar
    words = re.findall(r'\b[a-záéíóúñ]+\b', text.lower())
    
    # Filtrar stopwords y palabras cortas
    keywords = [w for w in words if w not in stopwords and len(w) > 3]
    
    # Contar frecuencia
    freq = {}
    for w in keywords:
        freq[w] = freq.get(w, 0) + 1
    
    # Ordenar por frecuencia
    sorted_keywords = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    
    return [w for w, _ in sorted_keywords[:10]]


def generate_title(text: str, max_words: int = 6) -> str:
    """Genera un título para la nota."""
    # Tomar las primeras palabras significativas
    words = text.split()
    title_words = []
    
    for word in words:
        if len(word) > 3 and not word.endswith(('.', ',', '!', '?')):
            title_words.append(word)
            if len(title_words) >= max_words:
                break
    
    title = ' '.join(title_words)
    
    # Capitalizar primera letra de cada palabra
    title = title.title()
    
    return title


def find_related_notes(text: str, max_results: int = 3) -> List[dict]:
    """Busca notas relacionadas en el vault."""
    keywords = extract_keywords(text)
    
    if not keywords:
        return []
    
    # Buscar en notas existentes
    results = []
    
    for root, _, files in os.walk(VAULT_PATH):
        if ".obsidian" in root or "node_modules" in root:
            continue
            
        for f in files:
            if not f.lower().endswith(".md"):
                continue
            
            path = os.path.join(root, f)
            
            try:
                with open(path, "r", encoding="utf-8") as file:
                    content = file.read()
            except Exception:
                continue
            
            # Buscar coincidencias de keywords
            content_lower = content.lower()
            matches = sum(1 for kw in keywords[:5] if kw in content_lower)
            
            if matches > 0:
                title = Path(path).stem
                results.append({
                    "title": title,
                    "path": path,
                    "matches": matches
                })
    
    # Ordenar por matches
    results.sort(key=lambda x: x["matches"], reverse=True)
    
    return results[:max_results]


def create_zettel(text: str, audio_file: str = None, auto_link: bool = True) -> str:
    """Crea una nota Zettelkasten desde el texto."""
    
    # Generar ID único
    zettel_id = datetime.now().strftime("%Y%m%d%H%M%S")
    
    # Generar título
    title = generate_title(text)
    
    # Extraer keywords para tags
    keywords = extract_keywords(text)
    
    # Buscar notas relacionadas
    related = find_related_notes(text) if auto_link else []
    
    # Construir contenido
    content_lines = []
    
    # Frontmatter
    content_lines.append("---")
    content_lines.append(f"tags: ['#zk/permanent', '#voz', '{datetime.now().strftime('%Y-%m-%d')}']")
    content_lines.append(f"created: {datetime.now().strftime('%Y-%m-%d')}")
    content_lines.append(f"source: voz-a-zettel")
    if audio_file:
        content_lines.append(f"audio_file: {os.path.basename(audio_file)}")
    content_lines.append("---")
    content_lines.append("")
    
    # Título
    content_lines.append(f"# {title}")
    content_lines.append("")
    
    # Metadata
    content_lines.append(f"> **Fecha:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    if keywords:
        content_lines.append(f"> **Keywords:** {', '.join(['#' + k for k in keywords[:5]])}")
    content_lines.append("")
    
    # Contenido principal
    content_lines.append("## Contenido")
    content_lines.append("")
    content_lines.append(text)
    content_lines.append("")
    
    # Notas relacionadas
    if related:
        content_lines.append("## Notas Relacionadas")
        content_lines.append("")
        for note in related:
            content_lines.append(f"- [[{note['title']}]]")
        content_lines.append("")
    
    # Links entrantes potenciales (donde enlazar esta nota)
    content_lines.append("## Coming From")
    content_lines.append("- [[]]")
    content_lines.append("")
    
    # Guardar archivo
    # Limpiar título para filename
    filename_title = re.sub(r'[^\w\s-]', '', title)
    filename_title = re.sub(r'\s+', '-', filename_title).lower()
    
    filename = f"{zettel_id} {filename_title}.md"
    filepath = os.path.join(NOTES_FOLDER, filename)
    
    # Crear carpeta si no existe
    os.makedirs(NOTES_FOLDER, exist_ok=True)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write('\n'.join(content_lines))
    
    print(f"✅ Zettel creado: {filename}")
    
    # Ahora, agregar enlace desde notas relacionadas
    if auto_link and related:
        print("🔗 Agregando enlaces desde notas relacionadas...")
        for note in related:
            try:
                with open(note["path"], "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Agregar enlace al final
                link_text = f"\n- [[{zettel_id} {filename_title}]]\n"
                
                # Buscar sección "Notas Relacionadas" o "Coming From"
                if "## Notas Relacionadas" in content:
                    content = content.replace(
                        "## Notas Relacionadas\n",
                        f"## Notas Relacionadas\n{link_text}"
                    )
                elif "## Coming From" in content:
                    content = content.replace(
                        "## Coming From\n",
                        f"## Coming From\n{link_text}"
                    )
                else:
                    content += f"\n\n## Notas Relacionadas\n{link_text}"
                
                with open(note["path"], "w", encoding="utf-8") as f:
                    f.write(content)
                    
                print(f"  ✅ Enlazado desde: {Path(note['path']).stem}")
            except Exception as e:
                print(f"  ❌ Error enlazando: {e}")
    
    return filepath


def process_audio_file(audio_path: str, model: str = "base"):
    """Procesa un archivo de audio."""
    if not os.path.exists(audio_path):
        print(f"❌ Archivo no encontrado: {audio_path}")
        return None
    
    # Transcribir
    text = transcribe_audio(audio_path, model)
    
    if not text:
        print("❌ Error en transcripción")
        return None
    
    print(f"📝 Texto transcrito ({len(text)} caracteres)")
    print(f"   Preview: {text[:200]}...")
    
    # Crear Zettel
    filepath = create_zettel(text, audio_path)
    
    return filepath


def process_text_direct(text: str):
    """Procesa texto directo (sin audio)."""
    if not text.strip():
        print("❌ Texto vacío")
        return None
    
    print(f"📝 Procesando texto ({len(text)} caracteres)")
    
    # Crear Zettel
    filepath = create_zettel(text)
    
    return filepath


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Voz-a-Zettelkasten Pipeline")
    parser.add_argument("input", nargs="?", help="Archivo de audio o texto directo")
    parser.add_argument("--model", default="base", choices=["tiny", "base", "small", "medium", "large"],
                       help="Modelo de Whisper a usar")
    parser.add_argument("--text", action="store_true", help="El input es texto plano, no archivo de audio")
    parser.add_argument("--no-links", action="store_true", help="No buscar notas relacionadas para enlazar")
    
    args = parser.parse_args()
    
    if not args.input:
        print("Usage:")
        print("  python voice_to_zettel.py audio.mp3")
        print("  python voice_to_zettel.py \"mi idea sobre...\" --text")
        exit(1)
    
    if args.text:
        process_text_direct(args.input)
    else:
        process_audio_file(args.input, args.model)
