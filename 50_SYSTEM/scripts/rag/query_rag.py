#!/usr/bin/env python3
"""
Unified RAG Query Interface - Busca en el índice de embeddings (semántico)
y opcionalmente en TF-IDF (keyword).
Usage: python query_rag.py "tu consulta" [--top N] [--output markdown|text]
"""

import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

import numpy as np

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
INDEX_DIR = os.path.join(VAULT_PATH, "rag_index")
EMBEDDINGS_FILE = os.path.join(INDEX_DIR, "embeddings.npy")
PATHS_FILE = os.path.join(INDEX_DIR, "paths.json")
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def _read_body_from_md(path: str, max_chars: int = 2000) -> str:
    """Lee el cuerpo de un MD, truncando para no saturar."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return ""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            body = parts[2].lstrip()
            return body[:max_chars]
    return content[:max_chars]


def load_index():
    """Carga el índice de embeddings."""
    if not Path(EMBEDDINGS_FILE).exists():
        print("[ERROR] Embeddings no encontrados. Ejecuta: python scripts/rag/embeddings.py build")
        return None, None
    embeddings = np.load(EMBEDDINGS_FILE)
    with open(PATHS_FILE, "r", encoding="utf-8") as f:
        paths = json.load(f)
    return embeddings, paths


def query_semantic(query: str, top_k: int = 5):
    """Búsqueda semántica por embeddings."""
    embeddings, paths = load_index()
    if embeddings is None:
        return []
    
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer(MODEL_NAME, device="cpu")
    qvec = model.encode([query], batch_size=1)[0]
    
    from numpy.linalg import norm
    sims = embeddings @ qvec / (norm(embeddings, axis=1) * norm(qvec) + 1e-9)
    top_indices = sims.argsort()[::-1][:top_k]
    
    results = []
    for i in top_indices:
        path = paths[i]
        title = Path(path).stem
        # Convertir path absoluto a path relativo del vault
        rel_path = path.replace(VAULT_PATH + "/", "")
        score = float(sims[i])
        # Obtener snippet del contenido
        body = _read_body_from_md(path, 300)
        snippet = body.replace("\n", " ")[:150] + "..." if len(body) > 150 else body
        results.append({
            "path": path,
            "rel_path": rel_path,
            "title": title,
            "score": score,
            "snippet": snippet
        })
    return results


def format_markdown(results, query: str):
    """Formatea resultados como markdown para incrustar en Obsidian."""
    output = []
    output.append(f"## 🔍 Resultados para: \"{query}\"")
    output.append(f"*(generado: {datetime.now().strftime('%Y-%m-%d %H:%M')})*\n")
    
    if not results:
        output.append("*No se encontraron resultados.*")
        return "\n".join(output)
    
    for i, r in enumerate(results, 1):
        output.append(f"### {i}. [[{r['title']}]]")
        output.append(f"**Score:** {r['score']:.3f} | **Path:** `{r['rel_path']}`")
        output.append(f"> {r['snippet']}")
        output.append("")
    
    output.append("---")
    output.append("*Usa `python scripts/rag/query_rag.py \"tu búsqueda\"` para nueva consulta*")
    return "\n".join(output)


def format_text(results):
    """Formato plano para CLI."""
    if not results:
        print("No se encontraron resultados.")
        return
    for r in results:
        print(f"\n[{r['score']:.3f}] {r['title']}")
        print(f"  -> {r['path']}")
        print(f"  {r['snippet']}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RAG Query Interface")
    parser.add_argument("query", nargs="?", default="", help="Texto de búsqueda")
    parser.add_argument("--top", type=int, default=5, help="Número de resultados")
    parser.add_argument("--output", choices=["text", "markdown"], default="text", help="Formato de salida")
    parser.add_argument("--file", type=str, help="Guardar resultado en archivo (markdown)")
    args = parser.parse_args()
    
    if not args.query:
        print("Usage: python query_rag.py \"tu búsqueda\" [--top N] [--output markdown]")
        print("Ejemplo: python query_rag.py \"presupuesto itb\" --output markdown")
        sys.exit(1)
    
    results = query_semantic(args.query, args.top)
    
    if args.output == "markdown":
        output = format_markdown(results, args.query)
        if args.file:
            # Guardar en el vault
            output_path = os.path.join(VAULT_PATH, args.file)
            # Agregar frontmatter
            full_content = f"""---
tags: ['#system/rag-results', '#auto-generated']
created: {datetime.now().strftime('%Y-%m-%d')}
query: "{args.query}"
---

{output}
"""
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(full_content)
            print(f"✅ Resultados guardados en: {args.file}")
        else:
            print(output)
    else:
        format_text(results)
