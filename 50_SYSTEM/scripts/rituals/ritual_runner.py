#!/usr/bin/env python3
"""
Ritual Runner - Orquestador central de rituales ágiles para Obsidian 3.1

Usage:
    python3 ritual_runner.py --daily        # Ejecuta daily standup
    python3 ritual_runner.py --planning      # Ejecuta sprint planning
    python3 ritual_runner.py --control       # Ejecuta control
    python3 ritual_runner.py --review        # Ejecuta sprint review
    python3 ritual_runner.py --all           # Ejecuta todos los rituales
"""

import argparse
import os
import sys
import subprocess
import datetime
from pathlib import Path

# Configuración
VAULT_PATH = Path("/home/arrigobaggio/Obsidian/GlitchBrain")
SCRIPTS_PATH = VAULT_PATH / "scripts" / "rituals"
NOTIFY = True  # Activar notificaciones


def notify(title: str, message: str, urgency: str = "normal") -> None:
    """Envía notificación del sistema."""
    if not NOTIFY:
        return

    # Map urgency to notify-send level
    urgency_map = {"low": "low", "normal": "normal", "critical": "critical"}

    try:
        subprocess.run(
            [
                "notify-send",
                "-u",
                urgency_map.get(urgency, "normal"),
                "-i",
                "obsidian",
                title,
                message,
            ],
            check=False,
        )
    except Exception as e:
        print(f"[WARN] No se pudo enviar notificación: {e}")


def get_sprint_number() -> int:
    """Calcula el número de sprint actual (quincenal desde 2026-01-01)."""
    start_date = datetime.date(2026, 1, 1)
    today = datetime.date.today()
    days = (today - start_date).days
    sprint = (days // 14) + 1
    return sprint


def run_daily() -> str:
    """Ejecuta el daily standup."""
    print("📋 Ejecutando Daily Standup...")

    # Importar y ejecutar daily
    sys.path.insert(0, str(SCRIPTS_PATH))
    from daily_standup import create_daily_note

    result = create_daily_note(VAULT_PATH)

    if result:
        notify("✅ Daily Lista", f"Nota diaria {datetime.date.today()} creada", "low")
        print(f"✓ Daily creada: {result}")
    else:
        notify("⚠️ Daily Error", "No se pudo crear la daily", "critical")

    return result


def run_planning() -> str:
    """Ejecuta el sprint planning."""
    print("📅 Ejecutando Sprint Planning...")

    sprint_num = get_sprint_number()

    sys.path.insert(0, str(SCRIPTS_PATH))
    from sprint_planning import create_sprint_planning

    result = create_sprint_planning(VAULT_PATH, sprint_num)

    if result:
        notify(
            f"📅 Sprint {sprint_num} Planning",
            "Sprint planning creado - Define tus objetivos",
            "normal",
        )
        print(f"✓ Sprint Planning creado: {result}")
    else:
        notify("⚠️ Planning Error", "No se pudo crear el planning", "critical")

    return result


def run_control() -> str:
    """Ejecuta el control diario."""
    print("🔍 Ejecutando Control...")

    sys.path.insert(0, str(SCRIPTS_PATH))
    from control import run_control_check

    result = run_control_check(VAULT_PATH)

    if result:
        notify(
            "🔍 Control Completado",
            f"Tareas pendientes: {result.get('pending', 0)} | Bloqueadas: {result.get('blocked', 0)}",
            "low",
        )
        print(f"✓ Control ejecutado: {result}")
    else:
        notify("⚠️ Control Error", "No se pudo ejecutar el control", "normal")

    return result


def run_review() -> str:
    """Ejecuta el sprint review."""
    print("📊 Ejecutando Sprint Review...")

    sprint_num = get_sprint_number()

    sys.path.insert(0, str(SCRIPTS_PATH))
    from sprint_review import create_sprint_review

    result = create_sprint_review(VAULT_PATH, sprint_num)

    if result:
        notify(
            f"📊 Sprint {sprint_num} Review",
            "Review listo - Revisa tu retrospectiva",
            "normal",
        )
        print(f"✓ Sprint Review creado: {result}")
    else:
        notify("⚠️ Review Error", "No se pudo crear el review", "critical")

    return result


def show_help():
    """Muestra ayuda de uso."""
    help_text = """
🚀 Ritual Runner - Obsidian 3.1

Usage:
    python3 ritual_runner.py [OPTIONS]

Options:
    --daily       Ejecuta Daily Standup (Lun-Vie 8:00)
    --planning    Ejecuta Sprint Planning (Domingo 18:00, quincenal)
    --control     Ejecuta Control Diario (automático)
    --review      Ejecuta Sprint Review (Viernes 17:00)
    --all         Ejecuta todos los rituales
    --no-notify   Desactiva notificaciones del sistema
    -h, --help    Muestra esta ayuda

Ejemplos:
    python3 ritual_runner.py --daily
    python3 ritual_runner.py --planning
    python3 ritual_runner.py --control
    python3 ritual_runner.py --review --no-notify
"""
    print(help_text)


def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--daily", action="store_true")
    parser.add_argument("--planning", action="store_true")
    parser.add_argument("--control", action="store_true")
    parser.add_argument("--review", action="store_true")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--no-notify", action="store_true")
    parser.add_argument("-h", "--help", action="store_true")

    args = parser.parse_args()

    global NOTIFY
    if args.no_notify:
        NOTIFY = False

    if args.help:
        show_help()
        return

    # Si no hay argumentos, mostrar ayuda
    if not any([args.daily, args.planning, args.control, args.review, args.all]):
        show_help()
        return

    results = {}

    if args.all or args.daily:
        results["daily"] = run_daily()

    if args.all or args.planning:
        results["planning"] = run_planning()

    if args.all or args.control:
        results["control"] = run_control()

    if args.all or args.review:
        results["review"] = run_review()

    print("\n" + "=" * 50)
    print("📊 Resumen de Rituales")
    print("=" * 50)
    for ritual, result in results.items():
        status = "✓" if result else "✗"
        print(f"  {status} {ritual.upper()}: {result or 'ERROR'}")


if __name__ == "__main__":
    main()
