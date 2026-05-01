import csv
import os

data = [
    ["Item", "Cant.", "Est. Unit (USD)", "Est. Total", "Precio Real", "Estado", "Notas"],
    ["Desktop Dell OptiPlex (Admin)", 4, 950, 3800, "", "Pendiente", "Gerencia/Admin"],
    ["Laptop ThinkPad T14 (Campo)", 6, 1400, 8400, "", "Pendiente", "Inspectores"],
    ["Servidor NAS Synology DS923+", 1, 850, 850, "", "Pendiente", ""],
    ["Discos WD Red 4TB (NAS)", 4, 120, 480, "", "Pendiente", ""],
    ["Monitores 24\" IPS", 7, 130, 910, "", "Pendiente", ""],
    ["Kit Teclado + Mouse", 7, 60, 420, "", "Pendiente", ""],
    ["Impresora Laser Oficina", 1, 550, 550, "", "Pendiente", ""],
    ["UPS 1500VA", 3, 280, 840, "", "Pendiente", ""],
    ["Escritorio Ejecutivo", 1, 700, 700, "", "Pendiente", "Gerencia"],
    ["Escritorios Operativos", 4, 400, 1600, "", "Pendiente", "Admin/Logística"],
    ["Sillas Ergonómicas", 8, 300, 2400, "", "Pendiente", ""],
    ["Mesa de Reuniones", 1, 800, 800, "", "Pendiente", ""],
    ["Sillas de Reunión", 6, 200, 1200, "", "Pendiente", ""],
    ["Router / Switch Managed", 1, 500, 500, "", "Pendiente", ""],
    ["Access Points WiFi", 3, 150, 450, "", "Pendiente", ""],
    ["Kit Cámaras Seguridad", 1, 500, 500, "", "Pendiente", ""],
    ["Rack 9U / Instalación", 1, 400, 400, "", "Pendiente", ""]
]

file_path = "/home/arrigobaggio/Obsidian/GlitchBrain/10_PROJECTS/ITB Maritime Services (Cliente)/LISTA-COMPRAS-ITB.csv"

with open(file_path, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerows(data)

print(f"Archivo CSV creado en: {file_path}")
