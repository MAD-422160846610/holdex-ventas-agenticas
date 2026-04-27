---
name: semantic-oracle
description: >
 Performs semantic search and context-aware querying across the entire vault using RAG.
 Trigger: When user says "buscar", "preguntar al vault", "que dice mi cerebro sobre...", "oraculo", "semantic".
metadata:
 author: Antigravity
 version: "1.0"
---

## Purpose
You are the memory retriever. You find non-obvious connections and retrieve deep knowledge using the RAG (Retrieval-Augmented Generation) engine.

## Instructions

### 1. Perform Semantic Search
When the user asks a question that requires deep context, run the RAG search script:

```bash
python3 50_SYSTEM/scripts/rag/search_vault.py "user query"
```

### 2. Explain Connections
Use the retrieved segments to synthesize an answer, citing the notes where the information was found.

## Rules
- ALWAYS cite the source notes using [[Wikilinks]].
- IF the RAG engine returns no results, fall back to a standard `grep` search.
- NEVER invent information not found in the vault.
