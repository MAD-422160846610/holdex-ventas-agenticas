#!/usr/bin/env python3
"""
Fix Links - Reparación masiva de enlaces rotos y notas huérfanas
"""

import re
import json
from pathlib import Path
from collections import defaultdict

VAULT = Path("/home/arrigobaggio/Obsidian/GlitchBrain")

# Mapeo de notas antiguas que probablemente no existen
NOTE_MAPPINGS = {
    # Notas de modelos mentales
    "MM Aprendizaje": "300 - 🧠 MODELOS MENTALES/MM Aprendizaje",
    "MM Constancia y el crecimiento bambú": "300 - 🧠 MODELOS MENTALES/MM Constancia y el crecimiento bambú",
    "MM Desarrollo Personal": "300 - 🧠 MODELOS MENTALES/MM Desarrollo Personal",
    "MM Kaizen filosofía": "300 - 🧠 MODELOS MENTALES/MM Kaizen filosofía",
    "MM PNL": "300 - 🧠 MODELOS MENTALES/MM PNL",
    "MM Perfeccionismo": "300 - 🧠 MODELOS MENTALES/MM Perfeccionismo",
    "MM Tiempo y Prioridades": "300 - 🧠 MODELOS MENTALES/MM Tiempo y Prioridades",
    # Notas de recetas
    "RECETA Bizcocho de limón": "200 - 🌍 MEMORIA DIGITAL/221 - 🥙NUTRICIÓN/RECETA Bizcocho de limón",
    "RECETA tortilla de patata española": "200 - 🌍 MEMORIA DIGITAL/221 - 🥙NUTRICIÓN/RECETA tortilla de patata española",
    # Otras notas comunes
    "000 Mi zettelkasten": "200 - 🌍 MEMORIA DIGITAL/202 - 🧠🧱 CEREBRO DIGITAL/notas SILO MOC HUB",
    "000 Nutrición": "200 - 🌍 MEMORIA DIGITAL/221 - 🥙NUTRICIÓN/000 Nutrición",
    "000 Relax": "200 - 🌍 MEMORIA DIGITAL/272 - 🌅 RELAX/000 Relax",
    "Mi histórico fondos indexados": "200 - 🌍 MEMORIA DIGITAL/research/Mi histórico fondos indexados",
}

# Notas huérfanas que podemos conectar
ORPHAN_CONNECTIONS = {
    "MI VISIÓN.md": [
        "000 - 🧭 VISIÓN - OBJETIVOS/PRINCIPIOS, PILARES.md",
        "000 - 🧭 VISIÓN - OBJETIVOS/202502 RUEDA VIDA.md",
    ],
    "VISION A 5,10,25 AÑOS.md": [
        "000 - 🧭 VISIÓN - OBJETIVOS/MI VISIÓN.md",
        "000 - 🧭 VISIÓN - OBJETIVOS/YYYY OBJETIVOS.md",
    ],
    "YYYY+3 OBJETIVOS A 3 AÑOS.md": [
        "000 - 🧭 VISIÓN - OBJETIVOS/YYYY OBJETIVOS.md",
        "000 - 🧭 VISIÓN - OBJETIVOS/VISION A 5,10,25 AÑOS.md",
    ],
    "YYYY Propósito año nuevo.md": [
        "000 - 🧭 VISIÓN - OBJETIVOS/MI VISIÓN.md",
        "000 - 🧭 VISIÓN - OBJETIVOS/YYYY OBJETIVOS.md",
    ],
    "TAREAS A REALIZAR ALGÚN DÍA.md": ["000 - 🧭 VISIÓN - OBJETIVOS/YYYY OBJETIVOS.md"],
    "yyyy Balance año.md": [
        "000 - 🧭 VISIÓN - OBJETIVOS/YYYY OBJETIVOS.md",
        "000 - 🧭 VISIÓN - OBJETIVOS/202502 RUEDA VIDA.md",
    ],
    "MCP-OBSIDIAN-GUIDE.md": ["000 - 🧭 VISIÓN - OBJETIVOS/OBSIDIAN-3.1-STATUS.md"],
}


