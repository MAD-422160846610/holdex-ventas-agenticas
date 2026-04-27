#!/usr/bin/env python3
"""
DuckDB-based embeddings para RAG Phase 3.
Almacena embeddings en DuckDB para mejor rendimiento y escalabilidad.
"""

import os
import json
import argparse
from pathlib import Path
from typing import List, Tuple, Optional
from datetime import datetime

import numpy as np

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
INDEX_DIR = os.path.join(VAULT_PATH, "rag_index")
DB_FILE = os.path.join(INDEX_DIR, "embeddings.duckdb")
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def _get_duckdb():
    """Importa DuckDB - lo instala si no existe."""
    try:
        import duckdb
        return duckdb
    except ImportError:
        print("[rag] DuckDB no instalado. Ejecuta: pip install duckdb")
        raise


def _read_body_from_md(path: str, max_chars: int = 5000) -> str:
    """Lee el cuerpo de un MD, truncando."""
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


def init_database():
    """Inicializa la base de datos DuckDB con el schema."""
    duckdb = _get_duckdb()
    os.makedirs(INDEX_DIR, exist_ok=True)
    
    conn = duckdb.connect(DB_FILE)
    
    # Tabla de notas con embeddings
    conn.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY,
            path VARCHAR NOT NULL UNIQUE,
            title VARCHAR,
            content TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            embedding BLOB
        )
    """)
    
    # Tabla de metadatos del índice
    conn.execute("""
        CREATE TABLE IF NOT EXISTS index_metadata (
            key VARCHAR PRIMARY KEY,
            value VARCHAR
        )
    """)
    
    # Índices para búsquedas rápidas
    conn.execute("CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_notes_path ON notes(path)")
    
    conn.close()
    print("✅ Base de datos DuckDB inicializada")


def build_index():
    """Construye el índice de embeddings en DuckDB."""
    duckdb = _get_duckdb()
    
    # Asegurar que existe el directorio
    os.makedirs(INDEX_DIR, exist_ok=True)
    
    # Si hay un índice numpy existente, migrarlo
    numpy_embeddings = os.path.join(INDEX_DIR, "embeddings.npy")
    numpy_paths = os.path.join(INDEX_DIR, "paths.json")
    
    if os.path.exists(numpy_embeddings) and os.path.exists(numpy_paths):
        print("📦 Migrando desde índice numpy existente...")
        _migrate_from_numpy(duckdb)
    else:
        # Construir desde cero
        _build_from_vault(duckdb)
    
    print("✅ Índice DuckDB construido")


def _migrate_from_numpy(duckdb):
    """Migra embeddings desde numpy a DuckDB."""
    import pickle
    
    embeddings = np.load(os.path.join(INDEX_DIR, "embeddings.npy"))
    
    with open(os.path.join(INDEX_DIR, "paths.json"), "r") as f:
        paths = json.load(f)
    
    # Cargar vectorizer para obtener contenido si es necesario
    vectorizer_file = os.path.join(INDEX_DIR, "vectorizer.pkl")
    if os.path.exists(vectorizer_file):
        with open(vectorizer_file, "rb") as f:
            vectorizer = pickle.load(f)
    
    conn = duckdb.connect(DB_FILE)
    
    # Limpiar tabla existente
    conn.execute("DELETE FROM notes")
    
    # Insertar embeddings
    for i, path in enumerate(paths):
        title = Path(path).stem
        content = _read_body_from_md(path)
        
        # Convertir embedding a bytes para storage
        embedding_bytes = embeddings[i].astype(np.float32).tobytes()
        
        conn.execute("""
            INSERT INTO notes (path, title, content, embedding)
            VALUES (?, ?, ?, ?)
        """, (path, title, content, embedding_bytes))
    
    # Actualizar metadatos
    conn.execute("""
        INSERT OR REPLACE INTO index_metadata (key, value) 
        VALUES ('last_updated', ?), ('total_notes', ?), ('embedding_dim', ?)
    """, (datetime.now().isoformat(), len(paths), embeddings.shape[1]))
    
    conn.close()
    print(f"✅ Migrados {len(paths)} embeddings a DuckDB")


def _build_from_vault(duckdb):
    """Construye el índice desde cero leyendo el vault."""
    # Recolectar notas
    notes = []
    for root, _, files in os.walk(VAULT_PATH):
        if ".obsidian" in root or "node_modules" in root:
            continue
        for f in files:
            if f.lower().endswith(".md"):
                path = os.path.join(root, f)
                notes.append(path)
    
    if not notes:
        print("[rag] No hay notas para indexar")
        return
    
    print(f"📚 Indexando {len(notes)} notas...")
    
    # Cargar modelo de embeddings
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        print("[rag] Falta sentence-transformers. Ejecuta: pip install sentence-transformers")
        return
    
    model = SentenceTransformer(MODEL_NAME, device="cpu")
    
    # Leer contenidos
    texts = []
    valid_paths = []
    for path in notes:
        content = _read_body_from_md(path)
        if content.strip():
            texts.append(content)
            valid_paths.append(path)
    
    # Generar embeddings
    print("🔢 Generando embeddings...")
    embeddings = model.encode(texts, batch_size=32, show_progress_bar=True)
    
    # Guardar en DuckDB
    conn = duckdb.connect(DB_FILE)
    conn.execute("DELETE FROM notes")
    
    for i, path in enumerate(valid_paths):
        title = Path(path).stem
        content = texts[i]
        embedding_bytes = embeddings[i].astype(np.float32).tobytes()
        
        conn.execute("""
            INSERT INTO notes (path, title, content, embedding)
            VALUES (?, ?, ?, ?)
        """, (path, title, content, embedding_bytes))
    
    # Metadatos
    conn.execute("""
        INSERT OR REPLACE INTO index_metadata (key, value) 
        VALUES ('last_updated', ?), ('total_notes', ?), ('embedding_dim', ?)
    """, (datetime.now().isoformat(), len(valid_paths), embeddings.shape[1]))
    
    conn.close()
    print(f"✅ Indexadas {len(valid_paths)} notas en DuckDB")


def query_text(query: str, top_k: int = 5) -> List[dict]:
    """Búsqueda semántica usando DuckDB."""
    duckdb = _get_duckdb()
    
    if not Path(DB_FILE).exists():
        print("[rag] Índice DuckDB no encontrado. Ejecuta build_index() primero.")
        return []
    
    conn = duckdb.connect(DB_FILE)
    
    # Cargar modelo
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        print("[rag] Falta sentence-transformers")
        return []
    
    model = SentenceTransformer(MODEL_NAME, device="cpu")
    qvec = model.encode([query], batch_size=1)[0]
    
    # Buscar en DuckDB
    rows = conn.execute("""
        SELECT path, title, content 
        FROM notes
    """).fetchall()
    
    if not rows:
        return []
    
    # Calcular similitud
    results = []
    for row in rows:
        path, title, content = row
        # Recuperar embedding
        embedding_bytes = conn.execute("""
            SELECT embedding FROM notes WHERE path = ?
        """, (path,)).fetchone()[0]
        
        emb = np.frombuffer(embedding_bytes, dtype=np.float32)
        
        # Similitud de coseno
        from numpy.linalg import norm
        sim = np.dot(emb, qvec) / (norm(emb) * norm(qvec) + 1e-9)
        
        # Snippet
        snippet = content.replace("\n", " ")[:200] if content else ""
        
        results.append({
            "path": path,
            "title": title,
            "score": float(sim),
            "snippet": snippet
        })
    
    conn.close()
    
    # Ordenar por similitud
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]


def get_stats() -> dict:
    """Obtiene estadísticas del índice."""
    if not Path(DB_FILE).exists():
        return {"status": "no_index"}
    
    duckdb = _get_duckdb()
    conn = duckdb.connect(DB_FILE)
    
    total = conn.execute("SELECT COUNT(*) FROM notes").fetchone()[0]
    
    metadata = {}
    rows = conn.execute("SELECT key, value FROM index_metadata").fetchall()
    for k, v in rows:
        metadata[k] = v
    
    conn.close()
    
    return {
        "status": "ok",
        "total_notes": total,
        "last_updated": metadata.get("last_updated", "unknown"),
        "embedding_dim": metadata.get("embedding_dim", "unknown")
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DuckDB Embeddings RAG")
    parser.add_argument("cmd", choices=["init", "build", "query", "stats"])
    parser.add_argument("arg", nargs="?", default="")
    parser.add_argument("top", nargs="?", type=int, default=5)
    args = parser.parse_args()
    
    if args.cmd == "init":
        init_database()
    elif args.cmd == "build":
        build_index()
    elif args.cmd == "query":
        if not args.arg:
            print("Proporciona una consulta")
        else:
            results = query_text(args.arg, args.top)
            for r in results:
                print(f"[{r['score']:.3f}] {r['title']}")
                print(f"  -> {r['path']}")
    elif args.cmd == "stats":
        print(json.dumps(get_stats(), indent=2))
