import os
import re

VAULT_ROOT = "/home/arrigobaggio/Obsidian/GlitchBrain"
FILES_TO_CLEAN = [
    "index.md",
    "00_VISION/EVALUACION_MADUREZ_PKM.md",
    "00_VISION/GLITCH_SYSTEM.md",
    "30_RESOURCES/ESTUDIOS/GLITCHBRO/00_MASTER_PLAN.md",
    "20_AREAS/TECNOLOGIA/PYTHON.md",
    "20_AREAS/TECNOLOGIA/LINUX.md"
]

def remove_emojis(text):
    return "".join(c for c in text if c.isalnum() or c.isspace() or c in ".-_()[]#|:").strip()

def clean_metadata_and_titles():
    for rel_path in FILES_TO_CLEAN:
        abs_path = os.path.join(VAULT_ROOT, rel_path)
        if not os.path.exists(abs_path): continue
        
        with open(abs_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        new_lines = []
        is_frontmatter = False
        
        for line in lines:
            # Detectar frontmatter
            if line.strip() == "---":
                is_frontmatter = not is_frontmatter
                new_lines.append(line)
                continue
            
            # Si es frontmatter o es un título (# ), limpiamos emojis
            if is_frontmatter or line.startswith("# "):
                new_lines.append(remove_emojis(line) + "\n")
            # También limpiamos emojis en encabezados de sección ##
            elif line.startswith("## "):
                new_lines.append(remove_emojis(line) + "\n")
            else:
                new_lines.append(line)
                
        with open(abs_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Limpia: {rel_path}")

if __name__ == "__main__":
    clean_metadata_and_titles()
