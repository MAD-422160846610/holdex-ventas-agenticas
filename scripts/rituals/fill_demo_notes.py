#!/usr/bin/env python3
"""
Fill Demo Notes - Rellena las notas DEMO con contenido real
"""

from pathlib import Path
from datetime import date

VAULT = Path("/home/arrigobaggio/Obsidian/GlitchBrain")

# Contenido real para cada nota DEMO
DEMO_CONTENT = {
    # CEREBRO DIGITAL notes
    "Enlace Wikilink.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#wikilink"],
        "title": "Enlaces Wikilink en Obsidian",
        "content": """# 🔗 Enlaces Wikilink en Obsidian

## ¿Qué son los Wikilinks?

Los Wikilinks son la forma nativa de conectar notas en Obsidian. Se crean usando dobles corchetes `[[nombre de la nota]]` y permiten navegar rápidamente entre notas relacionadas.

## Tipos de Wikilinks

### 1. Enlace simple
```markdown
[[Nombre de la Nota]]
```
Crea un enlace directo a la nota especificada.

### 2. Enlace con alias
```markdown
[[Nombre de la Nota|Texto visible]]
```
Muestra "Texto visible" pero enlaza a "Nombre de la Nota".

### 3. Enlace a sección específica
```markdown
[[Nombre de la Nota#Sección]]
```
Enlaza directamente a una sección de la nota.

### 4. Enlace a bloque específico
```markdown
[[Nombre de la Nota#^block-id]]
```
Enlaza a un bloque específico dentro de la nota.

## Buenas prácticas

1. **Usa nombres descriptivos**: [[Buenas Prácticas de Wikilinks]] es mejor que [[BPs]]
2. **Crea enlaces bidireccionales**: Si enlazas A→B, asegúrate de que B también enlace a A
3. **Revisa enlaces rotos**: Usa plugins como "Broken Links" para encontrar problemas
4. **Conecta ideas, no solo notas**: Los enlaces deben tener propósito

## Ejemplos de uso

### En notas diarias
```markdown
Hoy trabajé en [[Presupuesto ITB]] y me acordé de [[Principios de Finanzas]].
```

### En notas de proyectos
```markdown
Este proyecto se relaciona con [[Objetivos 2026]] y [[Mis Pilares]].
```

### En notas de conceptos
```markdown
El [[Zettelkasten Method]] me ayudó a entender [[Conexiones entre Ideas]].
```

## 🔗 Relacionado

- [[Notas]]
- [[Contenedores]]
- [[Cómo debemos nombrar las notas]]

#wikilink #obsidian #enlaces
""",
    },
    "Contenedores.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#estructura"],
        "title": "Contenedores de Información",
        "content": """# 📦 Contenedores de Información

## ¿Qué son los contenedores?

Los contenedores son las estructuras que organizan tu información. En Obsidian, entendemos tres niveles principales:

## Los 3 Niveles de Contención

### 1. 📄 Notas (Atom)
La unidad mínima de información. Una nota debe contener:
- Una idea principal
- Contenido atómico (una sola cosa)
- Enlaces a notas relacionadas
- Tags para categorización

### 2. 📁 Carpetas (Groups)
Colecciones temáticas de notas. Reglas:
- Máximo 5-7 notas por carpeta
- Nombres claros y consistentes
- Estructura jerárquica lógica
- Usar números para orden: `100-Proyectos`, `200-Memoria`

### 3. 🗂️ Sistemas (Architecture)
La estructura completa del vault:
- **PARA**: Proyectos, Áreas, Recursos, Archivo
- **Zettelkasten**: Notas permanentes, de literatura, fleeting
- **Maps of Content (MOC)**: Notas índice que conectan grupos

## Ejemplo de estructura

```
Vault/
├── 000-Vision/
├── 001-Captura/
├── 100-Proyectos/
│   ├── Proyecto A/
│   └── Proyecto B/
├── 200-Memoria/
│   ├── 202-Cerebro-Digital/
│   └── 203-Referencia/
└── 900-Diario/
```

## Principios de contención

1. **Lo específico va en la nota**
2. **Lo temático va en la carpeta**
3. **Lo estructural va en el sistema**

## 🔗 Relacionado

- [[Enlace Wikilink]]
- [[Carpetas]]
- [[notas SILO MOC HUB]]

#estructura #organizacion #contenedores
""",
    },
    "Carpetas.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#carpetas"],
        "title": "Organización por Carpetas",
        "content": """# 📁 Organización por Carpetas

## Filosofía de carpetas

Las carpetas son contenedores, no jaulas. Deben ayudarte a encontrar cosas, no limitarte.

## Estructura recomendada (PARA)

### 100 - Proyectos
Notas activas con objetivo claro y fecha fin.
```
100-Proyectos/
├── 101-Presupuesto-ITB/
├── 102-Website-Personal/
└── 103-Curso-Online/
```

### 200 - Áreas
Responsabilidades continuas sin fecha fin.
```
200-Areas/
├── 201-Salud/
├── 202-Finanzas/
└── 203-Relaciones/
```

### 300 - Recursos
Referencia temática que puede ser útil después.
```
300-Recursos/
├── 301-Programacion/
├── 302-Productividad/
└── 303-Diseno/
```

### 400 - Archivo
Proyectos completados o áreas que ya no aplican.
```
400-Archivo/
├── 2024-Proyecto-A/
└── 2024-Curso-B/
```

## Reglas de naming

1. **Números al inicio**: `100-`, `200-`, `300-`
2. **Nombres cortos**: Máximo 3-4 palabras
3. **Guiones, no espacios**: `mi-proyecto` no `mi proyecto`
4. **Consistencia**: Una convención y mantenerla

## Errores comunes

### ❌ Demasiadas carpetas
Si tienes más de 10 carpetas de nivel 1, estás sobre-organizando.

### ❌ Carpetas dentro de carpetas profundas
Máximo 3 niveles de profundidad.

### ❌ Notas en múltiples carpetas
Una nota, una carpeta. Usa enlaces para conexiones.

## 🔗 Relacionado

- [[Contenedores]]
- [[Enlace Wikilink]]
- [[notas SILO MOC HUB]]

#carpetas #organizacion #para
""",
    },
    "Etiquetas.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#tags"],
        "title": "Sistema de Etiquetas (Tags)",
        "content": """# 🏷️ Sistema de Etiquetas (Tags)

## Los tags en Obsidian

Los tags son metadatos que ayudan a categorizar y filtrar notas. Son flexibles y potentes cuando se usan correctamente.

## Convenciones de tags

### Estructura jerárquica
Usa `/` para crear jerarquías:
- `#proyecto/presupuesto-itb`
- `#idea/productividad`
- `#persona/contacto`

### Tags de estado
- `#estado/activo`
- `#estado/completado`
- `#estado/archivado`

### Tags de prioridad
- `#prioridad/alta`
- `#prioridad/media`
- `#prioridad/baja`

### Tags de tipo
- `#tipo/nota`
- `#tipo/proyecto`
- `#tipo/idea`
- `#tipo/referencia`

## Uso efectivo de tags

### En frontmatter
```yaml
tags: [proyecto, itb, finanzas]
```

### En el cuerpo
```markdown
#proyecto #activo #alta-prioridad
```

## Búsquedas con tags

### Buscar por tag
```dataview
LIST FROM #proyecto
```

### Combinar tags
```dataview
LIST FROM #proyecto AND #activo
```

### Excluir tags
```dataview
LIST FROM #proyecto WHERE !contains(tags, "archivado")
```

## Buenas prácticas

1. **Menos es más**: No sobre-etiquetar
2. **Consistencia**: Usar las mismas convenciones siempre
3. **Revisión periódica**: Limpiar tags obsoletos
4. **Combinar con carpetas**: Tags + carpetas = potencia

## 🔗 Relacionado

- [[Contenedores]]
- [[Metadatos]]
- [[Carpetas]]

#tags #etiquetas #organizacion
""",
    },
    "Metadatos.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#frontmatter"],
        "title": "Metadatos y Frontmatter",
        "content": """# 📋 Metadatos y Frontmatter

## ¿Qué es Frontmatter?

Frontmatter es metadata estructurada al inicio de una nota, entre `---`. Es leída por Obsidian y plugins como Dataview.

## Estructura básica

```yaml
---
title: Nombre de la Nota
date: 2026-03-29
tags: [tag1, tag2]
status: activo
priority: alta
---
```

## Campos recomendados

### Identificación
- `title`: Título de la nota
- `created`: Fecha de creación
- `updated`: Última actualización

### Clasificación
- `tags`: Lista de tags
- `status`: activo, pausado, completado
- `priority`: alta, media, baja

### Relaciones
- `aliases`: Nombres alternativos
- `parent`: Nota padre
- `links`: Notas relacionadas

### Proyectos
- `project`: Nombre del proyecto
- `phase`: Fase del proyecto
- `deadline`: Fecha límite

## Ejemplo completo

```yaml
---
title: Presupuesto ITB 2026
created: 2026-03-15
updated: 2026-03-29
tags: [proyecto, itb, finanzas, 2026]
status: activo
priority: alta
project: ITB
phase: planificacion
deadline: 2026-04-15
---
```

## Uso con Dataview

### Listar notas por estado
```dataview
TABLE status, priority
FROM #proyecto
WHERE status = "activo"
SORT priority
```

### Proyectos por deadline
```dataview
TABLE deadline, phase
FROM #proyecto
WHERE !completed
SORT deadline
```

## 🔗 Relacionado

- [[Etiquetas]]
- [[Contenedores]]
- [[Cómo debemos nombrar las notas]]

#frontmatter #metadatos #yaml
""",
    },
    "Notas.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#notas"],
        "title": "Tipos de Notas",
        "content": """# 📝 Tipos de Notas

## La jerarquía de notas

### 1. Notas Fleeting (Capturas rápidas)
- **Propósito**: Capturar ideas antes de que se pierdan
- **Duración**: Temporal (1-2 días)
- **Contenido**: Crudo, sin procesar
- **Ubicación**: Inbox o captura rápida

### 2. Notas Literatura
- **Propósito**: Resumir y procesar información consumida
- **Duración**: Semi-permanente
- **Contenido**: Resúmenes de libros, artículos, videos
- **Fuente**: Externa

### 3. Notas Permanent
- **Propósito**: Ideas atómicas conectadas
- **Duración**: Permanente
- **Contenido**: Una idea principal, bien desarrollada
- **Características**:
  - Título descriptivo
  - Múltiples conexiones
  - Auto-contenida
  - Útil sin contexto externo

## Características de buena notas

### Título claro
✅ `Cómo funciona el sistema inmunológico`
❌ `Nota sobre sistema inmune`

### Contenido atómico
✅ Una idea principal por nota
❌ Múltiples ideas mezcladas

### Enlaces significativos
✅ Enlaces que muestran relaciones
❌ Enlaces por conectar

### Tags relevantes
✅ Tags que aportan valor de búsqueda
❌ Tags genéricos como `#nota`

## Plantilla básica

```markdown
---
title: [Título descriptivo]
created: [fecha]
tags: [tags relevantes]
---

# [Título]

## Concepto principal
[Una idea atómica bien explicada]

## Contexto
[Por qué es importante, cómo se relaciona]

## Ejemplos
[3-5 ejemplos prácticos]

## 🔗 Relacionado
- [[Nota relacionada 1]]
- [[Nota relacionada 2]]
```

## 🔗 Relacionado

- [[Enlace Wikilink]]
- [[Cómo debemos nombrar las notas]]
- [[Líneas de pensamiento o conocimiento]]

#notas #zettelkasten #permanentes
""",
    },
    "Cómo debemos nombrar las notas.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#naming"],
        "title": "Convenciones de Nomenclatura",
        "content": """# 📛 Convenciones de Nomenclatura de Notas

## Reglas de oro

### 1. Título descriptivo, no genérico
- ❌ `Nota sobre productividad`
- ✅ `Los 5 principios de la productividad personal`

### 2. Título en forma de pregunta o concepto
- ❌ `Finanzas personales`
- ✅ `Cómo organizar mis finanzas personales`

### 3. Evitar prefijos innecesarios
- ❌ `NOTA: Sistema inmunológico`
- ❌ `20260329 - Sistema inmunológico`
- ✅ `Cómo funciona el sistema inmunológico`

## Estructura recomendada

### Para notas permanentes
```
[Verbo] + [Sustantivo] + [Complemento]
```
- `Entender cómo funciona la memoria a largo plazo`
- `Aplicar el método Pomodoro correctamente`
- `Conectar ideas mediante el Zettelkasten`

### Para notas de proyectos
```
[Nombre Proyecto] - [Fase/Aspecto]
```
- `Presupuesto ITB - Cálculo inicial`
- `Website Personal - Diseño de navegación`

### Para notas de personas
```
[Nombre Apellido]
```
- `Juan Pérez`
- `María García - Cliente ITB`

## Formato de fechas en títulos

### Para notas diarias
```
YYYY-MM-DD
```
- `2026-03-29`

### Para notas de eventos
```
YYYY-MM-DD - [Evento]
```
- `2026-04-15 - Reunión presupuesto ITB`

## Consistencia

### Usar mayúsculas de forma consistente
- Opción A (Título): `Cómo funciona el Zettelkasten`
- Opción B (sentence): `Cómo funciona el zettelkasten`

**Elegir una y mantenerla.**

### Evitar caracteres especiales
- ❌ `Nota sobre C++ y Python 🐍`
- ✅ `Nota sobre C++ y Python`

## Ejemplos de buenas transformaciones

| Malo | Bueno |
|------|-------|
| `Presupuesto` | `Cómo calcular el presupuesto de un proyecto` |
| `Zettelkasten` | `El método Zettelkasten para segundas cerebros` |
| `Nota ITB` | `Reunión con ITB sobre inspecciones 2026` |
| `Idea` | `Conectar ideas mediante inteligencia artificial` |

## 🔗 Relacionado

- [[Notas]]
- [[Enlace Wikilink]]
- [[Contenedores]]

#naming #convenciones #organizacion
""",
    },
    "GTD Flujograma.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#gtd"],
        "title": "GTD - Flujo de trabajo",
        "content": """# 🔄 GTD - Getting Things Done (Flujograma)

## ¿Qué es GTD?

Getting Things Done es un sistema de productividad creado por David Allen. Se basa en sacar las tareas de tu mente y organizarlas en un sistema externo confiable.

## Los 5 pasos de GTD

### 1. 📥 CAPTURAR (Collect)
Todo lo que requiere tu atención entra aquí:
- Ideas repentinas
- Emails por responder
- Tareas de proyectos
- Recordatorios

**Herramientas:** Inbox físico, app de notas, email, voicemail

### 2. 🗂️ CLARIFICAR (Clarify)
Para cada captura, preguntar:
- ¿Es accionable?
  - **NO**: Archivar, basura, o referencia
  - **SI**: ¿Qué es el siguiente paso?

### 3. 📋 ORGANIZAR (Organize)
Dependiendo de la respuesta:
- **Hacer ahora** (si toma <2 minutos)
- **Delegar** (si otro puede hacerlo)
- **Posponer** (agregar a lista de siguiente paso)
- **Proyecto** (si requiere múltiples pasos)

### 4. 🔄 REVISAR (Reflect)
Revisar regularmente:
- **Diario**: Lista de "Hoy"
- **Semanal**: Revisión completa del sistema
- **Mensual**: Revisión de proyectos y objetivos

### 5. ⚡ HACER (Engage)
Elegir qué hacer basado en:
- **Contexto**: ¿Dónde estoy? ¿Qué herramientas tengo?
- **Tiempo**: ¿Cuánto tiempo tengo disponible?
- **Energía**: ¿Cuál es mi nivel de energía?
- **Prioridad**: ¿Qué es más importante?

## Flujograma visual

```
                    ┌─────────────────┐
                    │   CAPTURAR      │
                    │  (Todo entra)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ ¿ES ACCIONABLE? │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
    │     NO       │  │  ¿2 MIN O   │  │ ¿MÚLTIPLES  │
    │              │  │   MENOS?    │  │   PASOS?    │
    └───────┬──────┘  └──────┬──────┘  └──────┬──────┘
            │                │                │
    ┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
    │  BASURA,     │  │   HACER     │  │  PROYECTO   │
    │  ARCHIVO O   │  │   AHORA     │  │             │
    │ REFERENCIA   │  └─────────────┘  └─────────────┘
    └──────────────┘
```

## Implementación en Obsidian

### Listas de contexto
- `@casa` - Tareas que hago en casa
- `@oficina` - Tareas en la oficina
- `@computadora` - Necesito computadora
- `@telefono` - Necesito teléfono
- `@errands` - Fuera de casa

### Plantilla de proyecto
```markdown
---
type: proyecto
estado: activo
created: {{date}}
---

# [Nombre del Proyecto]

## Objetivo
[¿Qué éxito se ve como?]

## Siguiente Paso
- [ ] [Primer acción concreta]

## Progreso
- [ ] Fase 1
- [ ] Fase 2
- [ ] Fase 3
```

## 🔗 Relacionado

- [[Contenedores]]
- [[Etiquetas]]
- [[Notas]]

#gtd #productividad #flujo
""",
    },
    "notas SILO MOC HUB.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#zk/moc"],
        "title": "SILO, MOC y HUB",
        "content": """# 🗂️ SILO, MOC y HUB

## Tres enfoques de organización

### 1. 🏢 SILO (Vertical)
Cada tema en su propia carpeta, aislada.

```
Programacion/
├── Python/
├── JavaScript/
└── Rust/

Finanzas/
├── Inversiones/
├── Presupuesto/
└── Impuestos/
```

**Ventajas:**
- Fácil de entender
- Temas separados claros

**Desventajas:**
- Difícil conectar entre temas
- Rigidez en la estructura

---

### 2. 🗺️ MOC (Map of Content)
Notas que son principalmente listas de enlaces a otras notas.

```markdown
# MOC: Programación

## Lenguajes
- [[Python Basics]]
- [[JavaScript Avanzado]]
- [[Rust para Sistemas]]

## Conceptos
- [[Algoritmos]]
- [[Estructuras de Datos]]
- [[Patrones de Diseño]]

## Proyectos
- [[Mi App Web]]
- [[Script Automatización]]
```

**Ventajas:**
- Flexibilidad total
- Conexiones visibles
- Fácil de expandir

**Desventajas:**
- Requiere mantenimiento
- Puede crecer descontroladamente

---

### 3. 🎯 HUB (Central)
Una nota central que conecta todo.

```markdown
# HUB: Mi Cerebro Digital

## 👁️ Visión
→ [[Mi Visión]]
→ [[Objetivos 2026]]

## 🧠 Aprendizaje
→ [[MOC Programación]]
→ [[MOC Productividad]]
→ [[MOC Finanzas]]

## 📚 Referencia
→ [[MOC Recursos]]

## 📅 Diario
→ [[2026-03-29]]
→ [[2026-03-28]]
```

**Ventajas:**
- Vista panorámica
- Navegación rápida
- Punto de entrada único

**Desventajas:**
- Puede ser abrumador
- Crece muy rápido

---

## ¿Cuál usar?

### Para principiantes
Empieza con **SILO** - es el más intuitivo.

### Para crecimiento
Migra a **MOC** - es el más flexible.

### Para visión completa
Añade **HUB** - como punto de entrada.

---

## Sistema híbrido (recomendado)

1. **HUB** como página principal
2. **MOCs** para temas grandes
3. **SILO** para archivos finales
4. **Notas permanentes** como base

## 🔗 Relacionado

- [[Contenedores]]
- [[Carpetas]]
- [[Notas]]

#organizacion #moc #hub #silo
""",
    },
    "Líneas de pensamiento o conocimiento.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#thinking"],
        "title": "Líneas de Pensamiento",
        "content": """# 🧭 Líneas de Pensamiento o Conocimiento

## ¿Qué son las líneas de pensamiento?

Las líneas de pensamiento son secuencias de ideas conectadas que evolucionan a lo largo del tiempo. Son el "hilo conductor" que une múltiples notas en una narrativa coherente.

## Ejemplo visual

```
Productividad Personal
    ├─→ Métodos de organización
    │   ├─→ GTD
    │   ├─→ Pomodoro
    │   └─→ Time Blocking
    │
    ├─→ Herramientas
    │   ├─→ Obsidian
    │   ├─→ Notion
    │   └─→ Calendario
    │
    └─→ Hábitos
        ├─→ Rutinas matutinas
        ├─→ Ejercicio
        └─→ Lectura diaria
```

## Cómo crear líneas de pensamiento

### Paso 1: Identificar temas centrales
¿Cuáles son mis 3-5 áreas de interés principal?

### Paso 2: Conectar notas existentes
Buscar notas que pertenezcan a cada línea.

### Paso 3: Crear MOCs de línea
Una nota MOC para cada línea de pensamiento.

### Paso 4: Mantener actualizado
Añadir nuevas notas a la línea correcta.

## Mis líneas principales

### Línea 1: 🧠 Segundo Cerebro
- Notas sobre Zettelkasten
- Notas sobre Obsidian
- Notas sobre productividad
- Notas sobre gestión del conocimiento

### Línea 2: 💻 Tecnología
- Notas sobre programación
- Notas sobre automatización
- Notas sobre IA
- Notas sobre herramientas

### Línea 3: 📈 Crecimiento Personal
- Notas sobre hábitos
- Notas sobre mindset
- Notas sobre objetivos
- Notas sobre reflexiones

## Usos de las líneas de pensamiento

### Para aprendizaje
Ver cómo se conectan los conceptos.

### Para creación
Identificar oportunidades de contenido nuevo.

### Para revisión
Verificar que no haya huecos en mi conocimiento.

### Para proyectos
Encontrar ideas relacionadas rápidamente.

## Ejemplo práctico

**Pregunta:** ¿Qué sé sobre automatización?

**Línea de pensamiento:**
1. [[Automatización Basics]] → Definición y conceptos
2. [[Herramientas de Automatización]] → Python, Zapier, IFTTT
3. [[Automatización en Obsidian]] → Scripts, plugins
4. [[Proyectos de Automatización]] → Aplicaciones prácticas

## 🔗 Relacionado

- [[notas SILO MOC HUB]]
- [[Enlace Wikilink]]
- [[Contenedores]]

#lineas #pensamiento #conocimiento #thinking
""",
    },
    "Enlace Markdown.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#markdown"],
        "title": "Enlaces en Markdown",
        "content": """# 📎 Enlaces en Markdown

## Tipos de enlaces en Obsidian

### 1. Wikilinks (Obsidian)
La forma nativa de Obsidian:
```markdown
[[Nombre de Nota]]
[[Nombre de Nota|Texto alternativo]]
[[Nombre de Nota#Sección]]
```

### 2. Enlaces Markdown estándar
Formato compatible con otros editores:
```markdown
[Texto visible](URL)
[Texto](ruta/archivo.md)
```

### 3. Enlaces a encabezados
```markdown
[[Mi Nota#Mi Encabezado]]
```

### 4. Enlaces a bloques
```markdown
[[Mi Nota#^bloque-id]]
```

## Cuándo usar cada uno

### Usa Wikilinks para:
- Notas internas del vault
- Conexiones que pueden cambiar
- Enlaces bidireccionales

### Usa Markdown links para:
- URLs externas
- Links a recursos online
- Compatibilidad con otros editores

## Buenas prácticas

1. **Texto descriptivo**: `[Cómo tomar notas](...)` no `[click aquí](...)`
2. **Enlazar conceptos**: No enlaces genéricos
3. **Bidireccional**: Si A enlaza a B, B debería enlazar a A
4. **Revisar periódicamente**: Buscar enlaces rotos

## Ejemplos

### Enlace interno simple
```markdown
Ver [[Métodos de Productividad]] para más detalles.
```

### Enlace con alias
```markdown
Lee mi [[Nota sobre GTD|guía de GTD]] para empezar.
```

### Enlace externo
```markdown
Más info en [Sitio oficial de Obsidian](https://obsidian.md).
```

### Múltiples enlaces
```markdown
Relacionado con:
- [[Enlace Wikilink]]
- [[Notas]]
- [[Contenedores]]
```

## 🔗 Relacionado

- [[Enlace Wikilink]]
- [[Notas]]

#markdown #enlaces #formato
""",
    },
    "Buscador.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#busqueda"],
        "title": "Técnicas de Búsqueda",
        "content": """# 🔍 Técnicas de Búsqueda en Obsidian

## Búsqueda básica

### Por texto
Escribe directamente en la barra de búsqueda:
- `productividad` - Encuentra notas con esa palabra
- `"sistema inmunológico"` - Búsqueda exacta

### Por ruta
```
path:"100-Proyectos"
path:"*.md"
```

## Búsqueda avanzada

### Por tag
```
tag:#proyecto
tag:#activo
```

### Por frontmatter
```
status:activo
priority:alta
```

### Por fecha
```
created:2026-03-*
file.day:monday
```

## Operators

### AND
```
productividad AND obsidian
tag:#proyecto AND status:activo
```

### OR
```
python OR javascript
tag:#idea OR tag:#proyecto
```

### NOT
```
productividad -herramientas
-tag:#archivado
```

## Búsquedas guardadas (con Dataview)

### Proyectos activos
```dataview
TABLE priority, deadline
FROM #proyecto
WHERE status = "activo"
SORT priority
```

### Notas sin conectar
```dataview
LIST
FROM ""
WHERE length(file.inlinks) = 0
  AND length(file.outlinks) = 0
```

### Notas recientes
```dataview
LIST
FROM ""
WHERE file.cday >= date(today) - dur(7 days)
SORT file.cday DESC
```

## Consejos de búsqueda

1. **Sé específico**: Usa comillas para frases exactas
2. **Usa operadores**: Combinar filtros es poderoso
3. **Guarda patrones**: Las búsquedas frecuentes comoDataview
4. **Revisa resultados**: No todo lo que aparece es relevante

## 🔗 Relacionado

- [[Etiquetas]]
- [[Metadatos]]
- [[Contenedores]]

#busqueda #encontrar #productividad
""",
    },
    "CD Flujo de lectura.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#lectura"],
        "title": "Flujo de Lectura para el Cerebro Digital",
        "content": """# 📖 Flujo de Lectura para el Cerebro Digital

## El proceso de lectura productiva

### Fase 1: Selección
- **Pregunta clave**: ¿Este contenido es relevante para mis objetivos?
- **Filtro de calidad**: ¿La fuente es confiable?
- **Relevancia temporal**: ¿Es útil ahora o después?

### Fase 2: Lectura activa
1. **Skim inicial**: Estructura y conclusiones
2. **Identificar ideas clave**: ¿Qué es nuevo?
3. **Conectar con conocimiento existente**: ¿Cómo se relaciona?
4. **Tomar notas**: No copiar, sino procesar

### Fase 3: Procesamiento
```
Fuente → Fleeting Notes → Literature Notes → Permanent Notes
```

### Fase 4: Integración
- Añadir a MOC relevante
- Crear conexiones con notas existentes
- Actualizar líneas de pensamiento

## Sistema de captura

### Para libros
```markdown
---
type: libro
autor: [Nombre]
status: leyendo
created: [fecha]
---

# [Título]

## Resumen
[200 palabras máximo]

## Ideas clave
1. [Idea 1]
2. [Idea 2]
3. [Idea 3]

## Citas favoritas
> "[Cita 1]"

## Conexiones
- [[Nota relacionada 1]]
- [[Nota relacionada 2]]
```

### Para artículos
```markdown
---
type: articulo
fuente: URL
created: [fecha]
---

# [Título]

## Punto principal
[Una oración]

## Resumen
[5-10 bullets]

## Mi take
[¿Qué significa para mí?]
```

## Regla de los 7±2

No procesar más de 7 ideas de una fuente. Si hay más, dividir en múltiples notas.

## Después de leer

### Inmediato (mismo día)
- Crear notas literatura
- Añadir conexiones básicas

### Próxima revisión (semana)
- Revisar notas creadas
- Crear notas permanentes si aplica

### Revisión mensual
- ¿Qué aprendí que estoy aplicando?
- ¿Qué necesito profundizar?

## 🔗 Relacionado

- [[Notas]]
- [[Enlace Wikilink]]
- [[Líneas de pensamiento o conocimiento]]

#lectura #aprendizaje #procesamiento
""",
    },
    "Lienzo de la vida en 7 notas tipo.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#lienzo"],
        "title": "Lienzo de la Vida en 7 Notas",
        "content": """# 🎨 Lienzo de la Vida en 7 Notas Tipo

## El concepto

Basado en el "Life Canvas" - una metodología para visualizar tu vida completa en 7 notas interconectadas.

## Las 7 notas

### 1. 👁️ Visión
**¿Quién quiero ser?**
- Valores fundamentales
- Visión a largo plazo
- Legado que quiero dejar

### 2. 🎯 Propósito
**¿Para qué estoy aquí?**
- Misión personal
- Contribución al mundo
- Sentido de existencia

### 3. 💎 Valores
**¿En qué creo?**
- Principios guía
- Límites que no cruzo
- Prioridades claras

### 4. 🏆 Logros
**¿Qué he conseguido?**
- Hitos importantes
- Proyectos completados
- Lecciones aprendidas

### 5. 🌱 Crecimiento
**¿Qué estoy aprendiendo?**
- Habilidades en desarrollo
- Conocimiento nuevo
- Áreas de mejora

### 6. ❤️ Relaciones
**¿Quiénes son importantes?**
- Familia y amigos
- Comunidad
- Mentores y mentees

### 7. 🏠 Espacio
**¿Dónde thrive?**
- Entorno ideal
- Rutinas que funcionan
- Herramientas que uso

## Cómo usarlas

### Revisión trimestral
Cada 3 meses, revisar cada nota:
1. ¿Ha cambiado algo?
2. ¿Sigue siendo relevante?
3. ¿Necesito actualizar?

### Conexiones
Estas notas deben estar interconectadas:
- Visión → Propósito
- Valores → Decisiones
- Logros → Confianza
- Crecimiento → Futuro
- Relaciones → Apoyo
- Espacio → Productividad

## Plantilla básica

```markdown
# [Nombre de la Nota]

## ¿Qué es?
[Definición en mis propias palabras]

## Estado actual
[Donde estoy hoy]

## ¿Hacia dónde voy?
[Próximos pasos]

## 🔗 Relacionado
- [[Visión]]
- [[Propósito]]
- [[Valores]]
```

## 🔗 Relacionado

- [[MI VISIÓN]]
- [[PRINCIPIOS, PILARES]]
- [[202502 RUEDA VIDA]]

#lienzo #vida #7notas #reflexion
""",
    },
    "Gestión tareas diagrama.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#tareas"],
        "title": "Diagrama de Gestión de Tareas",
        "content": """# 📊 Diagrama de Gestión de Tareas

## El diagrama completo

```
                    ┌─────────────────────┐
                    │      INBOX          │
                    │   (Captura rápida)  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  ¿Es accionable?    │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼─────┐       ┌──────▼──────┐      ┌──────▼──────┐
    │    NO     │       │   ¿<2min?   │      │ ¿Proyecto?  │
    │           │       │             │      │             │
    └─────┬─────┘       └──────┬──────┘      └──────┬──────┘
          │                    │                    │
    ┌─────▼─────┐       ┌──────▼──────┐      ┌──────▼──────┐
    │BASURA o   │       │   HACER     │      │  PROYECTO   │
    │REFERENCIA │       │   AHORA     │      │             │
    └───────────┘       └─────────────┘      └──────┬──────┘
                                                     │
                                              ┌──────▼──────┐
                                              │  Descomponer│
                                              │ en próximos │
                                              │   pasos     │
                                              └─────────────┘
```

## Implementación en Obsidian

### 1. Inbox (Daily Notes)
```markdown
## Inbox
- [ ] Llamar al dentista
- [ ] Revisar email de cliente
- [ ] Idea nueva para proyecto
```

### 2. Listas por contexto
- `@casa` - Tareas en casa
- `@oficina` - Tareas en trabajo
- `@computadora` - Necesito computadora
- `@telefono` - Necesito teléfono

### 3. Proyectos
```markdown
---
type: proyecto
estado: activo
created: 2026-03-29
---

# Presupuesto ITB

## Próximo paso
- [ ] Revisar datos históricos

## Tareas
- [x] Definir alcance
- [ ] Calcular costos
- [ ] Presentar propuesta
```

### 4. Revisión semanal
Cada domingo:
1. Vaciar inbox
2. Revisar proyectos
3. Planificar semana

## Trucos

### Para tareas grandes
Dividir en pasos de 15-30 minutos.

### Para procrastinación
Empezar por la tarea más fácil.

### Para priorización
Usar matriz urgente/importante.

## 🔗 Relacionado

- [[GTD Flujograma]]
- [[Etiquetas]]
- [[Notas]]

#tareas #gestion #diagrama #productividad
""",
    },
    "Presentación Elementos CEREBRO DIGITAL.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#presentacion"],
        "title": "Elementos del Cerebro Digital",
        "content": """# 🧠 Elementos del Cerebro Digital

## Los componentes esenciales

### 1. 📥 CAPTURA (Capture)
**¿Qué?** Recoger toda información relevante
**Cómo?** Inbox, notas rápidas, voz, web clips
**Regla:** Todo lo que llama tu atención entra aquí

### 2. 🗂️ ORGANIZAR (Organize)
**¿Qué?** Procesar y categorizar la información
**Cómo?** 
- ¿Es accionable? → Tarea/Proyecto
- ¿Es referencia? → Nota permanente
- ¿No sirve? → Eliminar

**Estructura:**
- PARA (Proyectos, Áreas, Recursos, Archivo)
- Zettelkasten (Notas permanentes conectadas)

### 3. 🔄 REVISAR (Review)
**¿Qué?** Revisar el sistema regularmente
**Frecuencia:**
- Diaria: Inbox vacío
- Semanal: Revisión completa
- Mensual: Reestructuración

**Preguntas clave:**
- ¿Estoy usando el sistema?
- ¿Hay cosas que no conecto?
- ¿Qué puedo mejorar?

### 4. 🧠 CREAR (Create)
**¿Qué?** Generar nuevo conocimiento
**Cómo?**
- Conectar notas existentes
- Escribir sobre lo aprendido
- Enseñar a otros

### 5. 🎯 ENFOCAR (Focus)
**¿Qué?** Elegir qué hacer
**Según:**
- Contexto (¿dónde estoy?)
- Tiempo (¿cuánto tengo?)
- Energía (¿cómo estoy?)
- Prioridad (¿qué es importante?)

---

## El flujo completo

```
INFORMACIÓN → CAPTURAR → ORGANIZAR → REVISAR → CREAR
      ↑                                        ↓
      └────────── APLICAR EN VIDA ←────────────┘
```

## Beneficios

1. **Mente clara**: Todo fuera de la cabeza
2. **Conexiones**: Ideas que no verías de otra forma
3. **Recuperación**: Encontrar cualquier cosa en segundos
4. **Aprendizaje**: Retención mejorada
5. **Creatividad**: Nuevas ideas por conexión

## Implementación en Obsidian

| Elemento | Implementación |
|----------|---------------|
| Captura | QuickAdd, Daily Notes |
| Organizar | Carpetas PARA, Tags |
| Revisar | Dataview queries |
| Crear | Notas permanentes |
| Enfocar | Dashboard, Tareas |

## 🔗 Relacionado

- [[000 Construye tu CEREBRO DIGITAL]]
- [[MI VISIÓN]]
- [[Contenedores]]

#cerobro-digital #elementos #sistema
""",
    },
    "Cómo tomar notas con nuestras palabras.md": {
        "tags": ["#para/r/memoria-digital", "#zk/permanent", "#notas"],
        "title": "Cómo Tomar Notas con Nuestras Palabras",
        "content": """# ✍️ Cómo Tomar Notas con Nuestras Palabras

## El error de copiar y pegar

### Por qué NO debemos copiar
1. **No aprendemos**: Copiar es mecánico, no cognitivo
2. **No conectamos**: El contenido copiado no se vincula con nuestro conocimiento
3. **No recordamos**: La memoria requiere procesamiento activo
4. **No usamos**: Rara vez volvemos a leer copias exactas

## El proceso correcto

### Paso 1: Consumir
Lee, escucha o mira el contenido una vez completo.

### Paso 2: Reflexionar
Pregúntate:
- ¿Qué fue lo más importante?
- ¿Cómo se conecta con lo que ya sé?
- ¿Qué haré diferente con esta información?

### Paso 3: Parafrasear
Escribe con TUS palabras:
- Conceptos clave (no frases literales)
- Ejemplos propios
- Conexiones personales

### Paso 4: Ejemplificar
Crea 2-3 ejemplos propios:
- Situaciones de tu vida
- Casos de tu trabajo
- Analogías personales

## Ejemplo práctico

### Original
> "El Zettelkasten es un sistema de toma de notas developed por Niklas Luhmann que se basa en la creación de notas atómicas interconectadas."

### Mal (copiar)
El Zettelkasten es un sistema de toma de notas developed por Niklas Luhmann que se basa en la creación de notas atómicas interconectadas.

### Bien (procesar)
**Zettelkasten**: Método de Luhmann para organizar ideas.
- Cada nota = una idea atómica
- Conexiones entre notas son clave
- Crece orgánicamente con el tiempo
- Ejemplo: Mi sistema de notas sobre productividad se conecta con mi sistema de hábitos

## Técnicas de parafraseo

### 1. Explica como a un amigo
Si no puedes explicarlo simple, no lo entiendes.

### 2. Usa analogías personales
"A esto se parece cuando..."

### 3. Conecta con experiencias
"Esto me recuerda cuando..."

### 4. Resume en una frase
"La idea principal es que..."

## Plantilla de notas procesadas

```markdown
## Concepto original
[Idea principal en mis palabras]

## Por qué es importante
[Relevancia para mí]

## Ejemplo propio
[Un caso de mi vida/trabajo]

## Conexiones
- [[Relación con nota existente 1]]
- [[Relación con nota existente 2]]

## Acción
[¿Qué hago con esta información?]
```

## 🔗 Relacionado

- [[Notas]]
- [[Cómo debemos nombrar las notas]]
- [[Líneas de pensamiento o conocimiento]]

#notas #procesamiento #aprendizaje #palabras
""",
    },
}


