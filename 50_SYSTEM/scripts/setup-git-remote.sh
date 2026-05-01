#!/bin/bash
# ============================================
# Setup Git Remote para Segundo Cerebro
# ============================================
# Este script configura el repositorio remoto
# Ejecutar DESPUÉS de crear el repo en GitHub

# --- CONFIGURACIÓN ---
# Cambiar por tu usuario de GitHub
GITHUB_USER="TU_USUARIO_AQUI"
REPO_NAME="second-brain"

# --- VERIFICAR ---
echo "🔍 Verificando configuración de Git..."
git config user.name || { echo "❌ Configurar: git config user.name 'Tu Nombre'"; exit 1; }
git config user.email || { echo "❌ Configurar: git config user.email 'tu@email.com'"; exit 1; }

# --- CREAR REPO EN GITHUB (requiere gh CLI) ---
if command -v gh &> /dev/null; then
    echo "📦 Creando repositorio en GitHub..."
    gh repo create "$GITHUB_USER/$REPO_NAME" --private --source=. --remote=origin --push
else
    echo "⚠️  gh CLI no encontrado."
    echo ""
    echo "📋 Instrucciones manuales:"
    echo "1. Ir a https://github.com/new"
    echo "2. Crear repo: $REPO_NAME (privado)"
    echo "3. Ejecutar:"
    echo "   git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi

echo ""
echo "✅ Setup completo!"
echo "📱 Para ver notas en celular:"
echo "   - iOS: GitHub Mobile app o Working Copy"
echo "   - Android: GitHub Mobile app o MGit"
echo "   - Opción premium: Obsidian Sync ($10/mes)"
