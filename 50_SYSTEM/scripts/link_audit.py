#!/usr/bin/env python3
"""
Link Audit for Obsidian Vault

Generates a report of:
- Dangling links (references to non-existing notes)
- Orphaned notes (notes not linked to or from others)
- Simple tag usage summary (optional)

Usage:
  python3 scripts/link_audit.py -d /path/to/vault
"""

import re
import os
import json
from pathlib import Path
from collections import defaultdict


def collect_notes(root: Path):
    notes = []
    for p in root.rglob("*.md"):
        notes.append(p)
    return notes


def extract_links(content: str):
    # Obsidian wiki links [[Note]] or [[Note|alias]]
    pattern = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")
    return pattern.findall(content)


def build_graph(notes):
    existing = set([n.name for n in notes])
    links = defaultdict(list)  # note -> list of linked notes
    for n in notes:
        try:
            text = n.read_text(encoding="utf-8")
        except Exception:
            continue
        for link in extract_links(text):
            links[n.name].append(link)
    return existing, links


def main(vault_path: Path):
    vault = vault_path.resolve()
    notes = collect_notes(vault)
    existing, links = build_graph(notes)

    # Dangling references: referenced but not existing notes
    referenced = set()
    for src, dsts in links.items():
        for d in dsts:
            if d not in existing:
                referenced.add((src, d))

    # Orphaned notes: have no inlinks or outlinks
    inlinks = defaultdict(int)
    outlinks = defaultdict(int)
    for src, dsts in links.items():
        outlinks[src] += len(dsts)
        for dst in dsts:
            if dst in existing:
                inlinks[dst] += 1

    orphans = []
    for n in notes:
        name = n.name
        if inlinks.get(name, 0) == 0 and outlinks.get(name, 0) == 0:
            orphans.append(str(n))

    report = {
        "dangling_links": sorted(list(referenced)),
        "orphan_notes": sorted(orphans),
        "counts": {
            "notes": len(notes),
            "dangling": len(referenced),
            "orphans": len(orphans),
        },
    }

    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-d", "--dir", dest="dir", required=True, help="Vault root path"
    )
    args = parser.parse_args()
    main(Path(args.dir))
