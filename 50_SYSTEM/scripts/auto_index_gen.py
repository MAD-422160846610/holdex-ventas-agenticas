import os

VAULT_ROOT = "/home/arrigobaggio/Obsidian/GlitchBrain"
FOLDERS_TO_INDEX = {
    "10_PROJECTS": "Indice de Proyectos",
    "20_AREAS": "Indice de Areas",
    "30_RESOURCES": "Indice de Recursos",
    "52_ATTACHMENTS": "Indice de Anexos"
}

def generate_indices():
    for folder, title in FOLDERS_TO_INDEX.items():
        folder_path = os.path.join(VAULT_ROOT, folder)
        if not os.path.exists(folder_path): continue
        
        index_file = os.path.join(folder_path, f"00_{folder}_INDEX.md")
        
        files_found = []
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if file.endswith(".md") and not file.startswith("00_"):
                    # Crear wikilink relativo
                    rel_dir = os.path.relpath(root, folder_path)
                    if rel_dir == ".":
                        files_found.append(f"- [[{file[:-3]}]]")
                    else:
                        files_found.append(f"- [[{rel_dir}/{file[:-3]}]]")
        
        content = f"---\naliases: ['{title}']\ntags: ['#glitchbrain/meta', '#moc']\n---\n\n# {title}\n\n"
        content += "\n".join(sorted(files_found))
        content += "\n\n--- \n*Generado automaticamente para eliminar notas huerfanas.*"
        
        with open(index_file, 'w', encoding='utf-8') as f:
            f.writelines(content)
        print(f"Creado indice: {index_file}")

if __name__ == "__main__":
    generate_indices()
