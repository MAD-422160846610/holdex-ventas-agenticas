#!/usr/bin/env python3
"""
Script de backup automático del vault usando Git.
Crea commits periódicos con cambios detectados.
"""

import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

VAULT_PATH = "/home/arrigobaggio/Obsidian/GlitchBrain"
BACKUP_BRANCH = "backup/auto"

def run_command(command, cwd=None):
    """Ejecuta un comando y retorna el resultado."""
    try:
        result = subprocess.run(
            command,
            cwd=cwd or VAULT_PATH,
            shell=True,
            capture_output=True,
            text=True
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return -1, "", str(e)

def init_git_if_needed():
    """Inicializa repositorio Git si no existe."""
    git_dir = os.path.join(VAULT_PATH, ".git")
    if not os.path.exists(git_dir):
        print("🔧 Inicializando repositorio Git para backup...")
        run_command("git init")
        run_command(f"git checkout -b {BACKUP_BRANCH}")
        
        # Crear .gitignore para ignorar archivos innecesarios
        gitignore_content = """.obsidian/
.obsidian.backup_*/
*.tmp
*.swp
.DS_Store
"""
        with open(os.path.join(VAULT_PATH, ".gitignore"), "w") as f:
            f.write(gitignore_content)
        
        print("✅ Repositorio Git inicializado")
        return True
    return False

def has_changes():
    """Verifica si hay cambios sin commitear."""
    code, stdout, stderr = run_command("git status --porcelain")
    return len(stdout.strip()) > 0

def get_changes_summary():
    """Obtiene un resumen de los cambios."""
    code, stdout, stderr = run_command("git diff --stat")
    if code == 0 and stdout:
        lines = stdout.strip().split('\n')
        if lines:
            return lines[-1]  # Última línea con resumen
    return "Cambios detectados"

def create_backup_commit():
    """Crea un commit de backup."""
    today = datetime.now().strftime("%Y-%m-%d %H:%M")
    commit_message = f"backup(auto): {today}"
    
    # Agregar todos los cambios
    run_command("git add .")
    
    # Crear commit
    code, stdout, stderr = run_command(f'git commit -m "{commit_message}"')
    
    if code == 0:
        print(f"✅ Backup creado: {commit_message}")
        return True
    else:
        print(f"❌ Error creando backup: {stderr}")
        return False

def push_to_remote():
    """Hace push al remote si existe."""
    code, stdout, stderr = run_command("git remote -v")
    if code == 0 and stdout:
        print("📤 Haciendo push al remote...")
        run_command(f"git push origin {BACKUP_BRANCH}")
    else:
        print("ℹ️  No hay remote configurado. Backup solo local.")

def main():
    """Función principal."""
    print("🔄 Iniciando backup automático del vault...")
    
    # Inicializar Git si es necesario
    init_git_if_needed()
    
    # Verificar cambios
    if not has_changes():
        print("✅ No hay cambios para backup.")
        return
    
    print("📝 Cambios detectados:")
    summary = get_changes_summary()
    print(f"   {summary}")
    
    # Crear commit
    if create_backup_commit():
        # Intentar push
        push_to_remote()
        print("🎉 Backup completado exitosamente.")
    else:
        print("⚠️  Backup falló. Revisar errores.")

if __name__ == "__main__":
    main()