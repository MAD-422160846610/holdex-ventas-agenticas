"use client";

import { useState, useTransition, useCallback } from "react";
import { semanticSearchAction, type SemanticSearchResult } from "@/lib/actions/search";
import { Search, Users, Activity, Loader2, Zap } from "lucide-react";
import Link from "next/link";

function SimilarityBar({ similarity }: { similarity: number }) {
  const pct = Math.round(similarity * 100);
  const color =
    pct >= 75
      ? "var(--accent-green)"
      : pct >= 50
      ? "var(--accent-yellow)"
      : "var(--accent-purple)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
      <div
        style={{
          flex: 1,
          height: "2px",
          background: "#111",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${pct}%`,
            height: "100%",
            background: color,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.55rem",
          color,
          fontWeight: "900",
          minWidth: "32px",
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

function ResultCard({ result }: { result: SemanticSearchResult }) {
  const Icon = result.type === "person" ? Users : Activity;
  const accentColor =
    result.type === "person" ? "var(--accent-green)" : "var(--accent-purple)";

  return (
    <Link
      href={result.href}
      style={{ textDecoration: "none" }}
    >
      <div
        className="brutalist-card"
        style={{
          padding: "1rem 1.25rem",
          borderLeft: `3px solid ${accentColor}`,
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.02)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "";
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <Icon
            size={14}
            style={{ color: accentColor, marginTop: "2px", flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: "900",
                color: "white",
                marginBottom: "0.15rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {result.title}
            </p>
            <p
              style={{
                fontSize: "0.6rem",
                color: "#8b949e",
                marginBottom: "0.1rem",
              }}
            >
              {result.subtitle}
            </p>
            <p style={{ fontSize: "0.55rem", color: "#555" }}>{result.detail}</p>
            <SimilarityBar similarity={result.similarity} />
          </div>
          <span
            style={{
              fontSize: "0.5rem",
              color: accentColor,
              border: `1px solid ${accentColor}`,
              padding: "2px 6px",
              fontWeight: "900",
              flexShrink: 0,
            }}
          >
            {result.type.toUpperCase()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SemanticSearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = useCallback(
    (q: string) => {
      if (!q || q.trim().length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setError(null);
      startTransition(async () => {
        const res = await semanticSearchAction(q);
        setHasSearched(true);
        if (res.success) {
          setResults(res.results ?? []);
        } else {
          setError(res.error ?? "Error desconocido.");
          setResults([]);
        }
      });
    },
    []
  );

  const people = results.filter((r) => r.type === "person");
  const activityResults = results.filter((r) => r.type === "activity");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Search Input */}
      <div
        style={{
          position: "relative",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#555",
            pointerEvents: "none",
          }}
        >
          {isPending ? (
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Search size={18} />
          )}
        </div>
        <input
          id="semantic-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(query);
          }}
          placeholder='Búsqueda semántica: "CTO en fintech que quiere escalar ventas"...'
          style={{
            width: "100%",
            background: "black",
            border: "1px solid rgba(0, 255, 140, 0.3)",
            color: "white",
            padding: "1rem 1rem 1rem 3rem",
            fontSize: "0.8rem",
            fontFamily: "monospace",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent-green)";
            e.target.style.boxShadow = "0 0 10px rgba(0, 255, 140, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(0, 255, 140, 0.3)";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={() => handleSearch(query)}
          disabled={isPending}
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            height: "100%",
            padding: "0 1.5rem",
            background: isPending ? "#111" : "var(--accent-green)",
            color: "black",
            border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
            fontSize: "0.65rem",
            fontWeight: "900",
            fontFamily: "monospace",
            letterSpacing: "1px",
          }}
        >
          {isPending ? "BUSCANDO..." : "EJECUTAR_"}
        </button>
      </div>

      {/* Hint */}
      {!hasSearched && !isPending && (
        <div
          className="brutalist-card"
          style={{
            padding: "2rem",
            textAlign: "center",
            borderStyle: "dashed",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <Zap size={32} style={{ color: "#333", margin: "0 auto 1rem" }} />
          <p style={{ fontSize: "0.7rem", color: "#555", fontFamily: "monospace" }}>
            Ingresá una consulta en lenguaje natural.
            <br />
            <span style={{ color: "#333" }}>
              El motor vectorial encontrará los prospectos y actividades más relevantes.
            </span>
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              '"CTO que habla de IA"',
              '"empresa de logística en crecimiento"',
              '"contacto interesado en automatización"',
            ].map((hint) => (
              <button
                key={hint}
                onClick={() => {
                  const clean = hint.replace(/"/g, "");
                  setQuery(clean);
                  handleSearch(clean);
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #222",
                  color: "#555",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  fontFamily: "monospace",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = "#555";
                  (e.target as HTMLButtonElement).style.color = "#8b949e";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = "#222";
                  (e.target as HTMLButtonElement).style.color = "#555";
                }}
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            background: "rgba(255, 0, 60, 0.05)",
            border: "1px solid rgba(255, 0, 60, 0.3)",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.7rem", color: "#ff003c", fontFamily: "monospace" }}>
            ERROR: {error}
          </p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isPending && results.length === 0 && !error && (
        <div
          className="brutalist-card"
          style={{ padding: "2rem", textAlign: "center" }}
        >
          <p style={{ fontSize: "0.7rem", color: "#555", fontFamily: "monospace" }}>
            [RESULT_SET_EMPTY] No se encontraron resultados relevantes para{" "}
            <span style={{ color: "white" }}>&quot;{query}&quot;</span>
          </p>
          <p style={{ fontSize: "0.6rem", color: "#333", marginTop: "0.5rem" }}>
            Asegurate de haber embebido los registros desde INTELIGENCIA_.
          </p>
        </div>
      )}

      {hasSearched && results.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <p className="section-label" style={{ fontSize: "0.6rem" }}>
              RESULTADOS_ [{results.length}] para{" "}
              <span style={{ color: "var(--accent-green)" }}>&quot;{query}&quot;</span>
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {people.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--accent-green)",
                    fontWeight: "900",
                    letterSpacing: "2px",
                    marginBottom: "0.75rem",
                  }}
                >
                  PROSPECTOS_ [{people.length}]
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {people.map((r) => (
                    <ResultCard key={r.id} result={r} />
                  ))}
                </div>
              </div>
            )}

            {activityResults.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--accent-purple)",
                    fontWeight: "900",
                    letterSpacing: "2px",
                    marginBottom: "0.75rem",
                  }}
                >
                  ACTIVIDADES_ [{activityResults.length}]
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {activityResults.map((r) => (
                    <ResultCard key={r.id} result={r} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
