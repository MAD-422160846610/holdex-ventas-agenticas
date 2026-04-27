import os
import unicodedata
import sys

def normalize_vault(root_path, dry_run=True):
    print(f"{'Dry Run: ' if dry_run else 'Executing: '}Normalizing vault to NFC at {root_path}")
    count = 0
    errors = 0
    for root, dirs, files in os.walk(root_path, topdown=False):
        for name in files + dirs:
            full_path = os.path.join(root, name)
            nfc_name = unicodedata.normalize('NFC', name)
            if name != nfc_name:
                new_path = os.path.join(root, nfc_name)
                print(f"Match: {name} -> {nfc_name}")
                count += 1
                if not dry_run:
                    try:
                        if os.path.exists(new_path) and name.lower() == nfc_name.lower():
                            if os.path.getsize(full_path) < os.path.getsize(new_path):
                                os.remove(full_path)
                            else:
                                os.replace(full_path, new_path)
                        else:
                            os.rename(full_path, new_path)
                    except Exception as e:
                        print(f"  Error: {e}")
                        errors += 1
    print(f"\nFinished. Normalizations: {count}. Errors: {errors}")

if __name__ == "__main__":
    path = "/home/arrigobaggio/Obsidian/GlitchBrain"
    is_dry = "--execute" not in sys.argv
    normalize_vault(path, dry_run=is_dry)
