require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// PAPERCLIP GATEWAY
// Este servicio actúa como puente entre la Landing Page y Paperclip.
// ----------------------------------------------------

const PAPERCLIP_API_URL = process.env.PAPERCLIP_API_URL || "https://api.paperclip.run/v1/issues";
const PAPERCLIP_BOARD_ID = process.env.PAPERCLIP_BOARD_ID;
const PAPERCLIP_API_KEY = process.env.PAPERCLIP_API_KEY;

app.post('/api/webhook/leads', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email requerido' });
    }

    console.log(`[GATEWAY] Recibido lead de la Landing: ${email}`);

    try {
        // Enviar a Paperclip para crear el Issue
        // Esto despierta automáticamente al agente Scout dentro del Board de Ventas
        
        if (!PAPERCLIP_API_KEY) {
            console.log(`[GATEWAY] MODO PRUEBA: Simulando envío a Paperclip Board para ${email}`);
            // Mock delay
            await new Promise(r => setTimeout(r, 1000));
            return res.json({ 
                success: true, 
                message: "Lead aceptado en modo prueba (Sin API Key de Paperclip)",
                lead: email 
            });
        }

        const response = await fetch(PAPERCLIP_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAPERCLIP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                boardId: PAPERCLIP_BOARD_ID,
                title: `Nuevo Lead: ${email}`,
                description: `Lead capturado desde la Landing Page de Holdex Ventas.\n\n**Email**: ${email}\n**Origen**: Formulario CTA\n\nPor favor, iniciar protocolo Scout.`,
                tags: ["inbound", "landing-ventas"],
                assignee: "Lead-Scout" // Esto le avisa al agente en Paperclip
            })
        });

        if (!response.ok) {
            throw new Error(`Error de Paperclip: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[GATEWAY] Issue creado en Paperclip exitosamente. ID: ${data.id}`);

        res.json({ success: true, paperclipIssueId: data.id });
    } catch (err) {
        console.error("[GATEWAY] Error al enviar a Paperclip:", err.message);
        res.status(500).json({ error: 'Error al procesar el lead en el orquestador.' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`[PAPERCLIP GATEWAY] Servidor corriendo en http://localhost:${PORT}`);
    console.log(`[PAPERCLIP GATEWAY] Escuchando leads para inyectar en Paperclip...`);
});
