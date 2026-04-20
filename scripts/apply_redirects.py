#!/usr/bin/env python3
import json
import re
from pathlib import Path

VAULT = Path("/home/arrigobaggio/Obsidian/GlitchBrain")
LINKS_JSON = "/tmp/vault_link_audit_final.json"


def load_redirects(path: str):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    pairs = []
    for pair in data.get("dangling_links", []):
        if isinstance(pair, list) and len(pair) >= 2:
            old = pair[0].strip()
            new = pair[1].strip()
            pairs.append((old, new))
    return pairs


def apply_once(text: str, old: str, new: str) -> str:
    # Replace wiki link syntax [[old]] if present
    text = re.sub(r"\[\[" + re.escape(old) + r"\]\]", "[[" + new + "]]", text)
    # Replace plain references to file names in text (naive)
    text = re.sub(r"\b" + re.escape(old) + r"\b", new, text)
    return text


def main():
    if not Path(LINKS_JSON).exists():
        print("No redirects file found, skipping.")
        return
    pairs = load_redirects(LINKS_JSON)
    if not pairs:
        print("No redirect pairs found.")
        return
    changed = 0
    for md in VAULT.rglob("*.md"):
        try:
            s = md.read_text(encoding="utf-8")
        except Exception:
            continue
        original = s
        for old, new in pairs:
            s = apply_once(s, old, new)
        if s != original:
            md.write_text(s, encoding="utf-8")
            changed += 1
    print(json.dumps({"redirects_applied": changed}, ensure_ascii=False))


if __name__ == "__main__":
    main()
