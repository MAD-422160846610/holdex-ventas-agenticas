const OpenAI = require('openai');
const db = require('./database');

let openai = null;
if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('tu_clave')) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

async function triggerScoutAgent(leadId, email) {
    console.log(`[AGENT:SCOUT] Iniciando análisis para: ${email}`);
    
    // Si no hay API KEY, mockeamos la respuesta para el Dogfooding
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('tu_clave')) {
        console.log(`[AGENT:SCOUT] API Key no configurada. Usando mock mode.`);
        setTimeout(() => {
            const mockAnalysis = `Mock Analysis: Empresa potencial encontrada en base al dominio ${email.split('@')[1]}. Parece cumplir el ICP.`;
            const stmt = db.prepare('UPDATE leads SET status = ?, scout_analysis = ? WHERE id = ?');
            stmt.run('SCOUT_ANALYZED', mockAnalysis, leadId);
            console.log(`[AGENT:SCOUT] Análisis mock completado para: ${email}`);
        }, 3000);
        return;
    }

    try {
        const prompt = `
            Eres el agente SCOUT de Holdex Ventas.
            Tu misión es analizar el siguiente lead y determinar si cumple el ICP:
            Lead Email: ${email}
            
            Busca información pública sobre el dominio de la empresa.
            Devuelve un breve análisis de 2 párrafos sobre si califica o no para nuestros servicios de Infraestructura Agéntica.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: prompt }]
        });

        const analysis = response.choices[0].message.content;
        
        const stmt = db.prepare('UPDATE leads SET status = ?, scout_analysis = ? WHERE id = ?');
        stmt.run('SCOUT_ANALYZED', analysis, leadId);
        
        console.log(`[AGENT:SCOUT] Análisis real completado para: ${email}`);
    } catch (error) {
        console.error(`[AGENT:SCOUT] Error analizando lead:`, error);
        const stmt = db.prepare('UPDATE leads SET status = ?, scout_analysis = ? WHERE id = ?');
        stmt.run('ERROR_SCOUT', error.message, leadId);
    }
}

module.exports = { triggerScoutAgent };
