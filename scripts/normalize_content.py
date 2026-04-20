import os
import unicodedata
import sys

def normalize_content(root_path, dry_run=True):
    print(f"{'Dry Run: ' if dry_run else 'Executing: '}Normalizing file content to NFC at {root_path}")
    count = 0
    errors = 0
    
    for root, dirs, files in os.walk(root_path):
        if ".obsidian" in root or ".git" in root:
            continue
            
        for name in files:
            if not name.endswith(".md"):
                continue
                
            full_path = os.path.join(root, name)
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                nfc_content = unicodedata.normalize('NFC', content)
                
                if content != nfc_content:
                    count += 1
                    if not dry_run:
                        with open(full_path, 'w', encoding='utf-8') as f:
                            f.write(nfc_content)
                        print(f"Fixed: {full_path}")
                    else:
                        print(f"Would fix: {full_path}")
            except Exception as e:
                print(f"Error processing {full_path}: {e}")
                errors += 1
                
    print(f"\nFinished. Files changed: {count}. Errors: {errors}")

if __name__ == "__main__":
    path = "/home/arrigobaggio/Obsidian/GlitchBrain"
    is_dry = "--execute" not in sys.argv
    normalize_content(path, dry_run=is_dry)
