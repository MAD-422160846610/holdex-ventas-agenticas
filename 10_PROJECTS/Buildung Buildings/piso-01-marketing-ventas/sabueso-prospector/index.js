require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// OpenRouter SDK configuration using the OpenAI compatible SDK
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
    "X-Title": "Sabueso Prospector MVP", // Required by OpenRouter
  }
});

// CSV path and HTML output path
const CSV_FILE = 'leads.csv';
const HTML_FILE = 'ventas_para_hoy.html';

// Delay helper to avoid rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeWebsite(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  try {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    const html = await response.text();
    const $ = cheerio.load(html);
    
    let text = '';
    $('h1, h2, h3, p').each((i, el) => {
      text += $(el).text() + ' ';
    });
    return text.replace(/\s+/g, ' ').substring(0, 3000);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log(`[!] Timeout alcanzado para ${url}. Saltando...`);
    } else {
      console.log(`[!] Error scraping ${url}: ${error.message}`);
    }
    return null;
  }
}


async function qualifyAndDraftEmail(lead, scrapedText) {
  console.log(`[*] Evaluando: ${lead.nombre_empresa}...`);
  
  const systemPrompt = `Eres un experto en ventas B2B (SDR). Tu objetivo es analizar la información de un lead (Estudio de Abogados) y redactar un correo en frío (cold email).
Tu oferta es montar un "departamento de ventas especializado para servicios legales", ayudando al estudio a convertir más consultas en clientes de alto valor.

Debes devolver un JSON con la siguiente estructura estricta:
{
  "qualified": boolean, 
  "reason": "Por qué es o no es un buen lead",
  "subject": "Asunto atractivo para el correo",
  "body": "Cuerpo del correo persuasivo, profesional y conciso."
}

Reglas:
- Si no parece un estudio de abogados o es de otro rubro, pon qualified en false.
- El correo debe ser corto (max 3-4 párrafos), ir al grano y buscar una llamada de 10 min.
- Tono: Profesional, directo y orientado a resultados.`;

  const userPrompt = `
Datos del Lead:
Nombre: ${lead.nombre_empresa}
Sitio Web: ${lead.website}

Información extraída del sitio web (si existe):
${scrapedText ? scrapedText : 'No se pudo obtener información del sitio web.'}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const resultText = response.choices[0].message.content;
    const result = JSON.parse(resultText);
    return result;
  } catch (error) {
    console.error(`[!] Error en IA para ${lead.nombre_empresa}:`, error.message);
    return {
      qualified: false,
      reason: `Error en OpenRouter: ${error.message}`,
      subject: "",
      body: ""
    };
  }
}

function generateHTML(results) {
  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sabueso Prospector - Ventas para Hoy</title>
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; background-color: #f4f4f5; color: #18181b; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
        .qualified { background: #dcfce7; color: #166534; }
        .unqualified { background: #fee2e2; color: #991b1b; }
        h2 { margin-top: 0; font-size: 20px; }
        .reason { color: #52525b; font-style: italic; font-size: 14px; margin-bottom: 15px; }
        .email-preview { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 14px; }
        .action-btn { display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; margin-top: 15px; }
        .action-btn:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Sabueso Prospector 🕵️‍♂️</h1>
            <p>Borradores generados para hoy. Revisa y envía.</p>
        </div>
`;

  results.forEach(r => {
    if (!r.analysis) return;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(r.analysis.subject || '')}&body=${encodeURIComponent(r.analysis.body || '')}`;
    
    html += `
        <div class="card">
            <span class="status ${r.analysis.qualified ? 'qualified' : 'unqualified'}">
                ${r.analysis.qualified ? 'CALIFICADO' : 'DESCARTADO'}
            </span>
            <h2>${r.lead.nombre_empresa || 'Empresa'}</h2>
            ${r.lead.website ? `<p><a href="${r.lead.website}" target="_blank">${r.lead.website}</a></p>` : ''}
            <p class="reason">🤖 Análisis: ${r.analysis.reason}</p>
            
            ${r.analysis.qualified ? `
            <div class="email-preview"><strong>Asunto:</strong> ${r.analysis.subject}

${r.analysis.body}</div>
            <a href="${mailtoLink}" target="_blank" class="action-btn">✉️ Abrir en Gmail (Draft)</a>
            ` : ''}
        </div>
    `;
  });

  html += `
    </div>
</body>
</html>`;

  fs.writeFileSync(HTML_FILE, html);

}

async function main() {
  if (!OPENROUTER_API_KEY) {
    console.error("Falta OPENROUTER_API_KEY en .env");
    process.exit(1);
  }

  const leads = [];
  
  if (!fs.existsSync(CSV_FILE)) {
    console.log(`[!] No se encontró el archivo ${CSV_FILE}. Crea un archivo de prueba.`);
    process.exit(1);
  }

  fs.createReadStream(CSV_FILE)
    .pipe(csv())
    .on('data', (data) => leads.push(data))
    .on('end', async () => {
      console.log(`[*] Se cargaron ${leads.length} leads. Iniciando procesamiento...`);
      const results = [];

      let count = 0;
      for (const lead of leads) {
        count++;
        let scrapedText = null;
        if (lead.website && lead.website.trim() !== '') {
          console.log(`[*] [${count}/${leads.length}] Scrapeando web: ${lead.website}`);
          scrapedText = await scrapeWebsite(lead.website);
          await delay(1000);
        }

        const analysis = await qualifyAndDraftEmail(lead, scrapedText);
        results.push({ lead, analysis });
        
        // Save progress after each lead
        generateHTML(results);
        
        await delay(2000);
      }
      console.log("[✔] Procesamiento completado.");

      console.log("[+] Proceso terminado con éxito.");
    });
}

main();
