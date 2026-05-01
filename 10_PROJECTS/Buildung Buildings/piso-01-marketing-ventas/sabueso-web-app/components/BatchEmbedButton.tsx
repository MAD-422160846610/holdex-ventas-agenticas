"use client";

import { useState, useTransition } from "react";
import { batchEmbedPeopleAction } from "@/lib/actions/search";
import { Database, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function BatchEmbedButton() {
  const [result, setResult] = useState<{
    count?: number;
    error?: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEmbed() {
    setResult(null);
    startTransition(async () => {
      const res = await batchEmbedPeopleAction();
      if (res.success) {
        setResult({ count: res.count });
      } else {
        setResult({ error: res.error });
      }
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
      <button
        id="batch-embed-button"
        onClick={handleEmbed}
        disabled={isPending}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          background: isPending ? "#111" : "transparent",
          border: "1px solid var(--accent-purple)",
          color: isPending ? "#555" : "var(--accent-purple)",
          fontSize: "0.65rem",
          fontWeight: "900",
          fontFamily: "monospace",
          letterSpacing: "2px",
          cursor: isPending ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (!isPending) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(168, 85, 247, 0.08)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = isPending
            ? "#111"
            : "transparent";
        }}
      >
        {isPending ? (
          <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <Database size={14} />
        )}
        {isPending ? "PROCESANDO_EMBEDDINGS..." : "GENERAR_EMBEDDINGS_"}
      </button>

      {result && !result.error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.65rem",
            color: "var(--accent-green)",
            fontFamily: "monospace",
          }}
        >
          <CheckCircle size={14} />
          {result.count === 0
            ? "Todos los registros ya tienen embedding."
            : `${result.count} prospectos embebidos correctamente.`}
        </div>
      )}

      {result?.error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.65rem",
            color: "#ff003c",
            fontFamily: "monospace",
          }}
        >
          <AlertCircle size={14} />
          ERROR: {result.error}
        </div>
      )}
    </div>
  );
}
