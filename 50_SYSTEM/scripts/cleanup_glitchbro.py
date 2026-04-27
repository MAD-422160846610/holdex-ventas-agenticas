import os
import shutil

VAULT_ROOT = "/home/arrigobaggio/Obsidian/GlitchBrain"

def cleanup():
    print(f"--- Iniciando Limpieza GlitchbroPegasus en {VAULT_ROOT} ---")
    
    # 1. Eliminar carpetas de recursión en 50_SYSTEM/scripts
    scripts_path = os.path.join(VAULT_ROOT, "50_SYSTEM", "scripts")
    if os.path.exists(scripts_path):
        for root, dirs, files in os.walk(scripts_path):
            for d in dirs:
                if d.startswith("_dup"):
                    full_path = os.path.join(root, d)
                    print(f"Eliminando carpeta basura: {full_path}")
                    shutil.rmtree(full_path)
    
    # 2. Eliminar archivos duplicados (_dup.md, _1.md)
    for root, dirs, files in os.walk(VAULT_ROOT):
        if ".git" in root: continue
        
        for file in files:
            if "_dup" in file or "_1" in file:
                file_path = os.path.join(root, file)
                # Intentar encontrar el original
                original_name = file.replace("_dup", "").replace("_1", "")
                original_path = os.path.join(root, original_name)
                
                if os.path.exists(original_path) and original_path != file_path:
                    print(f"Eliminando duplicado redundante: {file}")
                    os.remove(file_path)
                elif "_dup" in file and "_1" in file: # Caso de doble error
                    print(f"Eliminando basura extrema: {file}")
                    os.remove(file_path)

if __name__ == "__main__":
    cleanup()
