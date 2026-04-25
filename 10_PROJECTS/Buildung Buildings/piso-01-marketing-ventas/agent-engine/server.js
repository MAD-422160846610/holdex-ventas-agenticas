require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const { triggerScoutAgent } = require('./agent');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------
// 1. WEBHOOK: Recibe leads desde la Landing Page
// ----------------------------------------------------
app.post('/api/webhook/leads', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email requerido' });
    }

    try {
        const stmt = db.prepare('INSERT INTO leads (email) VALUES (?)');
        const info = stmt.run(email);
        
        console.log(`[SYS] Nuevo lead ingresado: ${email}`);
        
        // Disparar la IA del SCOUT de forma asíncrona
        triggerScoutAgent(info.lastInsertRowid, email);
        
        res.json({ success: true, id: info.lastInsertRowid });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ----------------------------------------------------
// 2. SCAN DASHBOARD: API para que Josué vea los leads
// ----------------------------------------------------
app.get('/api/scan/leads', (req, res) => {
    try {
        const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener leads' });
    }
});

// Aprobar o rechazar un lead manualmente
app.post('/api/scan/leads/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // ej: 'APPROVED', 'REJECTED'
    
    try {
        const stmt = db.prepare('UPDATE leads SET status = ? WHERE id = ?');
        stmt.run(status, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`[AGENT_ENGINE] Servidor orquestador corriendo en http://localhost:${PORT}`);
    console.log(`[AGENT_ENGINE] Esperando comandos...`);
});
