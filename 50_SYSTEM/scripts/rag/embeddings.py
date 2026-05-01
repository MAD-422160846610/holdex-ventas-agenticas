#!/usr/bin/env python3
"""
Embeddings para Rag Phase 3: DuckDB + Sentence-Transformers (versión estable)
Este script construye un índice de embeddings para las notas y permite consultas semánticas.
"""

import os
import json
import argparse
from pathlib import Path
from typing import List

import numpy as np
try:
    from sentence_transformers import SentenceTransformer
except Exception as e:
    print("[rag] Falta sentence-transformers en el entorno. Ejecuta: pip install sentence-transformers")
    raise

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
INDEX_DIR = os.path.join(VAULT_PATH, "rag_index")
DOCS_INDEX_FILE = os.path.join(INDEX_DIR, "doc_paths.json")
EMBEDDINGS_FILE = os.path.join(INDEX_DIR, "embeddings.npy")
PATHS_FILE = os.path.join(INDEX_DIR, "paths.json")
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def _read_body_from_md(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return ""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            return parts[2].lstrip()
    return content


def build_index():
    if not Path(DOCS_INDEX_FILE).exists():
        print("[rag] doc_paths.json no encontrado. Ejecuta core.build_index() previamente para generar el índice de paths.")
        return
    with open(DOCS_INDEX_FILE, "r", encoding="utf-8") as f:
        paths = json.load(f)
    texts = []
    abs_paths = []
    for p in paths:
        absp = p if os.path.isabs(p) else os.path.join(VAULT_PATH, p)
        abs_paths.append(absp)
        texts.append(_read_body_from_md(absp))
    if not texts:
        print("[rag] No hay textos para indexar")
        return
    model = SentenceTransformer(MODEL_NAME, device="cpu")
    embeddings = model.encode(texts, batch_size=32, show_progress_bar=True)
    os.makedirs(INDEX_DIR, exist_ok=True)
    # Persistencia
    np.save(EMBEDDINGS_FILE, embeddings)
    with open(PATHS_FILE, "w", encoding="utf-8") as f:
        json.dump(abs_paths, f)
    print("✅ Embeddings indexados en embeddings.npy para {} notas".format(len(texts)))


def _load_index():
    if not Path(EMBEDDINGS_FILE).exists():
        return None, None
    embeddings = np.load(EMBEDDINGS_FILE)
    with open(PATHS_FILE, "r", encoding="utf-8") as f:
        paths = json.load(f)
    return embeddings, paths


def query_text(query: str, top_k: int = 5):
    if not Path(EMBEDDINGS_FILE).exists():
        print("[rag] Embeddings index no encontrado. Ejecuta build_index() primero.")
        return []
    embeddings, paths = _load_index()
    if embeddings is None:
        return []
    model = SentenceTransformer(MODEL_NAME, device="cpu")
    qvec = model.encode([query], batch_size=1)[0]
    from numpy.linalg import norm
    sims = embeddings @ qvec / (norm(embeddings, axis=1) * norm(qvec) + 1e-9)
    top_indices = sims.argsort()[::-1][:top_k]
    return [(paths[i], float(sims[i]), Path(paths[i]).name) for i in top_indices]

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("cmd", choices=["build","query"])
    p.add_argument("arg", nargs="?", default="")
    p.add_argument("top", nargs="?", type=int, default=5)
    args = p.parse_args()
    if args.cmd == "build":
        build_index()
    else:
        res = query_text(args.arg, args.top)
        for path, score, title in res:
            print(f"{path} | score={score:.4f} | title={title}")
