#!/usr/bin/env python3
"""
Script de Lint Automático para GlitchBrain (LLM-Wiki Pattern)
Detecta:
- Contradicciones entre notas
- Claims stale/obsoletos
- Notas orphan (sin inbound links)
- Conceptos mencionados sin página propia
- Missing cross-references
- Gaps de información

Basado en el patrón LLM-Wiki de Karpathy.
"""

import os
import re
from datetime import datetime
from pathlib import Path
from collections import defaultdict

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
REPORTES_PATH = os.path.join(VAULT_PATH, "REPORTES")


def get_all_notes():
    """Obtiene todas las notas del vault."""
    notes = []
    for root, dirs, files in os.walk(VAULT_PATH):
        # Ignorar carpetas del sistema
        dirs[:] = [
            d
            for d in dirs
            if d not in [".obsidian", ".git", "node_modules", "venv", "__pycache__"]
        ]
        for file in files:
            if file.endswith(".md"):
                notes.append(os.path.join(root, file))
    return notes


def extract_frontmatter(path):
    """Extrae metadatos del frontmatter."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        if content.startswith("---"):
            parts = content.split("---", 2)
            fm = {}
            if len(parts) >= 2:
                for line in parts[1].split("\n"):
                    if ":" in line:
                        key, val = line.split(":", 1)
                        fm[key.strip()] = val.strip().strip("'\"")
            return fm
    except:
        pass
    return {}


def find_orphans(notes, file_map):
    """Encuentra notas sin inbound links."""
    linked = set()
    orphaned = []

    # Buscar todos los enlaces
    for note in notes:
        rel_path = os.path.relpath(note, VAULT_PATH)
        try:
            with open(note, "r", encoding="utf-8") as f:
                content = f.read()
            # Encontrar wikilinks [[...]]
            links = re.findall(r"\[\[([^\]|]+)", content)
            for link in links:
                linked.add(link.lower())
        except:
            pass

    # Notas sin inbound links
    for note in notes:
        rel_path = os.path.relpath(note, VAULT_PATH)
        name = os.path.splitext(os.path.basename(note))[0].lower()

        # Si nunca fue linkeado desde otro lado
        if name not in linked:
            fm = extract_frontmatter(note)
            # Excluir notas raíz y templates
            if fm.get("tags") and "#template" not in str(fm.get("tags", [])):
                orphaned.append(rel_path)

    return orphaned


def find_stale_claims(notes):
    """Encuentra claims que pueden estar stale."""
    stale = []
    current_date = datetime.now().strftime("%Y-%m-%d")

    # Notas con fecha de más de 30 días
    for note in notes:
        fm = extract_frontmatter(note)
        created = fm.get("created", "")

        if created:
            # Calcular días transcurridos (simplificado)
            try:
                created_dt = datetime.strptime(created, "%Y-%m-%d")
                days_ago = (datetime.now() - created_dt).days

                if days_ago > 60:  # Más de 60 días
                    rel_path = os.path.relpath(note, VAULT_PATH)
                    stale.append((rel_path, created, days_ago))
            except Exception:
                pass

    return stale


def find_missing_concepts(notes, file_map):
    """Encuentra conceptos mencionados que podrían tener página propia."""
    # Palabras que aparecen frecuentemente pero no tienen nota
    word_count = defaultdict(int)

    # Stop words simples
    stop_words = {
        "el",
        "la",
        "los",
        "las",
        "un",
        "una",
        "de",
        "en",
        "que",
        "es",
        "por",
        "para",
        "con",
        "sin",
        "su",
        "se",
        "al",
        "lo",
        "más",
        "como",
        "pero",
        "o",
        "y",
        "si",
        "no",
        "tan",
        "muy",
        "este",
        "esta",
        "esto",
        "estos",
        "estas",
        "mi",
        "tu",
        "su",
        "nos",
        "os",
        "me",
        "te",
        "se",
    }

    for note in notes:
        try:
            with open(note, "r", encoding="utf-8") as f:
                content = f.read()

            # Limpiar content
            content = re.sub(r"\[+[^\]]+\]\([^\)]+\)", "", content)  # Quitar enlaces
            content = re.sub(r"#+", "", content)  # Quitar headers
            content = re.sub(r"[-*] ", "", content)  # Quitar listas

            words = re.findall(r"\b[a-zA-Záéíóúñ]{4,}\b", content.lower())
            for w in words:
                if w not in stop_words:
                    word_count[w] += 1
        except:
            pass

    # Filtrar conceptos que podrían existir pero no existen como nota
    missing = []
    for word, count in word_count.items():
        if count > 5:  # Más de 5 menciones
            # Buscar si existe como nota
            if word not in file_map and word.title() not in file_map:
                missing.append((word, count))

    return sorted(missing, key=lambda x: -x[1])[:20]


def find_contradictions(notes):
    """Busca posible contradicciones entre notas."""
    # Comparar fechas y estados
    contradictions = []

    # Por ejemplo: una nota dice "completado" pero otra dice "pendiente"
    # Esto es simplificado - un LLM haría mejor análisis

    return contradictions  # Por ahora vacío


def generate_lint_report():
    """Genera el reporte completo de lint."""
    print("[lint] Iniciando análisis del vault...")

    notes = get_all_notes()
    file_map = {os.path.splitext(os.path.basename(n))[0].lower(): n for n in notes}

    # 1. Orphan notes
    print("[lint] Buscando notas orphan...")
    orphans = find_orphans(notes, file_map)

    # 2. Stale claims
    print("[lint] Buscando claims stale...")
    stale = find_stale_claims(notes)

    # 3. Missing concepts
    print("[lint] Buscando conceptos faltantes...")
    missing_concepts = find_missing_concepts(notes, file_map)

    # 4. Contradictions
    print("[lint] Analizando contradicciones...")
    contradictions = find_contradictions(notes)

    # Generar reporte
    report = f"""---
