#!/usr/bin/env python3
"""
Simple keyword-based search for Obsidian vault.
Works without external dependencies (no numpy/sklearn needed).
Use this as a lightweight alternative when embeddings are not available.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"


def get_note_content(path: str) -> tuple:
    """Extrae título y cuerpo de una nota."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return "", ""
    
    title = Path(path).stem
    
    # Remover frontmatter
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            body = parts[2].lstrip()
    
    return title, body


def search_vault(query: str, max_results: int = 10):
    """Búsqueda simple por keywords en el vault."""
    query_lower = query.lower()
    query_words = query_lower.split()
    
    results = []
    
    for root, _, files in os.walk(VAULT_PATH):
        # Ignorar carpetas especiales
        if ".obsidian" in root or "node_modules" in root:
            continue
        
        for f in files:
            if not f.lower().endswith(".md"):
                continue
            
            path = os.path.join(root, f)
            title, body = get_note_content(path)
            
            if not body:
                continue
            
            body_lower = body.lower()
            
            # Contar cuántas keywords coinciden
            matches = sum(1 for word in query_words if word in body_lower)
            
            if matches > 0:
                # Calcular score simple
                score = matches / len(query_words)
                
                # Extraer snippet
                lines = body.split("\n")
                snippet_lines = [l.strip() for l in lines if l.strip() and not l.strip().startswith("#")][:3]
                snippet = " | ".join(snippet_lines)[:200]
                
                rel_path = path.replace(VAULT_PATH + "/", "")
                
                results.append({
                    "title": title,
                    "path": path,
                    "rel_path": rel_path,
                    "score": score,
                    "matches": matches,
                    "snippet": snippet
                })
    
    # Ordenar por score y matches
    results.sort(key=lambda x: (x["score"], x["matches"]), reverse=True)
    return results[:max_results]


def format_markdown(results, query: str):
    """Formatea resultados como markdown."""
    output = []
    output.append(f"## 🔍 Resultados para: \"{query}\"")
    output.append(f"*(búsqueda: {datetime.now().strftime('%Y-%m-%d %H:%M')})*\n")
    
    if not results:
        output.append("*No se encontraron resultados.*")
        return "\n".join(output)
    
    for i, r in enumerate(results, 1):
        output.append(f"### {i}. [[{r['title']}]]")
        output.append(f"**Matches:** {r['matches']} | **Path:** `{r['rel_path']}`")
        output.append(f"> {r['snippet']}")
        output.append("")
    
    output.append("---")
    output.append("*Usa `python scripts/rag/search_vault.py \"tu búsqueda\"` para nueva consulta*")
    return "\n".join(output)


def format_text(results):
    """Formato texto para CLI."""
    if not results:
        print("No se encontraron resultados.")
        return
    for r in results:
        print(f"\n[{r['matches']} matches] {r['title']}")
        print(f"  -> {r['path']}")
        print(f"  {r['snippet'][:100]}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Búsqueda simple en vault Obsidian")
    parser.add_argument("query", nargs="?", default="", help="Texto de búsqueda")
    parser.add_argument("--top", type=int, default=10, help="Número de resultados")
    parser.add_argument("--output", choices=["text", "markdown"], default="text")
    parser.add_argument("--file", type=str, help="Guardar en archivo")
    args = parser.parse_args()
    
    if not args.query:
        print("Usage: python search_vault.py \"tu búsqueda\" [--top N] [--output markdown]")
        print("Ejemplo: python search_vault.py \"presupuesto itb\" --output markdown --file \"RAG - Resultados.md\"")
        sys.exit(1)
    
    results = search_vault(args.query, args.top)
    
    if args.output == "markdown":
        output = format_markdown(results, args.query)
        if args.file:
            output_path = os.path.join(VAULT_PATH, args.file)
            full_content = f"""---
tags: ['#system/search-results', '#auto-generated']
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
