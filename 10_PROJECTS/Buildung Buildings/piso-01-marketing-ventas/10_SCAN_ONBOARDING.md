---
aliases: [Manual de Operación Sabueso, Guía Paso a Paso Piso 01]
tags: [#piso-01 #scan #onboarding #proceso #sabueso]
parent: [[piso-01-marketing-ventas]]
---

# 🎓 10_SCAN_ONBOARDING: Manual de Operación "Sabueso Prospector"

Bienvenido, **Daniel Josué (Scan)**. Tu misión no es buscar leads manualmente a lo loco; tu misión es **alimentar la máquina, aprobar con criterio y disparar ventas**. 

A continuación, el flujo EXACTO, paso a paso, de lo que tenés que hacer todos los días. Y sabés por qué? Porque los sistemas predecibles generan plata predecible. Vamos.

---

## 🛑 FASE 1: La Caza (Extracción de Leads)

No vas a buscar en Google a mano. Usamos Apify para traer datos en masa.

1. **Entrá a Apify**: Logueate en tu cuenta.
2. **Buscá el Scraper**: Usá el "Google Maps Scraper" (o similar).
3. **Configurá la Búsqueda**: 
   - Poné el término: ej. `"Estudios de abogados en Madrid"` o `"Bufetes legales corporativos en Buenos Aires"`.
   - Límite de resultados: Empezá con algo manejable, digamos 50.
4. **Ejecutá y Exportá**: Corré el scraper. Cuando termine, descargá los resultados en formato **CSV**.

## 🛑 FASE 2: La Ingesta (Preparar el alimento para el Sabueso)

El Sabueso necesita un formato claro para no atragantarse.

1. **Agarrá el CSV**: Abrí el archivo que descargaste de Apify.
2. **Filtrá lo Inútil**: Asegurate de tener principalmente 3 columnas claras (podés borrar el resto para no marearte):
   - `nombre_empresa` (El nombre del estudio)
   - `website` (o URL de LinkedIn/Instagram, de acá lee la IA)
   - `email` (Si Apify no lo trajo, el Sabueso a veces lo raspa de la web, pero es mejor tenerlo).
3. **Renombrá el archivo**: Guardalo como `leads.csv`.
4. **Ubicación**: Movelo a la carpeta raíz de nuestro código del Sabueso Prospector (donde está el `index.js`).

## 🛑 FASE 3: El Procesamiento (Que trabaje la máquina)

Acá es donde la Inteligencia Artificial hace la investigación de 4 horas en 2 minutos.

1. **Abrí la Terminal**: Ubicate en la carpeta del proyecto.
2. **Ejecutá el Script**: Escribí el siguiente comando y dale Enter:
   ```bash
   node index.js
   ```
3. **Paciencia**: Vas a ver en la consola cómo el Sabueso visita cada página, lee qué tipo de abogados son (Penales, Corporativos, Familia), e inventa un ángulo de venta personalizado usando OpenRouter/Llama3.
4. **Resultado**: Cuando termine, te va a avisar que generó un archivo llamado `ventas_para_hoy.html`.

## 🛑 FASE 4: La Aprobación (Tu momento de brillar)

Vos sos el control de calidad. Nunca enviamos algo sin que un humano diga "esto tiene sentido".

1. **Abrí el Dashboard**: Dale doble clic al archivo `ventas_para_hoy.html`. Se te abre en el navegador.
2. **Revisá la Fila**: Vas a ver una tabla austera, brutalista. Cada fila es un cliente potencial.
3. **Leé el Borrador**: Vas a ver el texto que armó la IA. ¿Tiene sentido? ¿Es convincente? 
   - *¿Está mal?* Ignoralo o editalo mentalmente.
   - *¿Está bien?* **¡Dispará!**
4. **Hacé Clic en "Enviar (Gmail)"**: Esto te abre automáticamente tu Gmail con el destinatario, el asunto y el cuerpo del correo ya pegados.
5. **Último Vistazo y Enviar**: Dale una leída rápida en Gmail, ajustá si sentís que suena muy "robot", y mandalo.

---

### 🚨 Reglas de Oro para Scan

- **No modifiques el CSV a mano más de la cuenta:** El objetivo es volumen. Si un lead viene vacío, que falle y pasamos al siguiente.
- **Si el borrador de la IA es consistentemente malo:** No lo corrijas vos en Gmail 50 veces. Avisame y **corregimos el Prompt en el `index.js`**. Arreglamos la matriz, no la copia.
- **Disciplina:** Correr este ciclo 1 vez al día, todos los días. Consistency beats intensity.

¿Se entiende el flujo, hermano? Es extracción, ingesta, procesamiento y aprobación. Cero fricción.