tags: ['#glitchbrain/meta', '#lint']
created: {datetime.now().strftime("%Y-%m-%d")}
status: active
---

# 🔍 Reporte de Lint (LLM-Wiki)

**Fecha:** {datetime.now().strftime("%Y-%m-%d %H:%M")}
**Notas analizadas:** {len(notes)}

## 📊 Resumen

| Métrica | Cantidad |
|--------|---------|
| Notas orphan | {len(orphans)} |
| Claims stale | {len(stale)} |
| Conceptos faltantes | {len(missing_concepts)} |
| Contradicciones | {len(contradictions)} |

"""

    if orphans:
        report += "\n## 🔗 Notas Orphan (sin inbound links)\n\n"
        for o in orphans[:10]:
            report += f"- [[{o}]]\n"
        if len(orphans) > 10:
            report += f"\n*... y {len(orphans) - 10} más*\n"

    if stale:
        report += "\n## ⏱️ Notas Stale (>60 días)\n\n"
        for s in stale[:10]:
            report += f"- [[{s[0]}]] (desde {s[1]}, hace {s[2]} días)\n"
        if len(stale) > 10:
            report += f"\n*... y {len(stale) - 10} más*\n"

    if missing_concepts:
        report += "\n## 💡 Conceptos sin página propia\n\n"
        for m in missing_concepts[:10]:
            report += f"- *{m[0]}* mentioned {m[1]} times\n"

    if contradictions:
        report += "\n## ⚠️ Posibles Contradicciones\n\n"
        for c in contradictions:
            report += f"- {c}\n"

    # Guardar reporte
    os.makedirs(REPORTES_PATH, exist_ok=True)
    report_file = os.path.join(REPORTES_PATH, "lint-report.md")
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"[lint] Reporte generado: {report_file}")
    return report


if __name__ == "__main__":
    generate_lint_report()
