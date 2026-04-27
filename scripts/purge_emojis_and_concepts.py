import os
import re

def remove_emojis(text):
    # Expanded regex to catch more emojis including those in .agent/ files
    emoji_pattern = re.compile(
        '['
        '\U0001f600-\U0001f64f'  # emoticons
        '\U0001f300-\U0001f5ff'  # symbols & pictographs
        '\U0001f680-\U0001f6ff'  # transport & map symbols
        '\U0001f1e0-\U0001f1ff'  # flags (iOS)
        '\u2600-\u27bf'          # symbols & dingbats
        '\U0001f900-\U0001f9ff'  # supplemental symbols
        '\U0001f170-\U0001f251'  # enclosed alphanumeric supplement
        '\u2000-\u3300'          # General Punctuation to CJK Symbols and Punctuation (includes some symbols)
        ']+', flags=re.UNICODE)
    
    # Also manually catch common ones seen in grep
    common_emojis = [
        '📅', '📆', '✅', '❌', '🟡', '🔴', '👤', '🔒', '⚙️', '🎡', '💰', '💪', '🧠', '❤️', '🎯', '🎨', '🙏', '🌍', '🏃', '🔗'
    ]
    for e in common_emojis:
        text = text.replace(e, '')
    
    return emoji_pattern.sub('', text)

def rename_concepts(text):
    text = re.sub(r'UNICORNIO_2026', 'GLITCHBRO', text)
    text = re.sub(r'Unicornio 2026', 'GlitchBro 2026', text)
    text = re.sub(r'Plan Unicornio', 'Plan GlitchBro', text, flags=re.IGNORECASE)
    text = re.sub(r'objetivos unicornio', 'objetivos glitchbro', text, flags=re.IGNORECASE)
    return text

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = remove_emojis(content)
        new_content = rename_concepts(new_content)
        new_content = re.sub(r'  +', ' ', new_content)
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    vault_path = "/home/arrigobaggio/Obsidian/GlitchBrain"
    for root, dirs, files in os.walk(vault_path):
        # Allow .agent but skip .git
        if '.git' in dirs:
            dirs.remove('.git')
        if '.obsidian' in dirs:
            dirs.remove('.obsidian')
            
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                process_file(filepath)

if __name__ == "__main__":
    main()
