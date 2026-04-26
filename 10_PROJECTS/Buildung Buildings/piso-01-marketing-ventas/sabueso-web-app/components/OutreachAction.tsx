"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendOutreachAction } from "@/lib/actions/emails";
import { processLeadWithAIAction } from "@/lib/actions/leads";

interface OutreachActionProps {
  leadId: string;
  leadEmail: string;
  leadName: string;
  defaultDraft: string;
}

export function OutreachAction({
  leadId,
  leadEmail,
  leadName,
  defaultDraft,
}: OutreachActionProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "processing">("idle");
  const [subject, setSubject] = useState(`Propuesta Estratégica - Buildung Buildings x ${leadName}`);
  const [message, setMessage] = useState(defaultDraft);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend() {
    if (subject.trim() === '') {
      setStatus("error");
      setErrorMsg("El asunto no puede estar vacío");
      return;
    }
    if (message.trim() === '') {
      setStatus("error");
      setErrorMsg("El mensaje no puede estar vacío");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("leadId", leadId);
    formData.append("leadEmail", leadEmail);
    formData.append("leadName", leadName);
    formData.append("subject", subject);
    formData.append("customMessage", message);

    const result = await sendOutreachAction(formData);

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Error desconocido");
    }
  }

  async function handleAIProcess() {
    setStatus("processing");
    setErrorMsg("");

    const result = await processLeadWithAIAction(leadId);

    if (result.success) {
      setStatus("idle");
      router.refresh();
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Error al procesar con IA");
    }
  }

  if (status === "success") {
    return (
      <div 
        id="outreach-success-container" 
        className="brutalist-card scanlines" 
        style={{ 
          borderColor: "var(--accent-green)", 
          textAlign: "center",
          background: "rgba(0, 255, 102, 0.05)",
          animation: "flicker 0.3s infinite alternate"
        }}
      >
        <div className="tag" style={{ background: "var(--accent-green)", color: "black", marginBottom: "1.5rem" }}>
          CONFIRMACION_SISTEMA_
        </div>
        <h3 id="outreach-success-msg" style={{ color: "var(--accent-green)", fontSize: "1.5rem", fontWeight: "900", marginBottom: "1rem" }}>
          ATAQUE_EXITOSO_
        </h3>
        <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "1rem" }}>
          El mail fue inyectado correctamente vía Resend. Protocolo de outreach completado.
        </p>
        <div id="confirmation-token" style={{ fontSize: "0.7rem", color: "#444", fontFamily: "monospace", marginBottom: "1.5rem" }}>
          STATUS: MAIL_SENT_SUCCESSFULLY
          TOKEN: {new Date().getTime().toString().slice(-6)}
        </div>
        
        <button 
          id="send-another-btn"
          onClick={() => setStatus("idle")}
          className="brutalist-border hover-invert"
          style={{ 
            width: "100%",
            background: "transparent", 
            color: "white", 
            padding: "1rem", 
            cursor: "pointer",
            fontWeight: "800"
          }}
        >
          PREPARAR_NUEVO_ATAQUE_
        </button>
      </div>
    );
  }

  return (
    <div className="brutalist-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3 style={{ fontSize: "1rem", color: "#444" }}>ACCIONES_SDR_</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="email-subject-input" style={{ fontSize: "0.7rem", color: "#666" }}>ASUNTO_DEL_MAIL_ [REQUIRED]</label>
        <input
          id="email-subject-input"
          name="email-subject-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Escribí el asunto aquí..."
          style={{
            background: "#050505",
            color: "#ccc",
            border: "1px solid #333",
            padding: "0.8rem",
            fontFamily: "inherit",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="email-body-textarea" style={{ fontSize: "0.7rem", color: "#666" }}>DRAFT_PERSONALIZADO_</label>
        <textarea
          id="email-body-textarea"
          name="email-body-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          style={{
            background: "#050505",
            color: "#ccc",
            border: "1px solid #333",
            padding: "0.8rem",
            fontFamily: "inherit",
            fontSize: "0.9rem",
            resize: "none"
          }}
        />
      </div>

      <button
        id="send-outreach-btn"
        onClick={handleSend}
        disabled={status === "sending"}
        className="brutalist-border hover-invert"
        style={{
          width: "100%",
          background: status === "sending" ? "#333" : "var(--accent-green)",
          color: "black",
          padding: "1rem",
          fontWeight: "800",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          transition: "all 0.2s"
        }}
      >
        {status === "sending" ? "ENVIANDO_..." : "DISPARAR_ATAQUE_"}
      </button>

      {status === "error" && (
        <p id="outreach-error-msg" style={{ color: "#ff0033", fontSize: "0.8rem", marginTop: "0.5rem", fontWeight: "bold" }}>
          ERROR: {errorMsg}
        </p>
      )}

      <button
        id="trigger-ai-btn"
        onClick={handleAIProcess}
        disabled={status === "processing" || status === "sending"}
        className="brutalist-border"
        style={{
          width: "100%",
          background: "transparent",
          color: "white",
          padding: "1rem",
          fontWeight: "800",
          cursor: (status === "processing" || status === "sending") ? "not-allowed" : "pointer",
          opacity: (status === "processing" || status === "sending") ? 0.5 : 1
        }}
      >
        {status === "processing" ? "PROCESANDO_..." : "RE-GENERAR_CON_AI_"}
      </button>

      <button
        id="handover-closer-btn"
        className="brutalist-border"
        style={{
          width: "100%",
          background: "var(--accent-gold)",
          color: "black",
          padding: "1rem",
          fontWeight: "800",
          cursor: "pointer"
        }}
      >
        HANDOVER_CLOSER_
      </button>
    </div>
  );
}
