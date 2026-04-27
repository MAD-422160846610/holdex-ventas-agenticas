#!/usr/bin/env python3
"""
Agente de Auditoría del Vault - Obsidian 3.1
Detecta problemas y genera reportes de salud del vault.
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Set
from datetime import datetime
from collections import defaultdict

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
REPORT_DIR = os.path.join(VAULT_PATH, "REPORTES")


class VaultAuditor:
    """Audita el vault de Obsidian y detecta problemas."""
    
    def __init__(self, vault_path: str):
        self.vault_path = vault_path
        self.notes: Dict[str, dict] = {}
        self.links: Dict[str, Set[str]] = defaultdict(set)
        self.backlinks: Dict[str, Set[str]] = defaultdict(set)
        self.issues: List[dict] = []
        
    def scan(self):
        """Escanea todo el vault."""
        print("🔍 Escaneando vault...")
        
        for root, _, files in os.walk(self.vault_path):
            # Ignorar carpetas especiales
            if ".obsidian" in root or "node_modules" in root:
                continue
            
            for f in files:
                if not f.lower().endswith(".md"):
                    continue
                
                path = os.path.join(root, f)
                self._analyze_note(path)
        
        self._resolve_backlinks()
        print(f"✅ Escaneadas {len(self.notes)} notas")
        
    def _analyze_note(self, path: str):
        """Analiza una nota individual."""
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception:
            return
        
        # Extraer frontmatter
        frontmatter = {}
        body = content
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                frontmatter_text = parts[1]
                body = parts[2].strip()
                
                # Parsear YAML simple
                for line in frontmatter_text.split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        frontmatter[key.strip()] = value.strip()
        
        # Extraer título
        title = Path(path).stem
        
        # Encontrar enlaces internos
        links = set()
        # Formato [[nota]]
        links.update(re.findall(r'\[\[([^\]|]+)', body))
        # Formato [[nota|alias]]
        
        self.notes[path] = {
            "path": path,
            "title": title,
            "frontmatter": frontmatter,
            "body": body,
            "has_frontmatter": bool(frontmatter),
            "links": links,
            "size": len(content)
        }
        
        # Guardar enlaces
        for link in links:
            self.links[path].add(link)
            
    def _resolve_backlinks(self):
        """Resuelve backlinks entre notas."""
        # Crear mapa de títulos a paths
        title_to_path = {}
        for path, note in self.notes.items():
            title_to_path[note["title"].lower()] = path
            # También guardar sin espacios y sin guiones
            title_to_path[note["title"].replace(" ", "").lower()] = path
        
        # Resolver backlinks
        for path, links in self.links.items():
            for link in links:
                link_lower = link.lower()
                if link_lower in title_to_path:
                    target_path = title_to_path[link_lower]
                    self.backlinks[target_path].add(path)
                    
    def check_frontmatter(self):
        """Verifica que todas las notas tengan frontmatter."""
        print("📋 Verificando frontmatter...")
        
        missing_fm = []
        for path, note in self.notes.items():
            if not note["has_frontmatter"]:
                rel_path = path.replace(self.vault_path + "/", "")
                missing_fm.append(rel_path)
                self.issues.append({
                    "type": "missing_frontmatter",
                    "severity": "medium",
                    "path": rel_path,
                    "message": "Nota sin frontmatter YAML"
                })
        
        return missing_fm
    
    def check_orphans(self):
        """Encuentra notas huérfanas (sin enlaces entrantes)."""
        print("🔗 Buscando notas huérfanas...")
        
        orphans = []
        for path, note in self.notes.items():
            if path not in self.backlinks or not self.backlinks[path]:
                rel_path = path.replace(self.vault_path + "/", "")
                # Excluir diarios y plantillas
                if not note["title"].startswith("📅") and "PLANTILLAS" not in path:
                    orphans.append(rel_path)
                    self.issues.append({
                        "type": "orphan_note",
                        "severity": "low",
                        "path": rel_path,
                        "message": "Nota sin enlaces entrantes"
                    })
        
        return orphans
    
    def check_broken_links(self):
        """Busca enlaces rotos."""
        print("⛓️  Verificando enlaces...")
        
        broken = []
        
        # Crear mapa de títulos
        titles = {note["title"].lower() for note in self.notes.values()}
        
        for path, note in self.notes.items():
            for link in note["links"]:
                link_lower = link.lower()
                # Buscar coincidencia
                found = False
                for title in titles:
                    if link_lower in title or title in link_lower:
                        found = True
                        break
                
                if not found and link.strip():
                    rel_path = path.replace(self.vault_path + "/", "")
                    broken.append({
                        "from": rel_path,
                        "broken_link": link
                    })
                    self.issues.append({
                        "type": "broken_link",
                        "severity": "medium",
                        "path": rel_path,
                        "message": f"Enlace roto: [[{link}]]"
                    })
        
        return broken
    
    def check_duplicates(self):
        """Busca notas con títulos duplicados."""
        print("🔎 Buscando duplicados...")
        
        titles = defaultdict(list)
        for path, note in self.notes.items():
            titles[note["title"].lower()].append(path)
        
        duplicates = []
        for title, paths in titles.items():
            if len(paths) > 1:
                for p in paths:
                    rel_path = p.replace(self.vault_path + "/", "")
                    duplicates.append(rel_path)
                    self.issues.append({
                        "type": "duplicate_title",
                        "severity": "high",
                        "path": rel_path,
                        "message": f"Título duplicado: {title}"
                    })
        
        return duplicates
    
    def check_tag_usage(self):
        """Analiza uso de tags."""
        print("🏷️  Analizando tags...")
        
        tags = defaultdict(int)
        for note in self.notes.values():
            fm = note.get("frontmatter", {})
            if "tags" in fm:
                tag_str = fm["tags"]
                # Parsear tags
                if isinstance(tag_str, str):
                    # Formato: ['#tag1', '#tag2']
                    found_tags = re.findall(r'#(\w+/[\w/]+|\w+)', tag_str)
                    for t in found_tags:
                        tags[t] += 1
                elif isinstance(tag_str, list):
                    for t in tag_str:
                        tags[str(t).replace("#", "")] += 1
        
        return dict(sorted(tags.items(), key=lambda x: x[1], reverse=True)[:20])
    
    def generate_report(self) -> dict:
        """Genera reporte completo."""
        self.scan()
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_notes": len(self.notes),
            "checks": {
                "frontmatter": {
                    "missing": self.check_frontmatter(),
                    "count": len([i for i in self.issues if i["type"] == "missing_frontmatter"])
                },
                "orphans": {
                    "notes": self.check_orphans(),
                    "count": len([i for i in self.issues if i["type"] == "orphan_note"])
                },
                "broken_links": {
                    "links": self.check_broken_links(),
                    "count": len([i for i in self.issues if i["type"] == "broken_link"])
                },
                "duplicates": {
                    "notes": self.check_duplicates(),
                    "count": len([i for i in self.issues if i["type"] == "duplicate_title"])
                }
            },
            "top_tags": self.check_tag_usage(),
            "issues_summary": {
                "critical": len([i for i in self.issues if i["severity"] == "high"]),
                "medium": len([i for i in self.issues if i["severity"] == "medium"]),
                "low": len([i for i in self.issues if i["severity"] == "low"])
            },
            "total_issues": len(self.issues)
        }
        
        return report
    
    def save_report(self, format: str = "json"):
        """Guarda el reporte."""
        report = self.generate_report()
        
        os.makedirs(REPORT_DIR, exist_ok=True)
        
        if format == "json":
            filepath = os.path.join(REPORT_DIR, f"audit_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
        
        elif format == "markdown":
            filepath = os.path.join(REPORT_DIR, f"audit_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(f"# 🔍 Reporte de Auditoría del Vault\n")
                f.write(f"**Fecha:** {report['timestamp']}\n\n")
                f.write(f"## 📊 Resumen\n")
                f.write(f"- **Total de notas:** {report['total_notes']}\n")
                f.write(f"- **Problemas totales:** {report['total_issues']}\n")
                f.write(f"  - 🔴 Críticos: {report['issues_summary']['critical']}\n")
                f.write(f"  - 🟡 Medios: {report['issues_summary']['medium']}\n")
                f.write(f"  - 🟢 Bajos: {report['issues_summary']['low']}\n\n")
                
                f.write(f"## 📋 Detalles\n\n")
                
                if report['checks']['frontmatter']['count'] > 0:
                    f.write(f"### ⚠️ Notas sin frontmatter ({report['checks']['frontmatter']['count']})\n")
                    for note in report['checks']['frontmatter']['missing'][:10]:
                        f.write(f"- `{note}`\n")
                    f.write("\n")
                
                if report['checks']['duplicates']['count'] > 0:
                    f.write(f"### 🔴 Notas duplicadas ({report['checks']['duplicates']['count']})\n")
                    for note in report['checks']['duplicates']['notes']:
                        f.write(f"- `{note}`\n")
                    f.write("\n")
                
                if report['checks']['broken_links']['count'] > 0:
                    f.write(f"### ⛓️ Enlaces rotos ({report['checks']['broken_links']['count']})\n")
                    for link in report['checks']['broken_links']['links'][:10]:
                        f.write(f"- `{link['from']}` → [[{link['broken_link']}]]\n")
                    f.write("\n")
                
                if report['checks']['orphans']['count'] > 0:
                    f.write(f"### 📌 Notas huérfanas ({report['checks']['orphans']['count']})\n")
                    for note in report['checks']['orphans']['notes'][:10]:
                        f.write(f"- `{note}`\n")
                    f.write("\n")
                
                f.write(f"## 🏷️ Tags más usados\n")
                for tag, count in report['top_tags'].items():
                    f.write(f"- `#{tag}`: {count}\n")
        
        print(f"✅ Reporte guardado en: {filepath}")
        return filepath


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Auditor del Vault")
    parser.add_argument("--format", choices=["json", "markdown"], default="markdown")
    args = parser.parse_args()
    
    auditor = VaultAuditor(VAULT_PATH)
    auditor.save_report(args.format)