def fix_dangling_links():
    """Repara enlaces rotos comunes"""
    fixed_count = 0

    # Find all markdown files
    for md_file in VAULT.rglob("*.md"):
        if ".obsidian" in str(md_file):
            continue

        try:
            content = md_file.read_text(encoding="utf-8")
            original_content = content

            # Fix image links (remove or comment out)
            content = re.sub(
                r"!\[\[Pasted image [^\]]+\]\]",
                "<!-- Imagen eliminada durante limpieza -->",
                content,
            )

            # Fix broken note references using mappings
            for old_name, new_path in NOTE_MAPPINGS.items():
                if old_name in content:
                    # Extract just the note name without path
                    note_name = new_path.split("/")[-1].replace(".md", "")
                    content = content.replace(f"[[{old_name}]]", f"[[{note_name}]]")
                    fixed_count += 1

            # Write back if changed
            if content != original_content:
                md_file.write_text(content, encoding="utf-8")
                print(f"  ✓ Fixed links in: {md_file.name}")

        except Exception as e:
            print(f"  ✗ Error with {md_file.name}: {e}")

    return fixed_count


def add_orphan_connections():
    """Conecta notas huérfanas con notas relacionadas"""
    fixed_count = 0

    for orphan_name, connections in ORPHAN_CONNECTIONS.items():
        # Find the orphan file
        for md_file in VAULT.rglob(orphan_name):
            try:
                content = md_file.read_text(encoding="utf-8")

                # Add "## 🔗 Relacionado" section if not exists
                if "## 🔗 Relacionado" not in content:
                    content += "\n\n## 🔗 Relacionado\n\n"

                # Add connections
                for connection in connections:
                    note_name = connection.split("/")[-1].replace(".md", "")
                    if f"[[{note_name}]]" not in content:
                        content += f"- [[{note_name}]]\n"
                        fixed_count += 1

                # Write back
                md_file.write_text(content, encoding="utf-8")
                print(f"  ✓ Connected orphan: {orphan_name}")

            except Exception as e:
                print(f"  ✗ Error with {orphan_name}: {e}")

    return fixed_count


def cleanup_empty_sections():
    """Limpia secciones vacías y formato inconsistente"""
    fixed_count = 0

    for md_file in VAULT.rglob("*.md"):
        if ".obsidian" in str(md_file):
            continue

        try:
            content = md_file.read_text(encoding="utf-8")
            original_content = content

            # Remove empty sections
            content = re.sub(
                r"##\s+[^\n]+\n\n\s*\n",
                "## Contenido\n\n*Este contenido será completado próximamente.*\n\n",
                content,
            )

            # Fix inconsistent header spacing
            content = re.sub(r"\n#{1,6}\s", "\n\n#", content)

            # Write back if changed
            if content != original_content:
                md_file.write_text(content, encoding="utf-8")
                fixed_count += 1

        except Exception as e:
            pass

    return fixed_count


def generate_link_report():
    """Genera un reporte de los enlaces actuales"""
    # Count links in each file
    link_counts = defaultdict(int)

    for md_file in VAULT.rglob("*.md"):
        if ".obsidian" in str(md_file):
            continue

        try:
            content = md_file.read_text(encoding="utf-8")
            links = re.findall(r"\[\[([^\]|]+)", content)
            link_counts[md_file.name] = len(links)
        except:
            pass

    # Find files with most links
    top_linked = sorted(link_counts.items(), key=lambda x: x[1], reverse=True)[:20]

    print("\n📊 Archivos con más enlaces:")
    for name, count in top_linked:
        print(f"  {count:3d} links - {name}")

    return link_counts


def main():
    print("🔧 Iniciando reparación masiva de enlaces...\n")

    print("1. Reparando enlaces rotos...")
    fixed_links = fix_dangling_links()
    print(f"   Reparados: {fixed_links}\n")

    print("2. Conectando notas huérfanas...")
    fixed_orphans = add_orphan_connections()
    print(f"   Conectadas: {fixed_orphans}\n")

    print("3. Limpiando secciones vacías...")
    fixed_sections = cleanup_empty_sections()
    print(f"   Limpiadas: {fixed_sections}\n")

    print("4. Generando reporte de enlaces...")
    link_counts = generate_link_report()

    print(f"\n✅ Reparación completada!")
    print(f"   - Enlaces reparados: {fixed_links}")
    print(f"   - Notas conectadas: {fixed_orphans}")
    print(f"   - Secciones limpias: {fixed_sections}")


if __name__ == "__main__":
    main()
