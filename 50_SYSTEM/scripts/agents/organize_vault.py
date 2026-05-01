#!/usr/bin/env python3
"""
Agente de Organización del Vault - Obsidian 3.1
Sugiere y ejecuta reorganización automática del vault según PARA.
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Set, Tuple
from datetime import datetime
from collections import defaultdict
import shutil

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"

# Estructura PARA esperada
PARA_STRUCTURE = {
    "001": "📥 CAPTURA",      # Notas rápidas / inbox
    "050": "🏆 ACTIVOS",     # Recursos valiosos
    "100": "✅ PROYECTOS",   # Proyectos activos
    "200": "🌍 MEMORIA DIGITAL",  # Conocimiento
    "300": "🧠 MODELOS MENTALES",  # Modelos
    "900": "📆 DIARIO",      # Notas diarias
    "901": "🧱 PLANTILLAS",  # Plantillas
    "999": "🗑 ARCHIVO"      # Archivados
}

# Mapeo de tags a carpetas
TAG_TO_FOLDER = {
    "proyecto": "100",
    "proyectos": "100",
    "proyecto/": "100",
    "area": "050",
    "areas": "050",
    "recurso": "050",
    "recursos": "050",
    "zk/permanent": "200",
    "zk/temporal": "001",
    "nota": "200",
    "diario": "900",
    "plantilla": "901",
    "archive": "999"
}


class VaultOrganizer:
    """Organiza el vault automáticamente."""
    
    def __init__(self, vault_path: str, dry_run: bool = True):
        self.vault_path = vault_path
        self.dry_run = dry_run
        self.notes: Dict[str, dict] = {}
        self.suggestions: List[dict] = []
        
    def scan(self):
        """Escanea el vault."""
        print("🔍 Escaneando vault para organización...")
        
        for root, _, files in os.walk(self.vault_path):
            if ".obsidian" in root or "node_modules" in root:
                continue
            
            for f in files:
                if not f.lower().endswith(".md"):
                    continue
                
                path = os.path.join(root, f)
                self._analyze_note(path)
        
        print(f"✅ Analizadas {len(self.notes)} notas")
        
    def _analyze_note(self, path: str):
        """Analiza una nota."""
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
                
                for line in frontmatter_text.split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        frontmatter[key.strip()] = value.strip()
        
        title = Path(path).stem
        
        # Extraer tags
        tags = set()
        if "tags" in frontmatter:
            tag_str = str(frontmatter["tags"])
            tags.update(re.findall(r'#?(\w+/[\w/]+|\w+)', tag_str))
        
        # Buscar más tags en el body
        tags.update(re.findall(r'#(\w+/[\w/]+|\w+)', body))
        
        self.notes[path] = {
            "path": path,
            "title": title,
            "frontmatter": frontmatter,
            "body": body,
            "tags": tags,
            "folder": self._get_folder(path),
            "relative_path": path.replace(self.vault_path + "/", "")
        }
        
    def _get_folder(self, path: str) -> str:
        """Obtiene la carpeta actual de la nota."""
        rel = path.replace(self.vault_path + "/", "")
        parts = rel.split("/")
        return parts[0] if parts else ""
    
    def _suggest_folder(self, note: dict) -> str:
        """Sugiere la carpeta correcta para una nota."""
        tags = note["tags"]
        
        # Buscar por tags
        for tag, folder in TAG_TO_FOLDER.items():
            if any(tag in t for t in tags):
                return folder
        
        # Buscar por keywords en título
        title_lower = note["title"].lower()
        
        if "diario" in title_lower or "daily" in title_lower:
            return "900"
        if "plantilla" in title_lower or "template" in title_lower:
            return "901"
        if "archiv" in title_lower:
            return "999"
        if "proyecto" in title_lower:
            return "100"
            
        # Por defecto: Memoria Digital
        return "200"
    
    def analyze_structure(self):
        """Analiza la estructura actual y genera sugerencias."""
        print("📊 Analizando estructura...")
        
        folder_counts = defaultdict(int)
        
        for path, note in self.notes.items():
            folder = note["folder"]
            folder_counts[folder] += 1
            
            # Sugerir carpeta correcta
            suggested_folder = self._suggest_folder(note)
            
            if folder != suggested_folder and suggested_folder:
                self.suggestions.append({
                    "type": "move",
                    "from": note["relative_path"],
                    "to": f"{suggested_folder}/{Path(note['relative_path']).name}",
                    "reason": f"Basado en tags: {', '.join(list(note['tags'])[:3])}",
                    "severity": "medium"
                })
        
        return dict(folder_counts)
    
    def suggest_tags(self):
        """Sugiere tags faltantes."""
        print("🏷️  Sugiriendo tags...")
        
        # Palabras clave por tag
        keyword_tags = {
            "proyecto": ["proyecto", "project", "implementar", "desarrollar"],
            "research": ["investigación", "research", "estudiar", "analizar"],
            "persona": ["persona", "contacto", "email", "teléfono"],
            "recurso": ["recurso", "resource", "herramienta", "link"],
            "zk/permanent": ["nota permanente", "concepto", "idea clave"],
            "diario": ["diario", "daily", "hoy", "reflexión"],
        }
        
        for path, note in self.notes.items():
            body_lower = note["body"].lower()
            current_tags = note["tags"]
            
            for tag, keywords in keyword_tags.items():
                # Si hay keywords pero no el tag
                if any(kw in body_lower for kw in keywords) and tag not in current_tags:
                    self.suggestions.append({
                        "type": "add_tag",
                        "path": note["relative_path"],
                        "tag": tag,
                        "reason": f"Encontrado: {[kw for kw in keywords if kw in body_lower]}",
                        "severity": "low"
                    })
    
    def suggest_links(self):
        """Sugiere enlaces a notas relacionadas."""
        print("🔗 Buscando notas relacionadas...")
        
        # Buscar por similitud de contenido usando palabras clave
        for path1, note1 in self.notes.items():
            if note1["body"] < 100:  # Skip notas muy cortas
                continue
                
            words1 = set(note1["body"].lower().split())
            
            for path2, note2 in self.notes.items():
                if path1 >= path2:
                    continue
                    
                words2 = set(note2["body"].lower().split())
                
                # Calcular intersección
                common = words1 & words2
                if len(common) > 10:  # Más de 10 palabras en común
                    # Evitar si ya están enlazadas
                    if note2["title"].lower() not in note1["body"].lower():
                        self.suggestions.append({
                            "type": "add_link",
                            "from": note1["relative_path"],
                            "to": note2["title"],
                            "reason": f"{len(common)} palabras en común",
                            "severity": "low"
                        })
    
    def apply_suggestions(self, suggestion_types: List[str] = None):
        """Aplica las sugerencias seleccionadas."""
        if self.dry_run:
            print("⚠️  Modo dry-run. No se realizarán cambios.")
            print(f"📝 {len(self.suggestions)} sugerencias generadas")
            return
        
        applied = 0
        
        for suggestion in self.suggestions:
            if suggestion_types and suggestion["type"] not in suggestion_types:
                continue
                
            if suggestion["type"] == "move":
                # Mover nota
                old_path = os.path.join(self.vault_path, suggestion["from"])
                new_path = os.path.join(self.vault_path, suggestion["to"])
                
                # Crear carpeta si no existe
                os.makedirs(os.path.dirname(new_path), exist_ok=True)
                
                try:
                    shutil.move(old_path, new_path)
                    print(f"✅ Movido: {suggestion['from']} → {suggestion['to']}")
                    applied += 1
                except Exception as e:
                    print(f"❌ Error moviendo: {e}")
                    
            elif suggestion["type"] == "add_tag":
                # Agregar tag al frontmatter
                path = os.path.join(self.vault_path, suggestion["path"])
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    # Agregar tag
                    if content.startswith("---"):
                        parts = content.split("---", 2)
                        fm = parts[1]
                        body = parts[2]
                        
                        # Verificar si ya tiene tags
                        if "tags:" in fm:
                            # Agregar al final de la línea de tags
                            new_fm = fm.replace(
                                "tags:",
                                f"tags: ['#{suggestion['tag']}',"
                            )
                        else:
                            new_fm = fm + f"\ntags: ['#{suggestion['tag']}']"
                        
                        new_content = f"---\n{new_fm}---{body}"
                        
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(new_content)
                        
                        print(f"✅ Tag agregado: {suggestion['path']} → #{suggestion['tag']}")
                        applied += 1
                except Exception as e:
                    print(f"❌ Error agregando tag: {e}")
        
        print(f"\n✅ Aplicadas {applied} sugerencias")
        
    def generate_plan(self) -> dict:
        """Genera plan de organización."""
        self.scan()
        self.analyze_structure()
        self.suggest_tags()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "total_notes": len(self.notes),
            "total_suggestions": len(self.suggestions),
            "by_type": {
                "move": len([s for s in self.suggestions if s["type"] == "move"]),
                "add_tag": len([s for s in self.suggestions if s["type"] == "add_tag"]),
                "add_link": len([s for s in self.suggestions if s["type"] == "add_link"])
            },
            "suggestions": self.suggestions[:50]  # Limitar a 50
        }
    
    def save_plan(self, format: str = "markdown"):
        """Guarda el plan de organización."""
        plan = self.generate_plan()
        
        if format == "json":
            filepath = os.path.join(
                self.vault_path, 
                "REPORTES", 
                f"organization_plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            )
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(plan, f, indent=2, ensure_ascii=False)
        
        elif format == "markdown":
            filepath = os.path.join(
                self.vault_path, 
                "REPORTES", 
                f"organization_plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
            )
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(f"# 📦 Plan de Organización del Vault\n\n")
                f.write(f"**Fecha:** {plan['timestamp']}\n\n")
                f.write(f"## 📊 Resumen\n")
                f.write(f"- **Notas analizadas:** {plan['total_notes']}\n")
                f.write(f"- **Sugerencias totales:** {plan['total_suggestions']}\n\n")
                f.write(f"### Por tipo:\n")
                f.write(f"- 🔄 Movimientos: {plan['by_type']['move']}\n")
                f.write(f"- 🏷️  Agregar tags: {plan['by_type']['add_tag']}\n")
                f.write(f"- 🔗 Agregar enlaces: {plan['by_type']['add_link']}\n\n")
                
                f.write(f"## 📝 Sugerencias\n\n")
                
                # Movimientos
                moves = [s for s in plan['suggestions'] if s['type'] == 'move']
                if moves:
                    f.write(f"### 🔄 Movimientos sugeridos\n")
                    for s in moves[:15]:
                        f.write(f"- `{s['from']}` → `{s['to']}`\n")
                        f.write(f"  - Razón: {s['reason']}\n")
                    f.write("\n")
                
                # Tags
                tags = [s for s in plan['suggestions'] if s['type'] == 'add_tag']
                if tags:
                    f.write(f"### 🏷️  Tags sugeridos\n")
                    for s in tags[:15]:
                        f.write(f"- `{s['path']}` → agregar `#{s['tag']}`\n")
                    f.write("\n")
                
                f.write(f"---\n*Usa `--apply` para aplicar los cambios (modo dry-run por defecto)*\n")
        
        print(f"✅ Plan guardado en: {filepath}")
        return filepath


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Organizador del Vault")
    parser.add_argument("--apply", action="store_true", help="Aplicar cambios (por defecto dry-run)")
    parser.add_argument("--types", nargs="+", choices=["move", "add_tag", "add_link"], 
                        help="Tipos de sugerencias a aplicar")
    parser.add_argument("--format", choices=["json", "markdown"], default="markdown")
    args = parser.parse_args()
    
    organizer = VaultOrganizer(VAULT_PATH, dry_run=not args.apply)
    organizer.save_plan(args.format)
    
    if args.apply:
        organizer.apply_suggestions(args.types)
