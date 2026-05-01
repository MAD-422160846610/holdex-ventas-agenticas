import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SemanticSearchClient from "@/components/SemanticSearchClient";
import { Search } from "lucide-react";

export const metadata = {
  title: "Búsqueda Semántica — Sabueso V2",
  description: "Motor de búsqueda vectorial sobre prospectos y actividades",
};

export default async function SearchPage() {
  const user = await stackServerApp.getUser();
  if (!user) redirect("/handler/sign-in");

  return (
    <main
      className="scanlines"
      style={{ minHeight: "100vh", padding: "2rem", position: "relative" }}
    >
      <div className="cyber-bg" />

      <header
        style={{
          marginBottom: "3rem",
          borderBottom: "1px solid rgba(0, 255, 140, 0.2)",
          paddingBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Search size={28} style={{ color: "var(--accent-green)" }} />
          <div>
            <h1
              className="glow-text-green"
              style={{
                fontSize: "2.5rem",
                fontWeight: "900",
                letterSpacing: "-2px",
                color: "var(--accent-green)",
              }}
            >
              BUSQUEDA_SEMANTICA_
            </h1>
            <p
              className="font-mono"
              style={{ color: "#8b949e", marginTop: "0.25rem", fontSize: "0.75rem" }}
            >
              [ MOTOR_VECTORIAL · pgvector · text-embedding-3-small · 1536 DIMS ]
            </p>
          </div>
        </div>
      </header>

      <SemanticSearchClient />
    </main>
  );
}
