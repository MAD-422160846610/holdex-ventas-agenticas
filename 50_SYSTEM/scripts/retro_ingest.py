import os
import re
import unicodedata

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
TARGET_DIRS = ["100 - ✅ PROYECTOS", "200 - 🌍 MEMORIA DIGITAL"]

def normalize_nfc(text):
    return unicodedata.normalize('NFC', text)

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = normalize_nfc(content)
    
    # Check for frontmatter
    has_frontmatter = content.startswith("---")
    
    if has_frontmatter:
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            body = parts[2]
            
            if "aliases:" not in frontmatter:
                # Add aliases based on filename
                filename = os.path.basename(file_path).replace(".md", "")
                # Generic alias cleanup (remove leading numbers, emojis for alias)
                clean_alias = re.sub(r'^[0-9\s\-✅🧭🌍🧠🧱]+', '', filename).strip()
                new_frontmatter = frontmatter.strip() + f"\naliases: ['{clean_alias}']\n"
                new_content = f"---\n{new_frontmatter}---\n{body}"
                return True, new_content, clean_alias
    else:
        # Create frontmatter if missing for core notes
        filename = os.path.basename(file_path).replace(".md", "")
        clean_alias = re.sub(r'^[0-9\s\-✅🧭🌍🧠🧱]+', '', filename).strip()
        new_content = f"---\naliases: ['{clean_alias}']\n---\n\n" + content
        return True, new_content, clean_alias

    return False, content, None

def main():
    print("🚀 Iniciando Ingesta Retroactiva (Protocolo Karpathy)...")
    processed_count = 0
    new_aliases = []
    
    for target in TARGET_DIRS:
        abs_target = os.path.join(VAULT_PATH, target)
        for root, dirs, files in os.walk(abs_target):
            for file in files:
                if file.endswith(".md"):
                    file_path = os.path.join(root, file)
                    changed, new_content, alias = process_file(file_path)
                    if changed:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        processed_count += 1
                        if alias:
                            new_aliases.append(alias)
    
    print(f"✅ Proceso finalizado. Notas actualizadas: {processed_count}")
    if new_aliases:
        print(f"📌 Se detectaron {len(new_aliases)} nuevos conceptos para el índice.")

if __name__ == "__main__":
    main()