def fill_demo_notes():
    """Rellena todas las notas DEMO con contenido real"""
    vision_folder = VAULT / "000 - 🧭 VISIÓN - OBJETIVOS"
    cerebro_folder = VAULT / "200 - 🌍 MEMORIA DIGITAL" / "202 - 🧠🧱 CEREBRO DIGITAL"

    filled = 0
    errors = []

    for filename, data in DEMO_CONTENT.items():
        # Determine target folder
        if "VISION" in str(vision_folder) and any(
            x in filename
            for x in [
                "RUEDA",
                "VISION",
                "OBJETIVOS",
                "PROPOSITO",
                "MI VISIÓN",
                "PRINCIPIOS",
                "TAREAS",
                "Balance",
            ]
        ):
            target_folder = vision_folder
        else:
            target_folder = cerebro_folder

        target_file = target_folder / filename

        try:
            # Check if file exists
            if target_file.exists():
                content = target_file.read_text(encoding="utf-8")
                # Check if it's a DEMO note
                if (
                    "Contenido pendiente de completar" in content
                    or "Puedes encontrar esta nota rellena en la plantilla de los módulos premium"
                    in content
                ):
                    # Replace with real content
                    new_content = f"""---
tags: {data["tags"]}
created: 2025-01-08
updated: 2026-03-29
status: active
priority: medium
---

{data["content"]}
"""
                    target_file.write_text(new_content, encoding="utf-8")
                    filled += 1
                    print(f"✅ Filled: {filename}")
                else:
                    print(f"⏭️  Already filled: {filename}")
            else:
                print(f"❌ Not found: {filename}")
                errors.append(filename)

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")
            errors.append(filename)

    return filled, errors


if __name__ == "__main__":
    print("🔄 Filling DEMO notes with real content...")
    filled, errors = fill_demo_notes()
    print(f"\n✅ Filled {filled} notes")
    if errors:
        print(f"❌ Errors: {errors}")
