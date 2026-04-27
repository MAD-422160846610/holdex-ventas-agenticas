#!/usr/bin/env python3
"""
Re-indexing script para RAG - Actualiza el índice cuando hay nuevas notas.
Uso: python reindex.py [--force]

Opcional: Agregar a crontab para ejecución automática:
*/30 * * * * cd /home/arrigobaggio/Obsidian/GlitchBrain && python3 scripts/rag/reindex.py >> /tmp/rag_reindex.log 2>&1
"""

import os
import sys
import json
import hashlib
from pathlib import Path
from datetime import datetime

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
INDEX_DIR = os.path.join(VAULT_PATH, "rag_index")
PATHS_FILE = os.path.join(INDEX_DIR, "paths.json")
DOCS_INDEX_FILE = os.path.join(INDEX_DIR, "docs.json")
HASH_FILE = os.path.join(INDEX_DIR, "note_hashes.json")


def get_note_hash(path: str) -> str:
    """Genera hash del contenido actual de la nota."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        return hashlib.md5(content.encode()).hexdigest()
    except Exception:
        return ""


def collect_note_paths() -> list:
    """Recolecta todos los paths de notas .md en el vault."""
    paths = []
    for root, _, files in os.walk(VAULT_PATH):
        if ".obsidian" in root or "node_modules" in root:
            continue
        for f in files:
            if f.lower().endswith(".md"):
                paths.append(os.path.join(root, f))
    return paths


def load_note_hashes() -> dict:
    """Carga el diccionario de hashes anterior."""
    if not Path(HASH_FILE).exists():
        return {}
    try:
        with open(HASH_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_note_hashes(hashes: dict):
    """Guarda el diccionario de hashes."""
    os.makedirs(INDEX_DIR, exist_ok=True)
    with open(HASH_FILE, "w", encoding="utf-8") as f:
        json.dump(hashes, f, indent=2)


def check_for_changes() -> dict:
    """
    Verifica qué notas cambiaron.
    Returns: {
        'added': [paths],
        'modified': [paths],
        'deleted': [paths],
        'unchanged': [paths]
    }
    """
    current_hashes = {}
    old_hashes = load_note_hashes()
    
    # Collect current paths
    current_paths = set(collect_note_paths())
    old_paths = set(old_hashes.keys())
    
    # Find added
    added = list(current_paths - old_paths)
    
    # Find deleted
    deleted = list(old_paths - current_paths)
    
    # Find modified
    modified = []
    for path in current_paths & old_paths:
        new_hash = get_note_hash(path)
        current_hashes[path] = new_hash
        if new_hash != old_hashes.get(path):
            modified.append(path)
    
    # Store current hashes
    for path in current_paths:
        if path not in current_hashes:
            current_hashes[path] = get_note_hash(path)
    
    save_note_hashes(current_hashes)
    
    unchanged = list(current_paths - set(added) - set(modified))
    
    return {
        "added": added,
        "modified": modified,
        "deleted": deleted,
        "unchanged": unchanged,
        "total": len(current_paths)
    }


def rebuild_index():
    """Reconstruye el índice completo (TF-IDF + embeddings)."""
    print("🔄 Reconstruyendo índice RAG completo...")
    
    # Step 1: Build TF-IDF index
    sys.path.insert(0, os.path.join(VAULT_PATH, "scripts/rag"))
    try:
        from core import build_index
        build_index()
    except Exception as e:
        print(f"⚠️  Error build_index: {e}")
    
    # Step 2: Build embeddings (if dependencies available)
    try:
        from embeddings import build_index as build_embeddings
        build_embeddings()
    except ImportError as e:
        print(f"⚠️  Embeddings no disponibles: {e}")
        print("   Instala: pip3 install numpy sentence-transformers")
    except Exception as e:
        print(f"⚠️  Error embeddings: {e}")
    
    print("✅ Índice reconstruido")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Re-index RAG notes")
    parser.add_argument("--force", action="store_true", help="Forzar reconstrucción completa")
    parser.add_argument("--check", action="store_true", help="Solo verificar cambios sin reindexar")
    args = parser.parse_args()
    
    print(f"\n📚 RAG Re-index - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if args.force:
        rebuild_index()
        return
    
    changes = check_for_changes()
    
    print(f"📊 Notas totales: {changes['total']}")
    print(f"   - Nuevas: {len(changes['added'])}")
    print(f"   - Modificadas: {len(changes['modified'])}")
    print(f"   - Eliminadas: {len(changes['deleted'])}")
    print(f"   - Sin cambios: {len(changes['unchanged'])}")
    
    if args.check:
        if changes['added'] or changes['modified']:
            print("\n⚠️  Hay cambios detectados. Ejecuta sin --check para reindexar.")
        else:
            print("\n✅ No hay cambios. El índice está actualizado.")
        return
    
    if not changes['added'] and not changes['modified']:
        print("\n✅ Índice actualizado. No hay nada que reindexar.")
        return
    
    # Hay cambios - reindexar
    print("\n🔄 Reindexando...")
    rebuild_index()


if __name__ == "__main__":
    main()
