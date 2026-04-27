#!/usr/bin/env python3
"""
Core minimal para Rag (Phase 3): TF-IDF based semantic search.
This is a lightweight prototype to validate the end-to-end flow: index notes from the vault
and query them semantically without heavy embeddings yet.
"""

import os
import json
from pathlib import Path
from typing import List, Tuple

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
INDEX_DIR = os.path.join(VAULT_PATH, "rag_index")
DOCS_INDEX_FILE = os.path.join(INDEX_DIR, "docs.json")
VECTORS_FILE = os.path.join(INDEX_DIR, "vectors.npy")
VECTORIZER_FILE = os.path.join(INDEX_DIR, "vectorizer.pkl")


def _load_frontmatter_agnostic(content: str) -> Tuple[str, str]:
    if content.startswith("---"):  # very simple frontmatter separator
        parts = content.split("---", 2)
        if len(parts) >= 3:
            body = parts[2].lstrip()
            return "", body
    return "", content


def _collect_note_texts() -> List[Tuple[str, str]]:
    texts: List[Tuple[str, str]] = []
    for root, _, files in os.walk(VAULT_PATH):
        if ".obsidian" in root:
            continue
        for f in files:
            if f.lower().endswith(".md"):
                p = os.path.join(root, f)
                try:
                    with open(p, "r", encoding="utf-8") as fh:
                        raw = fh.read()
                except Exception:
                    continue
                _, body = _load_frontmatter_agnostic(raw)
                texts.append((p, body))
    return texts


def build_index():
    os.makedirs(INDEX_DIR, exist_ok=True)
    notes = _collect_note_texts()
    if not notes:
        print("No notes found para indexar")
        return
    paths, bodies = zip(*notes)
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    tfidf = vectorizer.fit_transform(list(bodies))

    # Persist
    import pickle
    with open(VECTORIZER_FILE, "wb") as f:
        pickle.dump(vectorizer, f)
    with open(os.path.join(INDEX_DIR, "doc_paths.json"), "w", encoding="utf-8") as f:
        json.dump(list(paths), f)
    np.save(VECTORS_FILE, tfidf.toarray())
    print(f"🧭 Rag: índice TF-IDF generado con {len(notes)} notas")


def _load_index():
    if not Path(VECTORIZER_FILE).exists():
        return None, None, None
    import pickle
    with open(VECTORIZER_FILE, "rb") as f:
        vectorizer = pickle.load(f)
    with open(os.path.join(INDEX_DIR, "doc_paths.json"), "r", encoding="utf-8") as f:
        paths = json.load(f)
    vectors = np.load(VECTORS_FILE) if Path(VECTORS_FILE).exists() else None
    return vectorizer, paths, vectors


def query_text(query: str, top_k: int = 5):
    vectorizer, paths, vectors = _load_index()
    if vectorizer is None or paths is None or vectors is None:
        print("⚠️  Índice no encontrado. Corre build_index() primero.")
        return []
    qvec = vectorizer.transform([query]).toarray()
    sims = cosine_similarity(qvec, vectors).flatten()
    top_indices = sims.argsort()[::-1][:top_k]
    results = [(paths[i], sims[i]) for i in top_indices]
    return results

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("cmd", choices=["build","query"])
    p.add_argument("arg", nargs="?", default="")
    p.add_argument("top", nargs="?", type=int, default=5)
    args = p.parse_args()
    if args.cmd == "build":
        build_index()
    else:
        q = args.arg
        if not q:
            print("Proporciona una consulta para query.")
        else:
            results = query_text(q, args.top)
            for path, score in results:
                print(f"{path} -> score={score:.4f}")
